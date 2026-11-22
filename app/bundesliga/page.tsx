import { Intro, SectionTitle } from "../../components/Editorial";
import { Card } from "../../components/Gallery";
import { catalog } from "../../lib/store";
import { LeagueView, LeagueNav } from "../../components/LeagueViews";
import { league } from "../../lib/bundesliga";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Rollhockey-Bundesliga",
  alternates: { canonical: "/bundesliga" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ansicht?: string }>;
}) {
  const selection = (await searchParams).ansicht;
  const view =
    selection && ["ergebnisse", "tabelle", "torschuetzen"].includes(selection)
      ? selection
      : "spielplan";
  const items = (await catalog()).filter((x) => x.competition === "Bundesliga");
  return (
    <div className="wrap page">
      <Intro kicker={league.name} first="Die" last="Bundesliga.">
        Spielplan, Ergebnisse und Statistiken der Saison {league.season}.
      </Intro>
      <LeagueNav active={view} />
      <section className="panel league-panel">
        <LeagueView view={view} />
      </section>
      <section className="section">
        <SectionTitle first="Liga" last="Highlights" />
        {items.length ? (
          <div className="cards">
            {items.map((x) => (
              <Card key={x.id} item={x} />
            ))}
          </div>
        ) : (
          <p>Die Redaktion stellt die nächsten Bundesliga-Clips zusammen.</p>
        )}
      </section>
    </div>
  );
}
