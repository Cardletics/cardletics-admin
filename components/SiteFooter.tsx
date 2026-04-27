"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function SiteFooter() {
  return (
    <footer style={footerWrapStyle}>
      <div style={footerStyle}>
        <div style={topRowStyle}>
          <div style={brandBlockStyle}>
            <div style={logoStyle}>CARDLETICS</div>
            <p style={taglineStyle}>
              Track. Collect. Battle. Trade.
            </p>
          </div>

          <nav style={navStyle} aria-label="Footer Navigation">
            <Link href="/" style={linkStyle}>
              Startseite
            </Link>
            <Link href="/impressum" style={linkStyle}>
              Impressum
            </Link>
            <Link href="/datenschutz" style={linkStyle}>
              Datenschutz
            </Link>
            <Link href="/agb" style={linkStyle}>
              AGB
            </Link>
            <a href="mailto:info@cardletics.com" style={linkStyle}>
              Kontakt
            </a>
          </nav>
        </div>

        <div style={dividerStyle} />

        <div style={bottomRowStyle}>
          <span style={smallTextStyle}>Cardletics since 2025</span>
        </div>
      </div>
    </footer>
  );
}

const footerWrapStyle: CSSProperties = {
  width: "100%",
  padding: "0 16px 20px",
  boxSizing: "border-box",
  marginTop: "32px",
};

const footerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  background:
    "linear-gradient(135deg, rgba(20,83,45,0.96) 0%, rgba(12,20,16,0.96) 100%)",
  border: "1px solid #2b3b33",
  borderRadius: "22px",
  padding: "22px 20px 18px",
  boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap",
};

const brandBlockStyle: CSSProperties = {
  minWidth: "220px",
};

const logoStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: 900,
  letterSpacing: "0.08em",
  color: "#eafff0",
};

const taglineStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#b7d6c0",
  fontSize: "14px",
  lineHeight: 1.5,
};

const navStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e7f1eb",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};

const dividerStyle: CSSProperties = {
  height: "1px",
  margin: "18px 0 14px",
  background: "rgba(255,255,255,0.08)",
};

const bottomRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const smallTextStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "13px",
};