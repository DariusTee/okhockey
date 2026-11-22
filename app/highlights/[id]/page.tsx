import { notFound } from "next/navigation";
import { catalog } from "../../../lib/store";
import { dateLabel, postType } from "../../../lib/catalog";
import { Intro } from "../../../components/Editorial";
import { Share } from "../../../components/Gallery";
import { InstagramPreview } from "../../../components/InstagramPreview";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };
async function getItem({ params }: Props) {
  const { id } = await params;
  return (await catalog()).find((x) => x.id === id) ?? notFound();
}
export async function generateMetadata(p: Props) {
  const x = await getItem(p);
  return {
    title: x.title,
    description: x.description,
    alternates: { canonical: "/highlights/" + x.id },
    openGraph: {
      title: x.title,
      description: x.description,
      images: ["/media/brand.png"],
    },
  };
}
export default async function Detail(p: Props) {
  const x = await getItem(p);
  return (
    <div className="wrap page narrow">
      <a className="back" href="/highlights">
        Alle Beiträge
      </a>
      <Intro kicker={x.category + " / @ok.hockey"} first={x.title} last="">
        {x.description}
      </Intro>
      <p className="meta">
        {[postType(x.url), dateLabel(x.date), x.player, x.club]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <InstagramPreview key={x.url} id={x.id} url={x.url} title={x.title} />

      <a className="detail" href={x.url}>
        Original auf Instagram öffnen
      </a>
      <Share title={x.title} url={x.url} />
    </div>
  );
}
