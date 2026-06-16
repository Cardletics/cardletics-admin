"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirectTo, setRedirectTo] = useState("/admin/users");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function prepareLogin() {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      const errorParam = params.get("error");

      const safeRedirect =
        redirectParam && redirectParam.startsWith("/admin")
          ? redirectParam
          : "/admin/users";

      setRedirectTo(safeRedirect);

      if (errorParam === "not_admin") {
        setErrorMessage("Dieser Account hat keine Adminrechte.");
      }

      const { data } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!data.session) {
        setCheckingSession(false);
        return;
      }

      const { data: isAdmin } = await supabase.rpc("is_admin_user");

      if (cancelled) return;

      if (isAdmin === true) {
        router.replace(safeRedirect);
        return;
      }

      await supabase.auth.signOut();

      if (cancelled) return;

      setCheckingSession(false);
      setErrorMessage("Die vorhandene Session hat keine Adminrechte.");
    }

    prepareLogin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (loginError) {
      setLoading(false);
      setErrorMessage(loginError.message || "Login fehlgeschlagen.");
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_admin_user"
    );

    if (adminError) {
      await supabase.auth.signOut();
      setLoading(false);
      setErrorMessage(adminError.message || "Admin-Prüfung fehlgeschlagen.");
      return;
    }

    if (isAdmin !== true) {
      await supabase.auth.signOut();
      setLoading(false);
      setErrorMessage("Login erfolgreich, aber dieser Account ist kein Admin.");
      return;
    }

    setInfoMessage("Login erfolgreich. Weiterleitung...");
    router.replace(redirectTo);
  }

  if (checkingSession) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Cardletics Admin</h1>
          <p style={subtitleStyle}>Session wird geprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <p style={eyebrowStyle}>Cardletics</p>
          <h1 style={titleStyle}>Admin Login</h1>
          <p style={subtitleStyle}>
            Melde dich mit einem echten Supabase-Adminaccount per E-Mail und
            Passwort an.
          </p>
        </div>

        {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
        {infoMessage && <div style={infoBoxStyle}>{infoMessage}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle}>E-Mail</label>
            <input
              type="email"
              placeholder="info@cardletics.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label style={labelStyle}>Passwort</label>
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Login läuft..." : "Einloggen"}
          </button>
        </form>

        <p style={hintStyle}>
          Wichtig: Username allein reicht nicht. Supabase muss eine echte Auth-Session
          erstellen, damit <strong>auth.uid()</strong> funktioniert.
        </p>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 34%), #07100c",
  padding: "24px",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "460px",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "22px",
  padding: "26px",
  boxShadow: "0 22px 80px rgba(0,0,0,0.42)",
};

const headerStyle: CSSProperties = {
  marginBottom: "22px",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px 0",
  color: "#86efac",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "12px",
};

const titleStyle: CSSProperties = {
  margin: "0 0 8px 0",
  color: "#e7f1eb",
  fontSize: "30px",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  color: "#94a39b",
  lineHeight: 1.5,
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#cfe0d6",
  fontWeight: 800,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: "48px",
  borderRadius: "14px",
  border: "1px solid #27312d",
  background: "#0f1512",
  color: "#e7f1eb",
  padding: "12px 14px",
  boxSizing: "border-box",
  outline: "none",
};

const buttonStyle: CSSProperties = {
  minHeight: "50px",
  border: "0",
  borderRadius: "14px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 900,
  fontSize: "15px",
  cursor: "pointer",
};

const errorBoxStyle: CSSProperties = {
  background: "#331717",
  border: "1px solid #7f1d1d",
  color: "#fecaca",
  borderRadius: "14px",
  padding: "12px 14px",
  marginBottom: "16px",
  lineHeight: 1.5,
};

const infoBoxStyle: CSSProperties = {
  background: "#163322",
  border: "1px solid #166534",
  color: "#bbf7d0",
  borderRadius: "14px",
  padding: "12px 14px",
  marginBottom: "16px",
  lineHeight: 1.5,
};

const hintStyle: CSSProperties = {
  margin: "18px 0 0 0",
  color: "#94a39b",
  fontSize: "13px",
  lineHeight: 1.5,
};
