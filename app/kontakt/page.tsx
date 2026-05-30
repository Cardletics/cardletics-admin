"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Bitte fülle Name, E-Mail und Nachricht aus.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("contact_requests").insert([
      {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    ]);

    setSending(false);

    if (error) {
      setError("Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.");
      return;
    }

    setSuccess("Deine Nachricht wurde erfolgreich gesendet.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <Link href="/" style={backLinkStyle}>
          ← Zurück zur Startseite
        </Link>

        <div style={badgeStyle}>Kontakt</div>

        <h1 style={titleStyle}>Schreib uns eine Nachricht</h1>

        <p style={introStyle}>
          Du hast Fragen zu Cardletics, Affiliate, Support oder Kooperationen?
          Dann nutze einfach das Formular.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={gridStyle}>
            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                style={inputStyle}
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>E-Mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Betreff</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Worum geht es?"
              style={inputStyle}
            />
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Nachricht *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schreibe hier deine Nachricht..."
              style={textareaStyle}
            />
          </div>

          {error ? <div style={errorStyle}>{error}</div> : null}
          {success ? <div style={successStyle}>{success}</div> : null}

          <button type="submit" disabled={sending} style={buttonStyle}>
            {sending ? "Wird gesendet..." : "Nachricht senden"}
          </button>
        </form>
      </div>
          <PageFooter />
</main>
  );
}


function PageFooter() {
  return (
    <footer style={footerStyle}>
      <div style={footerBrandStyle}>
        <strong>Cardletics</strong>
        <span>Track • Collect • Battle • Trade</span>
      </div>
      <nav style={footerLinksStyle}>
        <Link href="/impressum" style={footerLinkStyle}>Impressum</Link>
        <Link href="/datenschutz" style={footerLinkStyle}>Datenschutz</Link>
        <Link href="/agb" style={footerLinkStyle}>AGB</Link>
        <Link href="/kontakt" style={footerLinkStyle}>Kontakt</Link>
      </nav>
    </footer>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #09100d 0%, #0c120f 100%)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "24px",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "28px",
  boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
};

const backLinkStyle: React.CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "18px",
  fontWeight: 700,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#c7f9d8",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "38px",
  color: "#ffffff",
};

const introStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "24px",
  color: "#b7c6be",
  lineHeight: 1.7,
  fontSize: "16px",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const fieldWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  color: "#dce9e2",
  fontSize: "14px",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "48px",
  padding: "12px 14px",
  boxSizing: "border-box",
  borderRadius: "14px",
  border: "1px solid #2d3b35",
  background: "#101714",
  color: "#ffffff",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "180px",
  padding: "14px",
  boxSizing: "border-box",
  borderRadius: "14px",
  border: "1px solid #2d3b35",
  background: "#101714",
  color: "#ffffff",
  outline: "none",
  resize: "vertical",
  fontFamily: "Arial, sans-serif",
};

const buttonStyle: React.CSSProperties = {
  minHeight: "50px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(34,197,94,0.22)",
};

const errorStyle: React.CSSProperties = {
  borderRadius: "14px",
  padding: "12px 14px",
  background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.32)",
  color: "#fecaca",
};

const successStyle: React.CSSProperties = {
  borderRadius: "14px",
  padding: "12px 14px",
  background: "rgba(34,197,94,0.12)",
  border: "1px solid rgba(34,197,94,0.32)",
  color: "#bbf7d0",
};

const footerStyle: React.CSSProperties = {
  maxWidth: "980px",
  margin: "24px auto 0 auto",
  padding: "18px",
  borderRadius: "20px",
  background: "#111714",
  border: "1px solid #27312d",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const footerBrandStyle: React.CSSProperties = {
  display: "grid",
  gap: "4px",
  color: "#ffffff",
};

const footerLinksStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  fontWeight: 800,
  padding: "8px 10px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(134,239,172,0.18)",
};
