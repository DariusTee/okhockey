import { Intro } from "../../components/Editorial";
export const metadata = { title: "Datenschutz", robots: { index: false } };
export default function Page() {
  return (
    <div className="wrap page narrow">
      <Intro kicker="Umgang mit deinen Daten" first="Daten" last="schutz." />
      <div className="prose">
        <p>
          Vorbereitete Fassung für die private Projektvorschau.
          Verantwortlicher, erreichbare Datenschutzadresse,
          Hostingvereinbarungen und gegebenenfalls Drittlandtransfers sind vor
          dem öffentlichen Start zu ergänzen.
        </p>
        <h2>Deine Clip-Einreichung</h2>
        <p>
          Wenn du einen Clip vorschlägst, erhält die Redaktion deinen Namen,
          deine E-Mail-Adresse, den Spieler oder Verein, die Beschreibung und
          den Videolink. Wir speichern den Eingangszeitpunkt und die bestätigte
          Fassung der Kontakt- und Rechteerklärung. Nur die berechtigte
          Redaktion kann Einsendungen lesen oder löschen.
        </p>
        <p>
          Wir nutzen deine Einwilligung als Grundlage für die Prüfung und
          Kontaktaufnahme zu deinem Vorschlag (Art. 6 Abs. 1 Buchst. a DSGVO).
          Du kannst sie für die Zukunft widerrufen. Bei weiterer Bearbeitung im
          System werden Einsendungen, die älter als 90 Tage sind, gelöscht. Die
          Redaktion kann sie vorher entfernen.
        </p>
        <h2>Schutz vor Spam</h2>
        <p>
          Zur Begrenzung von Mehrfacheinreichungen erstellt die Anwendung aus
          der IP-Adresse einen geheimnisgeschützten Stundenwert. Der Zähler gilt
          für eine Stunde. Veraltete Zähler werden beim nächsten
          Bereinigungslauf gelöscht. Grundlage ist das berechtigte Interesse am
          Schutz des Formulars.
        </p>
        <h2>Bundesligadaten</h2>
        <p>
          OKHockey ruft Spielpläne, Ergebnisse, Aufstellungen, Torschützen und
          Tickermeldungen serverseitig bei der Rollhockey-Ligaverwaltung ab.
          Dein Browser lädt diese Angaben von OKHockey. Die Vereinswappen im
          Spielplan, in den Ergebnissen und in der Tabelle lädt dein Browser
          direkt vom Bildserver des RHC Recklinghausen bei Cloudflare. Beim Abruf
          erhält der Bildserver deine IP-Adresse.
        </p>
        <h2>Website und externe Videos</h2>
        <p>
          Die Website und die Datenbank werden über OpenAI Sites mit
          Cloudflare-Infrastruktur bereitgestellt. Logo und Schriften laden von
          dieser Website. OKHockey lädt die Titelbilder der eigenen öffentlichen
          Beiträge bei Instagram und liefert sie an deinen Browser. Wenn du
          den Instagram-Player lädst, den interaktiven Beitrag ansiehst oder das
          Original öffnest, verbindet sich dein Browser mit Instagram. Dabei
          kann Meta deine IP-Adresse und Browserinformationen erhalten. OKHockey
          verwendet keine Analyse- oder Werbetracker. Der Hostingdienst kann für Zugriffsschutz
          und Anmeldung technisch erforderliche Daten verarbeiten.
        </p>
        <h2>Deine Rechte</h2>
        <p>
          Du kannst unter den gesetzlichen Voraussetzungen Auskunft,
          Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit
          verlangen, einer Verarbeitung widersprechen und dich bei einer
          Datenschutzaufsichtsbehörde beschweren.
        </p>
        <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679">
          Datenschutz-Grundverordnung
        </a>
      </div>
    </div>
  );
}
