export default function GameDataPage() {
  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Game Data</h1>
        <p style={pageSubtitleStyle}>
          Hier verwaltest du später Karten, Balancing, Shop-Elemente und Marketplace-Daten.
        </p>
      </div>

      <div style={heroCardStyle}>
        <div>
          <div style={heroLabelStyle}>Live Management</div>
          <div style={heroValueStyle}>Game Data Zentrale</div>
          <div style={heroSublineStyle}>
            Schneller Zugriff auf die wichtigsten Bereiche für dein Mobile Game.
          </div>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Quick Actions</h3>
          <span style={sectionTextSmallStyle}>Schneller Zugriff</span>
        </div>

        <div style={quickActionGridStyle}>
          <ActionCard
            title="Karten verwalten"
            text="Neue Karten, Seltenheit, Werte und Inhalte pflegen."
          />
          <ActionCard
            title="Balancing anpassen"
            text="Kosten, Rewards, Drop Rates und Progression ändern."
          />
          <ActionCard
            title="Shop aktualisieren"
            text="Angebote, Preise, Coin-Pakete und Bundles verwalten."
          />
          <ActionCard
            title="Marketplace prüfen"
            text="Gebühren, Listings und Handelsdaten kontrollieren."
          />
        </div>
      </div>

      <div style={overviewGridStyle}>
        <InfoPanel
          title="Cards"
          text="Hier kannst du später Kartenlisten, Raritäten, Stats und Freischaltungen verwalten."
          badge="Geplant"
        />
        <InfoPanel
          title="Balancing"
          text="Passe Werte wie Coin-Kosten, Card-Progression, Pack-Inhalte und Ökonomie an."
          badge="Geplant"
        />
        <InfoPanel
          title="Shop"
          text="Verwalte Echtgeld-Produkte, Coin-Angebote, Events und Promotion-Bundles."
          badge="Geplant"
        />
        <InfoPanel
          title="Marketplace"
          text="Prüfe Sales, Gebühren, Aktivität und Stabilität deiner Ingame-Ökonomie."
          badge="Geplant"
        />
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Empfohlene nächste Schritte</h3>
        </div>

        <div style={stepsListStyle}>
          <StepItem
            number="1"
            title="Cards Tabelle anbinden"
            text="Lade zuerst echte Karten aus Supabase und zeige sie als mobile Cards an."
          />
          <StepItem
            number="2"
            title="Balancing Editor bauen"
            text="Erstelle Formulare für Werte, Kosten, Multiplikatoren und Limits."
          />
          <StepItem
            number="3"
            title="Shop Management hinzufügen"
            text="Pflege Coin-Pakete, Preise, Verfügbarkeiten und Aktionen direkt im Admin."
          />
          <StepItem
            number="4"
            title="Marketplace Übersicht ergänzen"
            text="Zeige Listings, Verkäufe, Gebühren und auffällige Bewegungen an."
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={actionCardStyle}>
      <div style={actionTitleStyle}>{title}</div>
      <div style={actionTextStyle}>{text}</div>
      <button type="button" style={actionButtonStyle}>
        Öffnen
      </button>
    </div>
  );
}

function InfoPanel({
  title,
  text,
  badge,
}: {
  title: string;
  text: string;
  badge: string;
}) {
  return (
    <div style={infoPanelStyle}>
      <div style={infoPanelTopStyle}>
        <h3 style={infoPanelTitleStyle}>{title}</h3>
        <span style={badgeStyle}>{badge}</span>
      </div>
      <p style={infoPanelTextStyle}>{text}</p>
    </div>
  );
}

function StepItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div style={stepItemStyle}>
      <div style={stepNumberStyle}>{number}</div>
      <div>
        <div style={stepTitleStyle}>{title}</div>
        <div style={stepTextStyle}>{text}</div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  width: "100%",
};

const pageHeaderStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "30px",
  color: "#e7f1eb",
};

const pageSubtitleStyle: React.CSSProperties = {
  marginTop: 0,
  color: "#94a39b",
  lineHeight: 1.5,
};

const heroCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
  marginBottom: "20px",
};

const heroLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "8px",
};

const heroValueStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 800,
  color: "white",
  lineHeight: 1.1,
};

const heroSublineStyle: React.CSSProperties = {
  marginTop: "10px",
  color: "#bbf7d0",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: 1.5,
};

const sectionCardStyle: React.CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginTop: "20px",
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#e7f1eb",
};

const sectionTextSmallStyle: React.CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const quickActionGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const actionCardStyle: React.CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const actionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#e7f1eb",
};

const actionTextStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.6,
  color: "#94a39b",
};

const actionButtonStyle: React.CSSProperties = {
  minHeight: "44px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #22c55e",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  cursor: "pointer",
};

const overviewGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
  marginTop: "20px",
};

const infoPanelStyle: React.CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const infoPanelTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "10px",
};

const infoPanelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#e7f1eb",
  fontSize: "20px",
};

const infoPanelTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  background: "#163322",
  color: "#86efac",
  whiteSpace: "nowrap",
};

const stepsListStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const stepItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "14px",
};

const stepNumberStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  minWidth: "32px",
  borderRadius: "999px",
  background: "#22c55e",
  color: "#08130c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#e7f1eb",
  marginBottom: "6px",
};

const stepTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#94a39b",
  lineHeight: 1.6,
};