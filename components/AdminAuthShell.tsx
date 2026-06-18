"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "../lib/supabase";

type AuthState = "checking" | "login" | "allowed";

export default function AdminAuthShell({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Session wird geprüft...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function checkSession() {
    setAuthState("checking");
    setMessage("Session wird geprüft...");
    setErrorMessage(null);

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      setEmail(null);
      setAuthState("login");
      setErrorMessage(sessionError.message);
      return;
    }

    if (!sessionData.session) {
      setEmail(null);
      setAuthState("login");
      setMessage("Bitte als Admin einloggen.");
      return;
    }

    setEmail(sessionData.session.user.email ?? null);
    setMessage("Adminrechte werden geprüft...");

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_admin_user"
    );

    if (adminError) {
      setAuthState("login");
      setErrorMessage(adminError.message);
      return;
    }

    if (isAdmin !== true) {
      await supabase.auth.signOut();
      setEmail(null);
      setAuthState("login");
      setErrorMessage("Dieser Account ist kein Admin.");
      return;
    }

    setAuthState("allowed");
  }

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Kein automatisches Redirect mehr. Nur Session neu prüfen.
      checkSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function resolveLoginEmail(identifier: string) {
    const cleanIdentifier = identifier.trim().toLowerCase();

    if (!cleanIdentifier) return null;

    const { data, error } = await supabase.rpc("admin_resolve_login_identifier", {
      p_identifier: cleanIdentifier,
    });

    if (error) {
      throw new Error(error.message || "Username/E-Mail konnte nicht geprüft werden.");
    }

    if (!data || typeof data !== "string") return null;

    return data.trim().toLowerCase();
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);

    if (!loginIdentifier.trim() || !password) {
      setErrorMessage("Bitte Username/E-Mail und Passwort eingeben.");
      return;
    }

    setLoading(true);
    setMessage("Login wird geprüft...");

    try {
      const loginEmail = await resolveLoginEmail(loginIdentifier);

      if (!loginEmail) {
        setErrorMessage("Kein Adminaccount mit diesem Username oder dieser E-Mail gefunden.");
        setLoading(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (loginError) {
        setErrorMessage("Login fehlgeschlagen. Bitte prüfe Username/E-Mail und Passwort.");
        setLoading(false);
        return;
      }

      setMessage("Login erfolgreich. Adminrechte werden geprüft...");

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setErrorMessage("Login erfolgreich, aber die Session wurde nicht gespeichert.");
        setLoading(false);
        return;
      }

      setEmail(sessionData.session.user.email ?? null);

      const { data: isAdmin, error: adminError } = await supabase.rpc(
        "is_admin_user"
      );

      if (adminError) {
        setErrorMessage(adminError.message || "Admin-Prüfung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      if (isAdmin !== true) {
        await supabase.auth.signOut();
        setErrorMessage("Login erfolgreich, aber dieser Account ist kein Admin.");
        setLoading(false);
        return;
      }

      setAuthState("allowed");
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Login konnte nicht geprüft werden."
      );
    }

    setLoading(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setEmail(null);
    setAuthState("login");
    setPassword("");
    setLoggingOut(false);
  }

  if (authState === "checking") {
    return (
      <div style={centerPageStyle}>
        <div style={statusCardStyle}>
          <h1 style={statusTitleStyle}>Cardletics Admin</h1>
          <p style={statusTextStyle}>{message}</p>
        </div>
      </div>
    );
  }

  if (authState === "login") {
    return (
      <div style={loginPageStyle}>
        <div style={loginCardStyle}>
          <p style={eyebrowStyle}>Cardletics</p>
          <h1 style={statusTitleStyle}>Admin Login</h1>
          <p style={statusTextStyle}>
            Melde dich mit deinem Admin-Username oder deiner Admin-E-Mail an.
          </p>

          {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
          {!errorMessage && message && <div style={infoBoxStyle}>{message}</div>}

          <form onSubmit={handleLogin} style={formStyle}>
            <div>
              <label style={labelStyle}>Username oder E-Mail</label>
              <input
                type="text"
                placeholder="Username oder E-Mail"
                value={loginIdentifier}
                onChange={(event) => setLoginIdentifier(event.target.value)}
                style={inputStyle}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
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

          <button type="button" onClick={checkSession} style={secondaryButtonStyle}>
            Session neu prüfen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-main">
        <div style={topbarStyle}>
          <div>
            <div style={topbarLabelStyle}>Eingeloggt als Admin</div>
            <div style={topbarEmailStyle}>{email || "Unbekannte Session"}</div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              ...logoutButtonStyle,
              opacity: loggingOut ? 0.65 : 1,
              cursor: loggingOut ? "not-allowed" : "pointer",
            }}
          >
            {loggingOut ? "Logout..." : "Ausloggen"}
          </button>
        </div>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

const centerPageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#07100c",
  padding: "24px",
};

const loginPageStyle: CSSProperties = {
  ...centerPageStyle,
  background:
    "radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 34%), #07100c",
};

const statusCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "440px",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
};

const loginCardStyle: CSSProperties = {
  ...statusCardStyle,
  maxWidth: "460px",
  borderRadius: "22px",
  padding: "26px",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 8px 0",
  color: "#86efac",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "12px",
};

const statusTitleStyle: CSSProperties = {
  margin: "0 0 10px 0",
  color: "#e7f1eb",
  fontSize: "30px",
};

const statusTextStyle: CSSProperties = {
  margin: "0 0 18px 0",
  color: "#cfe0d6",
  lineHeight: 1.5,
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

const secondaryButtonStyle: CSSProperties = {
  marginTop: "12px",
  minHeight: "42px",
  padding: "9px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#101714",
  color: "#e7f1eb",
  fontWeight: 800,
  cursor: "pointer",
};

const topbarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  background: "#111814",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const topbarLabelStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "12px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "4px",
};

const topbarEmailStyle: CSSProperties = {
  color: "#e7f1eb",
  fontSize: "14px",
  fontWeight: 800,
  wordBreak: "break-word",
};

const logoutButtonStyle: CSSProperties = {
  minHeight: "42px",
  padding: "9px 14px",
  borderRadius: "12px",
  border: "1px solid #7f1d1d",
  background: "#331717",
  color: "#fecaca",
  fontWeight: 900,
};
