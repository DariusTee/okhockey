import { catalog } from "../../../../lib/store";
import { inspectPost } from "../../../../lib/instagram-owner";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = (await catalog()).find((item) => item.id === id);
  if (!post) return new Response(null, { status: 404 });
  try {
    const { coverUrl } = await inspectPost(post.url);
    if (!coverUrl) return new Response(null, { status: 404 });
    const image = await fetch(coverUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    const type = image.headers.get("content-type")?.split(";")[0];
    if (
      !image.ok ||
      !type ||
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(type)
    ) {
      await image.body?.cancel();
      return new Response(null, { status: 502 });
    }
    return new Response(image.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
