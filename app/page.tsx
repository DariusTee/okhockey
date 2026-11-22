import { Gallery } from "../components/Gallery";
import { Community, Feature, SectionTitle } from "../components/Editorial";
import { Icon } from "../components/icons";
import { instagram } from "../lib/catalog";
import { catalog } from "../lib/store";
export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const items = await catalog();
  const featured = items.find((item) => item.featured);
  const trending = items.filter((item) => item.trending);
  return (
    <>
      <section className="hero insta-hero">
        <div className="rink-lines" aria-hidden="true">
          <i />
        </div>
        <div className="wrap heroinner">
          <div className="herocopy">
            <div className="eyebrow">
              <i /> OKHockey / Das Rollhockey-Magazin
            </div>
            <h1>
              RINK HOCKEY.
              <br />
              <em>UNFILTERED.</em>
            </h1>
            <p>
              Tore, Paraden und Geschichten aus der Halle. Die Beiträge von
              @ok.hockey und der Spieltag der Bundesliga.
            </p>
            <div className="buttons">
              <a className="btn primary" href="/highlights">
                <Icon name="grid" /> Beiträge entdecken
              </a>
              <a className="btn glass" href={instagram}>
                <Icon name="instagram" /> Auf Instagram folgen
              </a>
            </div>
          </div>
          {featured && <Feature item={featured} />}
        </div>
      </section>
      <div className="wrap">
        <section className="section">
          <SectionTitle first="Neueste" last="Beiträge" link="Alle Beiträge" />
          <Gallery items={items} compact />
        </section>
        {trending.length > 0 && (
          <section className="section">
            <SectionTitle first="Aus der" last="Redaktion" />
            <div className="trendlist">
              {trending.map((item) => (
                <a key={item.id} href={item.url}>
                  <span className="round">
                    <Icon name="instagram" />
                  </span>
                  <div>
                    <span className="meta">{item.category}</span>
                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
        <Community />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "OKHockey",
            url: "https://okhockey.de",
            logo: "https://okhockey.de/media/brand.png",
            sameAs: [instagram],
          }),
        }}
      />
    </>
  );
}
