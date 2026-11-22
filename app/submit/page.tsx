import { Intro } from "../../components/Editorial";
import { Submit } from "../../components/Submit";
export const metadata = {
  title: "Clip einreichen",
  alternates: { canonical: "/submit" },
};
export default function Page() {
  return (
    <div className="wrap page narrow">
      <Intro kicker="Clip einreichen" first="Your moment." last="Our stage.">
        Dein Tor, deine Parade, dein Blick von der Tribüne. Schick uns den
        Instagram-Beitragslink und erzähl uns, was die Szene besonders macht.
      </Intro>
      <Submit />
    </div>
  );
}
