import { Gallery } from "../../components/Gallery";
import { Intro } from "../../components/Editorial";
import { catalog } from "../../lib/store";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Instagram-Highlights",
  alternates: { canonical: "/highlights" },
};
export default async function Highlights() {
  return (
    <div className="wrap page">
      <Intro kicker="@ok.hockey auf Instagram" first="Rink" last="Highlights.">
        Unsere Reels und Beiträge. Wähle eine Szene, um das Original auf
        Instagram zu öffnen.
      </Intro>
      <Gallery items={await catalog()} />
    </div>
  );
}
