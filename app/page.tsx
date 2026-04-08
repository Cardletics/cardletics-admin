"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main style={pageStyle}>
      {!isMobile && (
        <a
          href="mailto:Info@cardletics.com?subject=Affiliate%20Programm"
          style={affiliateSideButtonStyle}
        >
          Affiliate
        </a>
      )}

      <section style={heroSectionStyle}>
        <div style={heroGlowOneStyle} />
        <div style={heroGlowTwoStyle} />

        <div
          style={{
            ...heroInnerStyle,
            padding: isMobile ? "40px 18px 30px 18px" : "58px 24px",
          }}
        >
          <div style={{ ...logoWrapperStyle, marginBottom: isMobile ? "18px" : "22px" }}>
            <div
              style={{
                ...logoOuterStyle,
                width: isMobile ? "138px" : "180px",
                height: isMobile ? "138px" : "180px",
                borderRadius: isMobile ? "32px" : "40px",
              }}
            >
              <div
                style={{
                  ...logoInnerStyle,
                  borderRadius: isMobile ? "24px" : "32px",
                }}
              >
                <Image
                  src="/bg_app.png"
                  alt="Cardletics Logo"
                  width={170}
                  height={170}
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

          <h1
            style={{
              ...titleStyle,
              fontSize: isMobile ? "36px" : "clamp(40px, 7vw, 72px)",
              lineHeight: isMobile ? 1.06 : 1.02,
              marginBottom: isMobile ? "14px" : "18px",
            }}
          >
            Sportdaten werden
            <br />
            zu Karten, Teams
            <br />
            und echtem Progress.
          </h1>

          <p
            style={{
              ...subtitleStyle,
              fontSize: isMobile ? "16px" : "18px",
              marginBottom: isMobile ? "22px" : "28px",
            }}
          >
            Cardletics verbindet echte Bewegung mit digitalem Sammelkarten-Gameplay.
            Laufe, trainiere und bleibe aktiv, um Karten zu verdienen, Sammlungen
            zu vervollständigen, Teams aufzubauen, Kämpfe zu bestreiten und über
            die interne Börse zu handeln.
          </p>

          <div
            style={{
              ...buttonRowStyle,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
            }}
          >
            <div style={{ ...buttonStyle, width: isMobile ? "100%" : "auto" }}>
              App Store – bald verfügbar
            </div>
            <div style={{ ...buttonSecondaryStyle, width: isMobile ? "100%" : "auto" }}>
              Google Play – bald verfügbar
            </div>

            {isMobile && (
              <a
                href="mailto:Info@cardletics.com?subject=Affiliate%20Programm"
                style={{ ...affiliateInlineButtonStyle, width: "100%" }}
              >
                Affiliate Programm
              </a>
            )}
          </div>

          <p
            style={{
              ...heroHintStyle,
              fontSize: isMobile ? "13px" : "14px",
            }}
          >
            Cardletics ist kostenlos nutzbar und kann optional durch Abos, Coins
            und weitere Inhalte erweitert werden.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <div
          style={{
            ...statsStripStyle,
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <StatBox label="Tracking" value="Bewegung wird Progress" />
          <StatBox label="Karten" value="Selten, sammelbar, handelbar" />
          <StatBox label="Teams" value="Strategie & Battles" />
          <StatBox label="Marketplace" value="Interne Börse" />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionEyebrowStyle}>Was ist Cardletics?</div>
          <h2
            style={{
              ...sectionTitleStyle,
              fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)",
            }}
          >
            Eine App, die Aktivität spielbar macht
          </h2>
          <p style={sectionTextStyle}>
            Statt nur Schritte oder Läufe zu zählen, macht Cardletics aus deiner
            Aktivität ein System aus Karten, Belohnungen, Sammlung, Status und
            Strategie. So wird Bewegung langfristig motivierender und sichtbarer.
          </p>
        </div>

        <div
          style={{
            ...featureGridStyle,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <FeatureCard
            title="Sport wird belohnt"
            text="Deine echte Aktivität im Alltag und beim Training wird zur Grundlage deines Fortschritts."
          />
          <FeatureCard
            title="Karten mit Seltenheit"
            text="Du erhältst digitale Karten, kannst sie sammeln, präsentieren und ihre Seltenheit nutzen."
          />
          <FeatureCard
            title="Teams bauen"
            text="Kombiniere Karten sinnvoll und stelle dein eigenes Team für Kämpfe zusammen."
          />
          <FeatureCard
            title="Interne Börse"
            text="Karten können innerhalb des Systems gehandelt werden."
          />
          <FeatureCard
            title="Kollektionen vervollständigen"
            text="Arbeite auf vollständige Sets hin und sammle besondere Auszeichnungen."
          />
          <FeatureCard
            title="Awards & Prestige"
            text="Besondere Leistungen, Serien und Fortschritte werden sichtbar belohnt."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div
          style={{
            ...howItWorksPanelStyle,
            padding: isMobile ? "18px" : "22px",
          }}
        >
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>App erklärt</div>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)",
              }}
            >
              So nutzt man Cardletics
            </h2>
            <p style={sectionTextStyle}>
              Damit sofort klar ist, wie die App funktioniert, zeigt diese Seite
              den Ablauf einfach und verständlich.
            </p>
          </div>

          <div
            style={{
              ...stepsGridStyle,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <StepCard
              number="1"
              title="Aktivität tracken"
              text="Du bewegst dich im echten Leben. Sport und Aktivität werden als Grundlage für deinen Fortschritt genutzt."
            />
            <StepCard
              number="2"
              title="Karten verdienen"
              text="Für Aktivität, Fortschritt und besondere Leistungen erhältst du digitale Karten."
            />
            <StepCard
              number="3"
              title="Sammeln und optimieren"
              text="Du vervollständigst Kollektionen, sammelst seltene Karten und verbesserst deine Auswahl."
            />
            <StepCard
              number="4"
              title="Team bauen und kämpfen"
              text="Mit deinen Karten stellst du Teams zusammen und trittst in Battles gegen andere an."
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div
          style={{
            ...screensSectionStyle,
            padding: isMobile ? "18px" : "22px",
          }}
        >
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>Screenshots</div>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)",
              }}
            >
              Einblicke in die App
            </h2>
            <p style={sectionTextStyle}>
              Diese Bereiche sind bereits mit festen Dateinamen vorbereitet.
              Sobald du die Bilder in `public` ablegst, erscheinen sie automatisch.
            </p>
          </div>

          <div
            style={{
              ...screensGridStyle,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            <ScreenshotCard
              title="Homescreen"
              text="Startbereich, Hauptnavigation und Überblick"
              fileName="/home-screen.png"
            />
            <ScreenshotCard
              title="Battle Screen"
              text="Teamkampf, Strategie und Battle-Ansicht"
              fileName="/battle-screen.png"
            />
            <ScreenshotCard
              title="Karte im Detail"
              text="Einzelne Karte mit Werten, Design und Seltenheit"
              fileName="/card-detail.png"
            />
            <ScreenshotCard
              title="Awards"
              text="Belohnungen, Erfolge und freigeschaltete Meilensteine"
              fileName="/awards-screen.png"
            />
            <ScreenshotCard
              title="Pack Opening"
              text="Packs öffnen und neue Karten erhalten"
              fileName="/pack-opening.png"
            />
            <ScreenshotCard
              title="Collection"
              text="Sammlung, Sets und Vervollständigung"
              fileName="/collection-screen.png"
            />
            <ScreenshotCard
              title="Börse / Marketplace"
              text="Interner Handel mit Karten"
              fileName="/marketplace-screen.png"
            />
            <ScreenshotCard
              title="Shop"
              text="Coins, Angebote und weitere In-App-Käufe"
              fileName="/shop-screen.png"
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div
          style={{
            ...affiliatePanelStyle,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            padding: isMobile ? "18px" : "24px",
          }}
        >
          <div style={affiliateTextColStyle}>
            <div style={sectionEyebrowStyle}>Affiliate Programm</div>
            <h2
              style={{
                ...sectionTitleStyle,
                fontSize: isMobile ? "28px" : "clamp(28px, 4vw, 42px)",
              }}
            >
              Creator, Partner und Communities einbinden
            </h2>
            <p style={sectionTextStyle}>
              Cardletics soll auch durch Partner, Creator und Communities wachsen.
              Deshalb gibt es ein Affiliate-Programm, über das später Empfehlungen,
              Performance und mögliche Einnahmen sichtbar gemacht werden können.
            </p>
            <p style={affiliateSmallTextStyle}>
              Später kann hier zusätzlich ein direkter Link zum Affiliate-Bereich
              in der App oder im Web ergänzt werden.
            </p>
          </div>

          <div style={affiliateActionWrapStyle}>
            <a
              href="mailto:Info@cardletics.com?subject=Affiliate%20Programm"
              style={{ ...buttonStyle, width: isMobile ? "100%" : "auto" }}
            >
              Affiliate anfragen
            </a>
          </div>
        </div>
      </section>

      <footer
        style={{
          ...footerStyle,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        <div style={footerBrandStyle}>
          <div style={footerBrandTitleStyle}>Cardletics</div>
          <div style={footerBrandTextStyle}>www.cardletics.com</div>
        </div>

        <div
          style={{
            ...footerLinksStyle,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "8px" : "14px",
          }}
        >
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

      <div
        style={{
          ...helpWidgetWrapStyle,
          right: isMobile ? "14px" : "18px",
          bottom: isMobile ? "14px" : "18px",
        }}
      >
        {helpOpen && (
          <div
            style={{
              ...helpPanelStyle,
              width: isMobile ? "calc(100vw - 28px)" : "min(360px, calc(100vw - 36px))",
            }}
          >
            <div style={helpPanelHeaderStyle}>
              <div>
                <div style={helpTitleStyle}>Cardletics Hilfe</div>
                <div style={helpSubtitleStyle}>
                  Schnelle Antworten auf typische Fragen
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                style={helpCloseButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={helpQuestionListStyle}>
              <QuickQuestion
                text="Wie funktioniert Cardletics?"
                answer="Du trackst Aktivität, erhältst Karten, sammelst Kollektionen, baust Teams und kannst Kämpfe bestreiten."
              />
              <QuickQuestion
                text="Ist die App kostenlos?"
                answer="Ja, die App ist grundsätzlich kostenlos nutzbar. Zusätzlich sind optionale Abos und In-App-Käufe möglich."
              />
              <QuickQuestion
                text="Kann man Karten handeln?"
                answer="Ja, Karten können innerhalb einer internen Börse gehandelt werden."
              />
              <QuickQuestion
                text="Wie läuft das Affiliate-Programm?"
                answer="Das Affiliate-Programm ist für Partner, Creator und Communities gedacht. Details und Tracking können später direkt im System sichtbar gemacht werden."
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setHelpOpen((prev) => !prev)}
          style={{
            ...helpLauncherStyle,
            minHeight: isMobile ? "46px" : "52px",
            padding: isMobile ? "10px 16px" : "12px 18px",
          }}
        >
          Hilfe
        </button>
      </div>
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

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div style={stepCardStyle}>
      <div style={stepNumberStyle}>{number}</div>
      <h3 style={stepTitleStyle}>{title}</h3>
      <p style={stepTextStyle}>{text}</p>
    </div>
  );
}

function ScreenshotCard({
  title,
  text,
  fileName,
}: {
  title: string;
  text: string;
  fileName: string;
}) {
  return (
    <div style={screenshotCardStyle}>
      <div style={screenshotRealWrapStyle}>
        <img src={fileName} alt={title} style={screenshotImageStyle} />
      </div>

      <div style={screenshotTextWrapStyle}>
        <h3 style={screenshotTitleStyle}>{title}</h3>
        <p style={screenshotTextStyle}>{text}</p>
        <p style={screenshotFileHintStyle}>{fileName}</p>
      </div>
    </div>
  );
}

function QuickQuestion({
  text,
  answer,
}: {
  text: string;
  answer: string;
}) {
  return (
    <details style={quickQuestionStyle}>
      <summary style={quickQuestionSummaryStyle}>{text}</summary>
      <p style={quickQuestionAnswerStyle}>{answer}</p>
    </details>
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
    "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #09100d 0%, #0c120f 100%)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  position: "relative",
};

const affiliateSideButtonStyle: React.CSSProperties = {
  position: "fixed",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 30,
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  padding: "16px 10px",
  borderRadius: "16px",
  background: "linear-gradient(180deg, #22c55e 0%, #14532d 100%)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 700,
  boxShadow: "0 10px 30px rgba(34,197,94,0.25)",
};

const affiliateInlineButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "48px",
  padding: "12px 18px",
  background: "linear-gradient(135deg, #22c55e 0%, #14532d 100%)",
  borderRadius: "14px",
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const heroSectionStyle: React.CSSProperties = {
  position: "relative",
  maxWidth: "1200px",
  margin: "0 auto",
  borderRadius: "34px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(26,128,87,0.45) 0%, rgba(18,30,58,0.92) 100%)",
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
  background: "rgba(34,197,94,0.22)",
  filter: "blur(55px)",
};

const heroGlowTwoStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "-80px",
  right: "-40px",
  width: "260px",
  height: "260px",
  borderRadius: "999px",
  background: "rgba(59,130,246,0.18)",
  filter: "blur(65px)",
};

const heroInnerStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: "880px",
  margin: "0 auto",
  textAlign: "center",
};

const logoWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const logoOuterStyle: React.CSSProperties = {
  width: "180px",
  height: "180px",
  borderRadius: "40px",
  background:
    "linear-gradient(135deg, #22c55e 0%, #4ade80 35%, #0ea5e9 100%)",
  padding: "8px",
  boxShadow:
    "0 25px 80px rgba(34,197,94,0.45), inset 0 0 40px rgba(255,255,255,0.08)",
};

const logoInnerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "32px",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.25))",
  backdropFilter: "blur(6px)",
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
  color: "#ffffff",
  letterSpacing: "-0.03em",
};

