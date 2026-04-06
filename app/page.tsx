import Image from "next/image";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <section style={heroSectionStyle}>
        <div style={heroGlowOneStyle} />
        <div style={heroGlowTwoStyle} />

        <div style={heroInnerStyle}>
          <div style={logoWrapperStyle}>
            <div style={logoCardStyle}>
              <div style={logoInnerStyle}>
                <Image
                  src="/bg_app.png"
                  alt="Cardletics Logo"
                  width={160}
                  height={160}
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

          <div style={heroBadgeStyle}>Track • Collect • Battle • Trade</div>

          <h1 style={titleStyle}>
            Verfolge Sport.
            <br />
            Verdiene Karten.
            <br />
            Werde zur Collection-Legende.
          </h1>

          <p style={subtitleStyle}>
            Cardletics verbindet echte Aktivität mit digitalem Sammelkarten-Gameplay.
            Laufe, trainiere und bewege dich im Alltag, um Karten zu erhalten,
            Kollektionen zu vervollständigen, Teams aufzubauen, Battles zu spielen
            und über die interne Börse zu handeln.
          </p>

          <div style={buttonRowStyle}>
            <div style={buttonStyle}>App Store – bald verfügbar</div>
            <div style={buttonSecondaryStyle}>Google Play – bald verfügbar</div>
            <a href="mailto:Info@cardletics.com" style={affiliateButtonStyle}>
              Affiliate Programm
            </a>
          </div>

          <p style={heroHintStyle}>
            Für Partner, Creator, Communities und zukünftige Affiliate-Nutzer.
            Später können Affiliates ihre Performance und Einnahmen direkt im
            System einsehen.
          </p>
        </div>
      </section>

      <section style={statsStripSectionStyle}>
        <div style={statsStripStyle}>
          <StatBox label="Sportdaten" value="Realtime Motivation" />
          <StatBox label="Karten" value="Selten, sammelbar, handelbar" />
          <StatBox label="Battles" value="Teams & Strategie" />
          <StatBox label="Marketplace" value="Interne Börse" />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionEyebrowStyle}>Gameplay</div>
          <h2 style={sectionTitleStyle}>So fühlt sich Cardletics an</h2>
          <p style={sectionTextStyle}>
            Die App kombiniert Fitness, Sammeln, Taktik und Progression in einer
            modernen Mobile Experience.
          </p>
        </div>

        <div style={featureGridStyle}>
          <FeatureCard
            title="Sport wird belohnt"
            text="Deine Aktivität wird zu echtem Spielfortschritt."
          />
          <FeatureCard
            title="Karten mit Seltenheit"
            text="Erhalte Karten, stelle sie aus und baue deine Sammlung aus."
          />
          <FeatureCard
            title="Teams & Kämpfe"
            text="Nutze Karten strategisch und optimiere deine Aufstellung."
          />
          <FeatureCard
            title="Interne Börse"
            text="Handle Karten innerhalb des Systems und erweitere deine Collection."
          />
          <FeatureCard
            title="Coins & Abos"
            text="Kostenlose Nutzung mit optionalen Premium-Elementen."
          />
          <FeatureCard
            title="Awards & Prestige"
            text="Belohne Beständigkeit, Fortschritt und besondere Leistungen."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionEyebrowStyle}>App Preview</div>
          <h2 style={sectionTitleStyle}>Später mit echten Screenshots</h2>
          <p style={sectionTextStyle}>
            Diese Bereiche sind bereits für deine App-Screens vorbereitet.
          </p>
        </div>

        <div style={screensGridStyle}>
          <ScreenshotPlaceholder
            title="Homescreen"
            text="Dashboard, Navigation und Startbereich der App"
          />
          <ScreenshotPlaceholder
            title="Karte im Detail"
            text="Eine einzelne Karte mit Werten, Seltenheit und Design"
          />
          <ScreenshotPlaceholder
            title="3 Karten aufgefächert"
            text="Collection-/Showcase-Look mit nebeneinander dargestellten Karten"
          />
          <ScreenshotPlaceholder
            title="Sport / Lauffortschritt"
            text="Aktivität, Fortschritt, Ziele und Motivation"
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={showcasePanelStyle}>
          <div style={showcaseTextStyle}>
            <div style={sectionEyebrowStyle}>Warum Cardletics?</div>
            <h2 style={sectionTitleStyle}>Mehr als nur Tracking</h2>
            <p style={sectionTextStyle}>
              Cardletics macht Bewegung emotionaler, sichtbarer und spielerischer.
              Nutzer bekommen nicht nur Zahlen, sondern Fortschritt, Besitzgefühl,
              Sammlung, Status und strategische Möglichkeiten.
            </p>
          </div>

          <div style={showcaseCardsStyle}>
            <MiniGameCard emoji="⚡" title="Rare Drop" text="Aktivität zahlt sich aus" />
            <MiniGameCard emoji="🏆" title="Awards" text="Erfolge sichtbar machen" />
            <MiniGameCard emoji="🛡️" title="Battle Team" text="Strategie statt nur Statistik" />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={affiliatePanelStyle}>
          <div style={affiliateTextColStyle}>
            <div style={sectionEyebrowStyle}>Affiliate & Partnerschaften</div>
            <h2 style={sectionTitleStyle}>Affiliate-Programm für Wachstum</h2>
            <p style={sectionTextStyle}>
              Cardletics wird auch ein Affiliate-Programm unterstützen. Creator,
              Communities und Partner sollen perspektivisch Nutzer empfehlen und
              ihre Ergebnisse transparent nachverfolgen können.
            </p>
            <p style={affiliateSmallTextStyle}>
              Später kann hier zusätzlich ein direkter Link zum Affiliate-Bereich
              in der App oder im Web ergänzt werden.
            </p>
          </div>

          <div style={affiliateActionsStyle}>
            <a href="mailto:Info@cardletics.com" style={buttonStyle}>
              Affiliate anfragen
            </a>
            <a href="#" style={buttonSecondaryStyle}>
              Bereich bald verfügbar
            </a>
          </div>
        </div>
      </section>

      <footer style={footerStyle}>
        <div style={footerBrandStyle}>
          <div style={footerBrandTitleStyle}>Cardletics</div>
          <div style={footerBrandTextStyle}>www.cardletics.com</div>
        </div>

        <div style={footerLinksStyle}>
          <a href="/impressum" style={footerLinkStyle}>
            Impressum
          </a>
          <a href="/datenschutz" style={footerLinkStyle}>
            Datenschutz
          </a>
          <a href="/agb" style={footerLinkStyle}>
            AGB
          </a>
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

