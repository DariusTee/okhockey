import { Intro, Community } from "../../components/Editorial";
export const metadata = {
  title: "Über OKHockey",
  alternates: { canonical: "/about" },
};
export default function Page() {
  return (
    <div className="wrap page">
      <Intro kicker="Über OKHockey" first="More than" last="a game." />
      <div className="aboutsplit">
        <div className="prose">
          <p>
            OKHockey ist eine unabhängige Medienplattform mit einer einfachen
            Mission. Wir geben Rollhockey die Aufmerksamkeit, die dieser Sport
            verdient.
          </p>
          <p>
            Wir zeigen die Tore, die man immer wieder sehen möchte. Die Paraden,
            die eigentlich unmöglich sind. Die Spieler, die den Unterschied
            machen. Und die Momente, über die die ganze Halle spricht.
          </p>
          <p>
            Von der Bundesliga bis zu den kleinen Hallen. Von spektakulären
            Highlights bis zu den lustigsten Szenen.
          </p>
          <h2>
            Rollhockey hat Geschichten, die erzählt werden müssen.{" "}
            <em>Wir erzählen sie.</em>
          </h2>
          <p>
            Die Redaktion arbeitet vereinsübergreifend und unabhängig von
            Verbänden und Ligen.
          </p>
        </div>
      </div>
      <Community />
    </div>
  );
}
