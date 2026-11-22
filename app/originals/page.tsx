import { Intro } from "../../components/Editorial";
import { Card } from "../../components/Gallery";
import { formats } from "../../lib/catalog";
import { catalog } from "../../lib/store";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "OKHockey Originals",
  alternates: { canonical: "/originals" },
};
export default async function Page() {
  const items = (await catalog()).filter((x) => x.format);
  return (
    <div className="wrap page">
      <Intro
        kicker="@ok.hockey auf Instagram"
        first="OKHockey"
        last="Originals."
      >
        Unsere Reels und Karussells aus der Rollhockey-Szene.
      </Intro>
      {formats.map((f) => {
        const posts = items.filter((x) => x.format === f);
        return posts.length ? (
          <section className="section" key={f}>
            <div className="sectiontitle">
              <h2>{f}</h2>
            </div>
            <div className="cards">
              {posts.map((x) => (
                <Card key={x.id} item={x} />
              ))}
            </div>
          </section>
        ) : null;
      })}
      {!items.length && (
        <p>
          Die nächsten Originals erscheinen auf{" "}
          <a href="https://www.instagram.com/ok.hockey/">@ok.hockey</a>.
        </p>
      )}
    </div>
  );
}
