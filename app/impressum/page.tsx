import { Intro } from "../../components/Editorial";
export const metadata = { title: "Impressum", robots: { index: false } };
export default function Page() {
  return (
    <div className="wrap page narrow">
      <Intro kicker="Anbieterkennzeichnung" first="Impressum" last="" />
      <div className="prose">
        <h2>Anbieter gemäß § 5 DDG</h2>
        <address className="imprint-address">
          Darius Teelen
          <br />
          Von-der-Heydtstraße 40
          <br />
          45661 Recklinghausen
        </address>
        <h2>Kontakt</h2>
        <p>
          <a href="mailto:okhockey.de@gmail.com">okhockey.de@gmail.com</a>
        </p>
        <h2>Redaktionell verantwortlich gemäß § 18 Abs. 2 MStV</h2>
        <p>Darius Teelen, Anschrift wie oben.</p>
      </div>
    </div>
  );
}
