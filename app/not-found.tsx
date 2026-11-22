import { Intro } from "../components/Editorial";
export default function NotFound() {
  return (
    <div className="wrap page">
      <Intro kicker="404" first="Seite nicht" last="gefunden." />
      <a className="btn primary" href="/highlights">
        Zu den Highlights
      </a>
    </div>
  );
}
