import type { CSSProperties } from "react";
import Link from "next/link";

export default function DeleteAccountPageEn() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <span style={eyebrowStyle}>Account deletion</span>
          <h1 style={titleStyle}>Delete your Cardletics account</h1>
          <p style={subtitleStyle}>
            Here you can find out how to delete your Cardletics account and the
            associated user data.
          </p>

          <div style={heroActionsStyle}>
            <Link href="/" style={backButtonStyle}>
              Back to homepage
            </Link>
            <a
              href="mailto:support@cardletics.com?subject=Cardletics%20account%20deletion"
              style={mailButtonStyle}
            >
              Request deletion by email
            </a>
            <Link href="/delete" style={mailButtonStyle}>
              Deutsch
            </Link>
          </div>
        </div>

        <Section title="1. How to delete your account">
          <p>
            The fastest way to delete your Cardletics account is directly in the
            app under <strong>Settings → Delete account</strong>. The technical
            account-deletion process is triggered immediately there.
          </p>
          <p>
            Alternatively, you can send a deletion request by email to
            <strong> support@cardletics.com</strong>. Where possible, use the email
            address registered with Cardletics so that we can identify your account
            reliably.
          </p>
          <p style={infoBoxStyle}>
            Suggested subject: <strong>Cardletics account deletion</strong>
          </p>
        </Section>

        <Section title="2. Data that are deleted">
          <p>After the account has been identified, we delete in particular:</p>
          <ul style={listStyle}>
            <li>your user account and login assignment,</li>
            <li>your profile, username and profile information,</li>
            <li>your card, inventory, progress and game data,</li>
            <li>friends, group, chat and social data where associated with your account,</li>
            <li>location/nearby data where associated with your account,</li>
            <li>health, fitness and movement data where stored by Cardletics.</li>
          </ul>
        </Section>

        <Section title="3. Data that may be retained for longer">
          <p>
            Certain data may need to be retained for longer for legal reasons, for
            example where statutory retention obligations apply or where the data
            are required for billing, fraud prevention, security or legal claims.
          </p>
          <p>
            This may include purchase, payment, tax or transaction records. Such
            data are retained only to the extent necessary and only for legally
            permitted purposes.
          </p>
        </Section>

        <Section title="4. Processing time">
          <p>
            When you delete your account directly in the app, the technical
            account-deletion process is triggered immediately. Manual deletion
            requests sent by email are handled as quickly as possible and generally
            within 30 days after the account has been successfully identified.
          </p>
        </Section>

        <Section title="5. Contact">
          <p>
            Email:{" "}
            <a href="mailto:support@cardletics.com" style={linkStyle}>
              support@cardletics.com
            </a>
          </p>
          <p>
            More information is available in our{" "}
            <Link href="/datenschutz/en" style={linkStyle}>
              Privacy Policy
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