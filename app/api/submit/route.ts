import { env } from "cloudflare:workers";
import { db, prune } from "../../../lib/store";
import { payload, submission, reply } from "../../../lib/validation";
const hour = 3600000;
export async function POST(req: Request) {
  try {
    const data = submission.safeParse(await payload(req));
    if (!data.success)
      return reply(
        "Bitte prüfe deinen Instagram-Beitragslink, die Pflichtfelder und beide Bestätigungen.",
        400,
      );
    const x = data.data;
    if (x.website) return reply("Danke für deinen Vorschlag.");
    const now = Date.now();
    await prune(now);
    const secret =
      env.RATE_KEY ||
      (process.env.NODE_ENV === "development" ? "local-development" : "");
    if (!secret)
      return reply("Die Einreichung ist vorübergehend geschlossen.", 503);
    const ip = req.headers.get("cf-connecting-ip") || "loopback";
    const window = Math.floor(now / hour);
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(window + "|" + ip),
    );
    const digest = Array.from(new Uint8Array(signature), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    const result = await db()
      .prepare(
        "INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count < 4 RETURNING count",
      )
      .bind(digest, (window + 1) * hour)
      .first();
    if (!result)
      return reply(
        "Zu viele Vorschläge in dieser Stunde. Bitte versuche es später erneut.",
        429,
      );
    await db()
      .prepare(
        "INSERT INTO submissions (id,name,email,subject,description,url,consent_version,created) VALUES (?,?,?,?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        x.name,
        x.email,
        x.subject,
        x.description,
        x.url,
        "kontakt-und-rechte-v1",
        now,
      )
      .run();
    return reply("Dein Vorschlag ist in der Redaktion angekommen.", 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return reply(
      "Speichern fehlgeschlagen. Bitte versuche es noch einmal.",
      503,
    );
  }
}
