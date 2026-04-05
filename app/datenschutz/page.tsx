import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={backLinkStyle}>
          ← Zurück zur Startseite
        </Link>

        <h1 style={titleStyle}>Datenschutzerklärung</h1>

        <Section
          title="1. Verantwortlicher"
          text={`Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website und im Zusammenhang mit dem Angebot von Cardletics ist:

Cardletics
Oppenheimer Straße 26
55130 Mainz
Deutschland

E-Mail: Info@cardletics.com`}
        />

        <Section
          title="2. Allgemeine Hinweise"
          text="Wir verarbeiten personenbezogene Daten der Nutzer nur, soweit dies zur Bereitstellung einer funktionsfähigen Website, der mobilen App, unserer Inhalte und Leistungen sowie zur Bearbeitung von Anfragen erforderlich ist."
        />

        <Section
          title="3. Hosting"
          text="Diese Website wird über Vercel bereitgestellt. Dabei können technische Verbindungsdaten verarbeitet werden, die für die Auslieferung und Sicherheit der Website erforderlich sind."
        />

        <Section
          title="4. Backend und Datenverarbeitung"
          text="Für Datenbank- und Backend-Funktionen nutzen wir Supabase. Im Rahmen der Nutzung der App und ihrer Funktionen können personenbezogene Daten, Nutzungsdaten, Login-Daten sowie appbezogene Inhalte verarbeitet werden."
        />

        <Section
          title="5. Registrierung und Login"
          text="Für die Nutzung bestimmter Funktionen der App kann eine Registrierung per E-Mail erforderlich sein. Dabei verarbeiten wir insbesondere E-Mail-Adresse, Login-Daten sowie Informationen, die im Rahmen der Kontonutzung bereitgestellt werden."
        />

        <Section
          title="6. Kontaktaufnahme"
          text="Wenn du uns kontaktierst, zum Beispiel per E-Mail oder über ein Kontaktformular, verarbeiten wir deine Angaben zur Bearbeitung deiner Anfrage und für mögliche Anschlussfragen."
        />

        <Section
          title="7. In-App-Käufe und Abonnements"
          text="In-App-Käufe und Abonnements werden über Apple App Store und Google Play abgewickelt. Im Zusammenhang mit diesen Käufen erhalten wir gegebenenfalls transaktionsbezogene Informationen, soweit dies für die Bereitstellung, Zuordnung, Abrechnung oder Verwaltung der Leistungen erforderlich ist."
        />

        <Section
          title="8. Virtuelle Inhalte, Coins und interne Börse"
          text="Im Rahmen der App können virtuelle Inhalte wie Karten, Coins, Sammlungen, Teams, Awards und Transaktionen innerhalb einer internen Börse verarbeitet und gespeichert werden, soweit dies für die Spiel- und Plattformfunktionen erforderlich ist."
        />

        <Section
          title="9. Zwecke der Verarbeitung"
          text={`Die Verarbeitung erfolgt insbesondere zu folgenden Zwecken:

- Bereitstellung der Website und App
- Nutzerverwaltung
- Login und Authentifizierung
- Abwicklung von In-App-Käufen und Abonnements
- Bereitstellung spielbezogener Funktionen
- Kommunikation mit Nutzern
- technische Sicherheit und Stabilität`}
        />

        <Section
          title="10. Rechtsgrundlagen"
          text="Die Verarbeitung personenbezogener Daten erfolgt insbesondere auf Grundlage der Vertragserfüllung, vorvertraglicher Maßnahmen, berechtigter Interessen sowie – soweit erforderlich – auf Grundlage einer Einwilligung."
        />

        <Section
          title="11. Speicherdauer"
          text="Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen."
        />

        <Section
          title="12. Betroffenenrechte"
          text={`Du hast im Rahmen der gesetzlichen Vorgaben insbesondere folgende Rechte:

- Auskunft
- Berichtigung
- Löschung
- Einschränkung der Verarbeitung
- Datenübertragbarkeit
- Widerspruch gegen bestimmte Verarbeitungen
- Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft`}
        />

        <Section
          title="13. Beschwerderecht"
          text="Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung deiner personenbezogenen Daten zu beschweren."
        />

        <Section
          title="14. Hinweis"
          text="Diese Datenschutzerklärung ist eine vorbereitete Fassung auf Basis der derzeit bekannten Angaben. Vor Live-Schaltung sollte sie rechtlich geprüft und bei Änderungen der eingesetzten Dienste oder Prozesse aktualisiert werden."
        />
      </div>
    </main>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>{title}</h2>
      <p style={textStyle}>{text}</p>
    </section>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b0f0d",
  padding: "24px",
  color: "#e7f1eb",
  fontFamily: "Arial, sans-serif",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "20px",
  padding: "28px",
};

const backLinkStyle: React.CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "20px",
  fontSize: "38px",
  color: "#ffffff",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "22px",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "22px",
  color: "#ffffff",
};

const textStyle: React.CSSProperties = {
  margin: 0,
  color: "#b7c6be",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
};