const subtitleStyle: React.CSSProperties = {
  maxWidth: "760px",
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

const heroHintStyle: React.CSSProperties = {
  marginTop: "16px",
  color: "#9db0a7",
  lineHeight: 1.6,
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "28px auto 0 auto",
};

const statsStripStyle: React.CSSProperties = {
  display: "grid",
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

const howItWorksPanelStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.18) 0%, rgba(15,23,42,0.18) 100%)",
  border: "1px solid #27312d",
  borderRadius: "24px",
};

const stepsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const stepCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "18px",
};

const stepNumberStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  background: "#22c55e",
  color: "#08130c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  marginBottom: "12px",
};

const stepTitleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  color: "#ffffff",
};

const stepTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};

const screensSectionStyle: React.CSSProperties = {
  background: "#111714",
  border: "1px solid #27312d",
  borderRadius: "24px",
};

const screensGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const screenshotCardStyle: React.CSSProperties = {
  background: "#141b18",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "16px",
};

const screenshotRealWrapStyle: React.CSSProperties = {
  borderRadius: "20px",
  overflow: "hidden",
  background: "#0f1512",
  border: "1px solid #27312d",
  minHeight: "320px",
};

const screenshotImageStyle: React.CSSProperties = {
  width: "100%",
  height: "320px",
  objectFit: "cover",
  display: "block",
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

const screenshotFileHintStyle: React.CSSProperties = {
  margin: "10px 0 0 0",
  color: "#6f847b",
  fontSize: "12px",
  lineHeight: 1.5,
};

const affiliatePanelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  flexWrap: "wrap",
  background: "linear-gradient(180deg, #171f1c 0%, #121816 100%)",
  border: "1px solid #27312d",
  borderRadius: "24px",
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

const affiliateActionWrapStyle: React.CSSProperties = {
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
  flexWrap: "wrap",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#cfe0d6",
  textDecoration: "none",
};

const helpWidgetWrapStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 40,
};

const helpLauncherStyle: React.CSSProperties = {
  borderRadius: "999px",
  border: "1px solid #2c3b34",
  background: "#171f1c",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
};

const helpPanelStyle: React.CSSProperties = {
  marginBottom: "12px",
  background: "#111714",
  border: "1px solid #27312d",
  borderRadius: "20px",
  padding: "16px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
};

const helpPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const helpTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "4px",
};

const helpSubtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a39b",
  lineHeight: 1.5,
};

const helpCloseButtonStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#171f1c",
  color: "#ffffff",
  cursor: "pointer",
};

const helpQuestionListStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};

const quickQuestionStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "12px",
};

const quickQuestionSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  color: "#e7f1eb",
};

const quickQuestionAnswerStyle: React.CSSProperties = {
  margin: "10px 0 0 0",
  color: "#94a39b",
  lineHeight: 1.6,
  fontSize: "14px",
};