function ScreenshotPlaceholder({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={screenshotCardStyle}>
      <div style={screenshotMockStyle}>
        <div style={screenshotMockTopStyle} />
        <div style={screenshotMockBodyStyle}>
          <div style={screenshotMockLineStrongStyle} />
          <div style={screenshotMockLineStyle} />
          <div style={screenshotMockLineStyle} />
          <div style={screenshotMockGridStyle}>
            <div style={screenshotMockMiniCardStyle} />
            <div style={screenshotMockMiniCardStyle} />
            <div style={screenshotMockMiniCardStyle} />
          </div>
        </div>
      </div>

      <div style={screenshotTextWrapStyle}>
        <h3 style={screenshotTitleStyle}>{title}</h3>
        <p style={screenshotTextStyle}>{text}</p>
      </div>
    </div>
  );
}

function MiniGameCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div style={miniGameCardStyle}>
      <div style={miniGameEmojiStyle}>{emoji}</div>
      <div style={miniGameTitleStyle}>{title}</div>
      <div style={miniGameTextStyle}>{text}</div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={statBoxStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #0b0f0d 0%, #0d120f 100%)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const heroSectionStyle: React.CSSProperties = {
  position: "relative",
  maxWidth: "1200px",
  margin: "0 auto",
  borderRadius: "32px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.55) 0%, rgba(15,23,42,0.92) 100%)",
  border: "1px solid #2b3b33",
  boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
};

const heroGlowOneStyle: React.CSSProperties = {
  position: "absolute",
  top: "-60px",
  left: "-30px",
  width: "220px",
  height: "220px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.18)",
  filter: "blur(50px)",
};

const heroGlowTwoStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "-80px",
  right: "-40px",
  width: "260px",
  height: "260px",
  borderRadius: "999px",
  background: "rgba(59,130,246,0.12)",
  filter: "blur(60px)",
};

const heroInnerStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: "860px",
  margin: "0 auto",
  textAlign: "center",
  padding: "56px 24px",
};

const logoWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "22px",
};

const logoCardStyle: React.CSSProperties = {
  width: "152px",
  height: "152px",
  borderRadius: "34px",
  background: "linear-gradient(135deg, #22c55e, #0f172a)",
  padding: "6px",
  boxShadow: "0 20px 60px rgba(34,197,94,0.35)",
};

const logoInnerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "28px",
  overflow: "hidden",
  background: "#08110c",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#c7f9d8",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(40px, 7vw, 72px)",
  lineHeight: 1.02,
  margin: "0 0 18px 0",
  color: "#ffffff",
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  maxWidth: "760px",
  margin: "0 auto 28px auto",
  fontSize: "18px",
  color: "#c3d1ca",
  lineHeight: 1.7,
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "#22c55e",
  borderRadius: "14px",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const buttonSecondaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "#1a2320",
  borderRadius: "14px",
  color: "#e7f1eb",
  border: "1px solid #2d3b35",
  fontWeight: 700,
  textDecoration: "none",
};

const affiliateButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "linear-gradient(135deg, #14532d, #22c55e)",
  borderRadius: "14px",
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.08)",
};

const heroHintStyle: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "14px",
  color: "#9db0a7",
  lineHeight: 1.6,
};

const statsStripSectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "18px auto 0 auto",
};

const statsStripStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const statBoxStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "16px",
};

const statLabelStyle: React.CSSProperties = {
  color: "#86efac",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "6px",
};

const statValueStyle: React.CSSProperties = {
  color: "#e7f1eb",
  fontSize: "16px",
  lineHeight: 1.5,
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "28px auto 0 auto",
};

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const sectionEyebrowStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "10px",
  color: "#86efac",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "clamp(28px, 4vw, 42px)",
  color: "#ffffff",
};

const sectionTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  color: "#94a39b",
  lineHeight: 1.7,
};

const featureGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const featureCardStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #171f1c 0%, #121816 100%)",
  border: "1px solid #27312d",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
};

const featureTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "20px",
  color: "#ffffff",
};

const featureTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.65,
  fontSize: "15px",
};

const screensGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
};

const screenshotCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "16px",
};

const screenshotMockStyle: React.CSSProperties = {
  borderRadius: "24px",
  background: "#0f1512",
  border: "1px solid #27312d",
  padding: "12px",
  minHeight: "320px",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
};

const screenshotMockTopStyle: React.CSSProperties = {
  width: "72px",
  height: "8px",
  borderRadius: "999px",
  background: "#27312d",
  margin: "0 auto 14px auto",
};

const screenshotMockBodyStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};

const screenshotMockLineStrongStyle: React.CSSProperties = {
  height: "26px",
  borderRadius: "10px",
  background: "#1e2a25",
};

const screenshotMockLineStyle: React.CSSProperties = {
  height: "16px",
  borderRadius: "8px",
  background: "#1a2320",
};

const screenshotMockGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "8px",
  marginTop: "10px",
};

const screenshotMockMiniCardStyle: React.CSSProperties = {
  height: "120px",
  borderRadius: "14px",
  background: "linear-gradient(180deg, #173524 0%, #101714 100%)",
  border: "1px solid #284233",
};

const screenshotTextWrapStyle: React.CSSProperties = {
  marginTop: "14px",
};

const screenshotTitleStyle: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "18px",
  color: "#ffffff",
};

const screenshotTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const showcasePanelStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.2) 0%, rgba(15,23,42,0.28) 100%)",
  border: "1px solid #27312d",
  borderRadius: "24px",
  padding: "22px",
};

const showcaseTextStyle: React.CSSProperties = {
  alignSelf: "center",
};

const showcaseCardsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
};

const miniGameCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "16px",
  textAlign: "center",
};

const miniGameEmojiStyle: React.CSSProperties = {
  fontSize: "26px",
  marginBottom: "8px",
};

const miniGameTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "6px",
};

const miniGameTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a39b",
  lineHeight: 1.5,
};

const affiliatePanelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "24px",
  padding: "24px",
};

const affiliateTextColStyle: React.CSSProperties = {
  maxWidth: "760px",
};

const affiliateSmallTextStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "#9fb1a9",
  fontSize: "14px",
  lineHeight: 1.6,
};

const affiliateActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const footerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "36px auto 0 auto",
  paddingTop: "20px",
  borderTop: "1px solid #27312d",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "16px",
};

const footerBrandStyle: React.CSSProperties = {
  display: "grid",
  gap: "4px",
};

const footerBrandTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#ffffff",
};

const footerBrandTextStyle: React.CSSProperties = {
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