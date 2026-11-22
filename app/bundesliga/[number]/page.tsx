import { notFound } from "next/navigation";
import {
  fixtures,
  matchDetails,
  league,
  type Fixture,
} from "../../../lib/bundesliga";
import { LeagueError, LeagueSource } from "../../../components/LeagueViews";
import TickerRefresh from "../../../components/TickerRefresh";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ ansicht?: string }>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { number } = await params;
  const ticker = (await searchParams).ansicht === "ticker";
  return {
    title: (ticker ? "Liveticker" : "Matchblatt") + " · Spiel " + number,
    alternates: {
      canonical: "/bundesliga/" + number + (ticker ? "?ansicht=ticker" : ""),
    },
  };
}
async function Report({ match, ticker }: { match: Fixture; ticker: boolean }) {
  let report;
  try {
    report = await matchDetails(match, ticker);
  } catch {
    return (
      <>
        <LeagueError />
        {ticker && !match.played && <TickerRefresh />}
      </>
    );
  }
  if (!report)
    return (
      <>
        <p>
          {ticker
            ? "Für dieses Spiel liegt noch kein Ticker vor."
            : "Für dieses Spiel liegt noch kein Matchblatt vor."}
        </p>
        {ticker && !match.played && <TickerRefresh />}
      </>
    );
  return (
    <>
      <span className="meta">
        {report.ended ? "Beendet" : report.started ? "Live" : "Angesetzt"}
      </span>
      {report.score && <p className="league-score">{report.score}</p>}
      {report.updated && (
        <p className="small">Datenstand des Verbands: {report.updated}</p>
      )}
      {ticker && !report.ended && <TickerRefresh />}
      <h2>{ticker ? "Tickermeldungen" : "Spielverlauf"}</h2>
      {report.timeline.length ? (
        <ol className="league-events">
          {report.timeline.map((e, i) => (
            <li key={i}>
              <strong>{e.time || "–"}</strong>
              <span>{e.text}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>Bisher sind keine Ereignisse gemeldet.</p>
      )}
      {!ticker && (
        <div className="lineups">
          {[report.home, report.away].map((players, i) => (
            <section key={i}>
              <h3>{i === 0 ? match.home : match.away}</h3>
              <p className="meta">Aufstellung</p>
              {players.length ? (
                <ul>
                  {players.map((p, j) => (
                    <li key={j}>
                      {p.number && "#" + p.number + " · "}
                      {p.name}
                      {p.keeper ? " (Tor)" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Noch nicht gemeldet.</p>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
export default async function Page({ params, searchParams }: Props) {
  const { number } = await params;
  if (!/^\d{1,12}$/.test(number)) notFound();
  let games;
  try {
    games = await fixtures();
  } catch {
    return (
      <div className="wrap page">
        <h1>Spieldetails</h1>
        <LeagueError />
      </div>
    );
  }
  const match = games.find((m) => m.number === number);
  if (!match) notFound();
  const ticker = (await searchParams).ansicht === "ticker";
  const path = "/bundesliga/" + match.number;
  return (
    <div className="wrap page">
      <a
        className="back"
        href={match.played ? "/bundesliga?ansicht=ergebnisse" : "/bundesliga"}
      >
        Zur Bundesliga
      </a>
      <div className="intro">
        <span className="eyebrow">
          <i />
          {league.name} · {league.season}
        </span>
        <h1>
          {match.home} <em>– {match.away}</em>
        </h1>
        <p>
          {match.date} · {match.time} Uhr · {match.venue}
        </p>
      </div>
      <nav className="league-nav" aria-label="Spieldaten">
        <a href={path} aria-current={!ticker ? "page" : undefined}>
          Matchblatt
        </a>
        {(match.ticker || ticker) && (
          <a
            href={path + "?ansicht=ticker"}
            aria-current={ticker ? "page" : undefined}
          >
            Liveticker
          </a>
        )}
      </nav>
      <section className="panel league-panel">
        <Report match={match} ticker={ticker} />
        <LeagueSource />
      </section>
    </div>
  );
}
