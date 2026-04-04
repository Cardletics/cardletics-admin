import Link from "next/link";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div style={brandStyle}>
          <div style={logoCircleStyle}>C</div>
          <div>
            <div style={brandTitleStyle}>Cardletics</div>
            <div style={brandSubtitleStyle}>Sport. Cards. Collection. Battle.</div>
          </div>
        </div>

        <nav style={navStyle}>
          <Link href="/impressum" style={navLinkStyle}>
            Impressum
          </Link>
          <Link href="/datenschutz" style={navLinkStyle}>
            Datenschutz
          </Link>
          <Link href="/agb" style={navLinkStyle}>
            AGB
          </Link>
          <Link href="/admin" style={adminButtonStyle}>
            Admin
          </Link>
        </nav>
      </header>

      <section style={heroSectionStyle}>
        <div style={heroTextColStyle}>
          <div style={heroBadgeStyle}>Cardletics • Coming Soon</div>
          <h1 style={heroTitleStyle}>
            Verfolge deine Aktivität.
            <br />
            Sammle Karten.
            <br />
            Baue dein Team.
          </h1>
          <p style={heroTextStyle}>
            Cardletics verbindet Sportdaten mit Sammelkarten-Gameplay. Trainiere,
            werde belohnt, vervollständige Kollektionen, stelle Karten aus, sammle
            Awards und tritt mit deinem Team gegen andere an.
          </p>

          <div style={ctaRowStyle}>
            <a href="#" style={primaryCtaStyle}>
              App Store bald verfügbar
            </a>
            <a href="#" style={secondaryCtaStyle}>
              Google Play bald verfügbar
            </a>
          </div>

          <p style={smallHintStyle}>
            Download-Links folgen bald. Kooperationen, Sponsoren und Partneranfragen
            sind zukünftig ebenfalls möglich.
          </p>
        </div>

        <div style={heroCardStyle}>
          <div style={phoneMockStyle}>
            <div style={phoneTopBarStyle} />
            <div style={phoneContentStyle}>
              <div style={mockStatStyle}>
                <span style={mockLabelStyle}>Heute aktiv</span>
                <strong style={mockValueStyle}>8.420 Schritte</strong>
              </div>
              <div style={mockCardItemStyle}>
                <div style={mockCardIconStyle}>⚡</div>
                <div>
                  <div style={mockCardTitleStyle}>Neue Karte</div>
                  <div style={mockCardTextStyle}>Speed Runner • Rare</div>
                </div>
              </div>
              <div style={mockCardItemStyle}>
                <div style={mockCardIconStyle}>🏆</div>
                <div>
                  <div style={mockCardTitleStyle}>Award freigeschaltet</div>
                  <div style={mockCardTextStyle}>7 Tage Aktivitätsserie</div>
                </div>
              </div>
              <div style={mockCardItemStyle}>
                <div style={mockCardIconStyle}>🛡️</div>
                <div>
                  <div style={mockCardTitleStyle}>Team bereit</div>
                  <div style={mockCardTextStyle}>Battle Squad Power 87</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingWrapStyle}>
          <h2 style={sectionTitleStyle}>Was ist Cardletics?</h2>
          <p style={sectionTextStyle}>
            Eine mobile Experience rund um Bewegung, Motivation, Sammeln und
            Strategie.
          </p>
        </div>

        <div style={featureGridStyle}>
          <FeatureCard
            title="Sportdaten tracken"
            text="Deine Aktivität wird zur Grundlage deines Fortschritts in der App."
          />
          <FeatureCard
            title="Karten freischalten"
            text="Für Aktivität und Erfolge erhältst du digitale Karten mit Sammlerwert."
          />
          <FeatureCard
            title="Teams bauen & kämpfen"
            text="Kombiniere Karten strategisch und tritt mit deinem Team in Battles an."
          />
          <FeatureCard
            title="Sammeln & ausstellen"
            text="Vervollständige Sets, präsentiere seltene Karten und sammle Awards."
          />
          <FeatureCard
            title="Interne Börse"
            text="Karten können innerhalb der App gehandelt werden."
          />
          <FeatureCard
            title="Coins & Abos"
            text="Die App ist kostenlos nutzbar, bietet aber auch optionale Abos und In-App-Käufe."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingWrapStyle}>
          <h2 style={sectionTitleStyle}>Für wen ist die App?</h2>
          <p style={sectionTextStyle}>
            Für Sportfans, Sammler und alle, die Motivation spielerisch erleben wollen.
          </p>
        </div>

        <div style={audienceGridStyle}>
          <AudienceCard
            title="Sportliche Nutzer"
            text="Bewegung wird direkt in Spielfortschritt und Belohnungen übersetzt."
          />
          <AudienceCard
            title="Sammler"
            text="Seltene Karten, Kollektionen, Präsentation und Fortschritt stehen im Mittelpunkt."
          />
          <AudienceCard
            title="Strategische Spieler"
            text="Baue Teams, optimiere Kombinationen und messe dich im Kampf."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={partnerCardStyle}>
          <div>
            <div style={heroBadgeStyle}>Partnerschaften</div>
            <h2 style={sectionTitleStyle}>Kooperationspartner, Sponsoren und Werbepartner</h2>
            <p style={sectionTextStyle}>
              Cardletics ist perspektivisch offen für Kooperationen mit Marken,
              Vereinen, Fitness- und Lifestyle-Partnern.
            </p>
          </div>

          <div style={partnerActionsStyle}>
            <a href="mailto:Info@cardletics.com" style={primaryCtaStyle}>
              Partneranfrage senden
            </a>
          </div>
        </div>
      </section>

      <footer style={footerStyle}>
        <div style={footerBrandStyle}>
          <strong>Cardletics</strong>
          <span style={footerTextStyle}>www.cardletics.com</span>
        </div>

        <div style={footerLinksStyle}>
          <Link href="/impressum" style={footerLinkStyle}>
            Impressum
          </Link>
          <Link href="/datenschutz" style={footerLinkStyle}>
            Datenschutz
          </Link>
          <Link href="/agb" style={footerLinkStyle}>
            AGB
          </Link>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={featureCardStyle}>
      <h3 style={featureTitleStyle}>{title}</h3>
      <p style={featureTextStyle}>{text}</p>
    </div>
  );
}

function AudienceCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={audienceCardStyle}>
      <h3 style={featureTitleStyle}>{title}</h3>
      <p style={featureTextStyle}>{text}</p>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 30%), #0b0f0d",
  color: "#e7f1eb",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto 24px auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const logoCircleStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "#22c55e",
  color: "#08130c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "20px",
};

const brandTitleStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 800,
  color: "#ffffff",
};

const brandSubtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a39b",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const navLinkStyle: React.CSSProperties = {
  color: "#cfe0d6",
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #27312d",
  background: "#121816",
};

const adminButtonStyle: React.CSSProperties = {
  color: "#08130c",
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "#22c55e",
  fontWeight: 700,
};

const heroSectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  alignItems: "stretch",
};

const heroTextColStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#163322",
  color: "#86efac",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "16px",
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: "44px",
  lineHeight: 1.05,
  margin: "0 0 16px 0",
  color: "#ffffff",
};

const heroTextStyle: React.CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.65,
  color: "#b7c6be",
  margin: "0 0 22px 0",
};

const ctaRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryCtaStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "#08130c",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryCtaStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#121816",
  color: "#e7f1eb",
  textDecoration: "none",
  border: "1px solid #27312d",
  fontWeight: 700,
};

const smallHintStyle: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "14px",
  color: "#94a39b",
  lineHeight: 1.6,
};

const heroCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const phoneMockStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  borderRadius: "28px",
  background: "#0f1512",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "16px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
};

const phoneTopBarStyle: React.CSSProperties = {
  width: "88px",
  height: "8px",
  borderRadius: "999px",
  background: "#27312d",
  margin: "0 auto 18px auto",
};

const phoneContentStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
};

const mockStatStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "14px",
};

const mockLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "6px",
};

const mockValueStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "22px",
};

const mockCardItemStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "14px",
};

const mockCardIconStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "#22c55e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
};

const mockCardTitleStyle: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 700,
  marginBottom: "4px",
};

const mockCardTextStyle: React.CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "24px auto 0 auto",
};

const sectionHeadingWrapStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "32px",
  color: "#ffffff",
};

const sectionTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.65,
  color: "#94a39b",
};

const featureGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const featureCardStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "18px",
};

const featureTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  color: "#ffffff",
  fontSize: "20px",
};

const featureTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "15px",
};

const audienceGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
};

const audienceCardStyle: React.CSSProperties = {
  background: "#121816",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "18px",
};

const partnerCardStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "22px",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
  alignItems: "center",
};

const partnerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const footerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "32px auto 0 auto",
  padding: "20px 0 10px 0",
  borderTop: "1px solid #27312d",
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const footerBrandStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
  color: "#e7f1eb",
};

const footerTextStyle: React.CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const footerLinksStyle: React.CSSProperties = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#cfe0d6",
  textDecoration: "none",
};