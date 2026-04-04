import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={backLinkStyle}>
          ← Zurück zur Startseite
        </Link>

        <h1 style={titleStyle}>Impressum</h1>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Angaben gemäß § 5 DDG</h2>
          <p style={textStyle}>
            Cardletics
            <br />
            Oppenheimer Straße 26
            <br />
            55130 Mainz
            <br />
            Deutschland
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Kontakt</h2>
          <p style={textStyle}>E-Mail: Info@cardletics.com</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Unternehmensform</h2>
          <p style={textStyle}>Einzelunternehmen</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Verantwortlich für den Inhalt</h2>
          <p style={textStyle}>
            Cardletics
            <br />
            Oppenheimer Straße 26
            <br />
            55130 Mainz
          </p>
        </section>
      </div>
    </main>
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