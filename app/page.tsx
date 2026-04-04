import Image from "next/image";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={heroInnerStyle}>
          {/* LOGO */}
          <div style={logoWrapperStyle}>
            <div style={logoCardStyle}>
              <div style={logoInnerStyle}>
                <Image
                  src="/bg_app.png"
                  alt="Cardletics Logo"
                  width={120}
                  height={120}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* HEADLINE */}
          <h1 style={titleStyle}>
            Tracke deine Aktivität.
            <br />
            Sammle Karten.
            <br />
            Baue dein Team.
          </h1>

          {/* TEXT */}
          <p style={subtitleStyle}>
            Cardletics verbindet Sportdaten mit einem Sammelkarten-System.
            Bewege dich im echten Leben, erhalte Karten, vervollständige
            Kollektionen und kämpfe mit deinem Team.
          </p>

          {/* BUTTONS */}
          <div style={buttonRowStyle}>
            <div style={buttonStyle}>App Store – bald verfügbar</div>
            <div style={buttonSecondaryStyle}>
              Google Play – bald verfügbar
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Features</h2>

        <div style={gridStyle}>
          <FeatureCard
            title="Sport wird belohnt"
            text="Deine Aktivität wird direkt in Fortschritt umgewandelt."
          />
          <FeatureCard
            title="Karten sammeln"
            text="Erhalte seltene Karten durch Bewegung."
          />
          <FeatureCard
            title="Teams bauen"
            text="Stelle dein eigenes Team zusammen und kämpfe."
          />
          <FeatureCard
            title="Marketplace"
            text="Handle Karten auf der internen Börse."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div>Cardletics</div>

        <div style={footerLinksStyle}>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#94a39b" }}>{text}</p>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b0f0d",
  color: "white",
  fontFamily: "Arial",
  padding: "20px",
};

const heroStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
};

const heroInnerStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
};

const logoWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const logoCardStyle: React.CSSProperties = {
  width: "140px",
  height: "140px",
  borderRadius: "32px",
  background: "linear-gradient(135deg, #22c55e, #0f172a)",
  padding: "6px",
  boxShadow: "0 20px 60px rgba(34,197,94,0.35)",
};

const logoInnerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "26px",
  overflow: "hidden",
};

const titleStyle: React.CSSProperties = {
  fontSize: "42px",
  marginBottom: "20px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#94a39b",
  marginBottom: "30px",
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#22c55e",
  borderRadius: "12px",
  color: "#08130c",
  fontWeight: "bold",
};

const buttonSecondaryStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#1f2937",
  borderRadius: "12px",
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "40px auto",
};

const sectionTitleStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "12px",
};

const cardStyle: React.CSSProperties = {
  background: "#171f1c",
  padding: "16px",
  borderRadius: "12px",
};

const footerStyle: React.CSSProperties = {
  marginTop: "60px",
  paddingTop: "20px",
  borderTop: "1px solid #27312d",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const footerLinksStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};