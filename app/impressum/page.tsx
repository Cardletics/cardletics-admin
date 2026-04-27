import type { CSSProperties } from "react";
import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <span style={eyebrowStyle}>Impressum</span>
          <h1 style={titleStyle}>Impressum</h1>
          <p style={subtitleStyle}>Angaben gemäß § 5 DDG für Website und App Cardletics.</p>
          <div style={heroActionsStyle}>
            <Link href="/" style={backButtonStyle}>
              Zurück zur Startseite
            </Link>
          </div>
        </div>

        <Section title="1. Anbieter">
          <p style={addressStyle}>
            <strong>Sascha Leineweber – Cardletics</strong>
            <br />
            Freiberufler
            <br />
            Oppenheimer Str. 26
            <br />
            55130 Mainz
            <br />
            Deutschland
          </p>
        </Section>

        <Section title="2. Kontakt">
          <p>
            E-Mail: <a href="mailto:info@cardletics.com" style={linkStyle}>info@cardletics.com</a>
          </p>
          <p>
            Website: <a href="https://www.cardletics.com" style={linkStyle}>www.cardletics.com</a>
          </p>
        </Section>

        <Section title="3. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p style={addressStyle}>
            <strong>Sascha Leineweber</strong>
            <br />
            Oppenheimer Str. 26
            <br />
            55130 Mainz
            <br />
            Deutschland
          </p>
        </Section>

        <Section title="4. Hinweis zu Inhalten und Diensten">
          <p>
            Cardletics ist ein digitales Angebot mit Website und App. Inhalte,
            Funktionen, Spielmechaniken, virtuelle Gegenstände, In-App-Käufe,
            Abonnements und interne Marktplatzfunktionen können Teil des
            Angebots sein.
          </p>
        </Section>

        <Section title="5. Haftung für Inhalte">
          <p>
            Wir sind für die eigenen Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Wir übernehmen jedoch keine
            Gewähr für die jederzeitige Aktualität, Vollständigkeit und
            Richtigkeit sämtlicher Inhalte.
          </p>
        </Section>

        <Section title="6. Haftung für Links">
          <p>
            Unser Angebot kann Links zu externen Websites Dritter enthalten, auf
            deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte
            übernehmen wir keine Gewähr. Für die Inhalte verlinkter Seiten ist
            stets der jeweilige Anbieter oder Betreiber verantwortlich.
          </p>
        </Section>

        <Section title="7. Urheberrecht">
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Jede
            Verwertung außerhalb der Grenzen des Urheberrechts bedarf der
            vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.
          </p>
        </Section>

        <Section title="8. Online-Streitbeilegung / Verbraucherhinweis">
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung bereit. Wir sind jedoch weder verpflichtet
            noch bereit, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen, soweit keine gesetzliche
            Verpflichtung besteht.
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

const addressStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "14px",
};

const linkStyle: CSSProperties = {
  color: "#86efac",
  textDecoration: "underline",
};
