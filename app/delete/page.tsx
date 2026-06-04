import type { CSSProperties } from "react";
import Link from "next/link";

export default function DeleteAccountPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <span style={eyebrowStyle}>Kontolöschung</span>
          <h1 style={titleStyle}>Cardletics-Konto löschen</h1>
          <p style={subtitleStyle}>
            Hier erfährst du, wie du die Löschung deines Cardletics-Kontos und
            deiner zugehörigen Nutzerdaten beantragen kannst.
          </p>

          <div style={heroActionsStyle}>
            <Link href="/" style={backButtonStyle}>
              Zurück zur Startseite
            </Link>
            <a
              href="mailto:info@cardletics.com?subject=Kontol%C3%B6schung%20Cardletics"
              style={mailButtonStyle}
            >
              Löschung per E-Mail beantragen
            </a>
          </div>
        </div>

        <Section title="1. So beantragst du die Löschung">
          <p>
            Wenn du dein Cardletics-Konto löschen möchtest, sende bitte eine
            E-Mail an <strong>info@cardletics.com</strong>.
          </p>
          <p>
            Verwende nach Möglichkeit die E-Mail-Adresse, mit der du bei
            Cardletics registriert bist. So können wir dein Konto eindeutig
            zuordnen.
          </p>
          <p style={infoBoxStyle}>
            Betreff-Vorschlag: <strong>Kontolöschung Cardletics</strong>
          </p>
        </Section>

        <Section title="2. Welche Daten gelöscht werden">
          <p>Nach bestätigter Zuordnung löschen wir insbesondere:</p>
          <ul style={listStyle}>
            <li>dein Nutzerkonto und deine Login-Zuordnung,</li>
            <li>dein Profil, deinen Nutzernamen und Profilinformationen,</li>
            <li>deine Karten-, Inventar-, Fortschritts- und Spieldaten,</li>
            <li>Freundes-, Gruppen-, Chat- und Social-Daten, soweit sie deinem Konto zugeordnet sind,</li>
            <li>Standort-/Umgebungsdaten, soweit sie deinem Konto zugeordnet sind,</li>
            <li>Health-, Fitness- und Bewegungsdaten, soweit sie in Cardletics gespeichert wurden.</li>
          </ul>
        </Section>

        <Section title="3. Welche Daten ggf. länger gespeichert werden">
          <p>
            Bestimmte Daten können aus rechtlichen Gründen länger gespeichert
            werden, zum Beispiel wenn gesetzliche Aufbewahrungspflichten
            bestehen oder die Daten zur Abrechnung, Betrugsprävention,
            Sicherheit oder Rechtsdurchsetzung erforderlich sind.
          </p>
          <p>
            Dazu können insbesondere Kauf-, Zahlungs-, Steuer- oder
            Transaktionsnachweise gehören. Diese Daten werden nur im
            erforderlichen Umfang und nur für die gesetzlich zulässigen Zwecke
            aufbewahrt.
          </p>
        </Section>

        <Section title="4. Bearbeitungsdauer">
          <p>
            Wir bearbeiten Löschanfragen so schnell wie möglich. In der Regel
            erfolgt die Bearbeitung innerhalb von 30 Tagen nach erfolgreicher
            Zuordnung des Kontos.
          </p>
        </Section>

        <Section title="5. Kontakt">
          <p>
            E-Mail:{" "}
            <a href="mailto:info@cardletics.com" style={linkStyle}>
              info@cardletics.com
            </a>
          </p>
          <p>
            Weitere Informationen findest du in unserer{" "}
            <Link href="/datenschutz" style={linkStyle}>
              Datenschutzerklärung
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div style={sectionContentStyle}>{children}</div>
    </section>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #07150f 0%, #0d1d16 100%)",
  padding: "32px 16px 64px",
  color: "#eaf6ee",
};

const containerStyle: CSSProperties = {
  maxWidth: "980px",
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "24px",
  padding: "28px 24px",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
  marginBottom: "24px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.12)",
  color: "#bbf7d0",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.03em",
  marginBottom: "12px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "38px",
  lineHeight: 1.08,
  color: "#ffffff",
};

const subtitleStyle: CSSProperties = {
  marginTop: "12px",
  marginBottom: 0,
  color: "#d7f5df",
  fontSize: "16px",
  lineHeight: 1.6,
};

const heroActionsStyle: CSSProperties = {
  marginTop: "18px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
};

const mailButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "#171f1c",
  color: "#e7f1eb",
  border: "1px solid #2d3b35",
  fontWeight: 700,
  textDecoration: "none",
};

const sectionStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "18px",
  padding: "22px 20px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginBottom: "18px",
};

const sectionTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "14px",
  fontSize: "22px",
  color: "#e7f1eb",
};

const sectionContentStyle: CSSProperties = {
  color: "#d9e7de",
  lineHeight: 1.75,
  fontSize: "15px",
};

const listStyle: CSSProperties = {
  paddingLeft: "20px",
  marginTop: "10px",
  marginBottom: 0,
};

const infoBoxStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "14px",
};

const linkStyle: CSSProperties = {
  color: "#86efac",
  textDecoration: "underline",
};