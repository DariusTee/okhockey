import { db, isEditor } from "../../../lib/store";
import { payload, highlight, reply } from "../../../lib/validation";
import { ownedPost } from "../../../lib/instagram-owner";
import { seeds } from "../../../lib/catalog";
export async function POST(req: Request) {
  if (!(await isEditor(req.headers)))
    return reply("Anmeldung als Redakteur erforderlich.", 403);
  try {
    const data = await payload(req);
    if (data.action === "remove-submission" && typeof data.id === "string") {
      await db()
        .prepare("DELETE FROM submissions WHERE id=?")
        .bind(data.id)
        .run();
      return reply("Einsendung gelöscht.");
    }
    const parsed = highlight.safeParse(data);
    if (!parsed.success)
      return reply(
        "Ungültiger Beitrag. Bitte prüfe Datum, Pflichtfelder und den Instagram-Beitragslink.",
        400,
      );
    const x = parsed.data;
    let verifiedPost: string | undefined;
    if (seeds.some((post) => post.url === x.url)) verifiedPost = x.url;
    else {
      const previous = await db()
        .prepare("SELECT body FROM highlights WHERE id=?")
        .bind(x.id)
        .first<{ body: string }>();
      if (previous && JSON.parse(previous.body).verifiedPost === x.url)
        verifiedPost = x.url;
    }
    if (x.published && !verifiedPost) {
      try {
        if (!(await ownedPost(x.url)))
          return reply(
            "Veröffentlichen ist nur für eigene Beiträge von @ok.hockey möglich.",
            400,
          );
        verifiedPost = x.url;
      } catch {
        return reply(
          "Instagram konnte den Urheber gerade nicht bestätigen. Du kannst den Beitrag als Entwurf speichern.",
          503,
        );
      }
    }
    const result = await db()
      .prepare(
        "INSERT INTO highlights (id,body,revision) SELECT ?1,?2,1 WHERE ?3=0 OR EXISTS(SELECT 1 FROM highlights WHERE id=?1) ON CONFLICT(id) DO UPDATE SET body=excluded.body, revision=highlights.revision+1 WHERE highlights.revision=?3 RETURNING revision",
      )
      .bind(x.id, JSON.stringify({ ...x, verifiedPost }), x.revision)
      .first();
    if (!result)
      return reply(
        "Der Beitrag wurde zwischenzeitlich geändert. Bitte lade die Seite neu.",
        409,
      );
    return reply("Gespeichert.");
  } catch (e) {
    if (e instanceof Response) return e;
    return reply("Speichern fehlgeschlagen.", 503);
  }
}
