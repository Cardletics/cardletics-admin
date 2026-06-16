"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { supabase } from "../lib/supabase";

type AuthState = "checking" | "allowed" | "blocked";

export default function AdminAuthShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [message, setMessage] = useState("Admin-Session wird geprüft...");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let cancelled = false;

    async function waitForSession() {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          return { session: null, error };
        }

        if (data.session) {
          return { session: data.session, error: null };
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      return { session: null, error: null };
    }

    async function checkAdminSession() {
      if (isLoginPage) {
        setAuthState("allowed");
        return;
      }

      setAuthState("checking");
      setMessage("Admin-Session wird geprüft...");

      const { session, error: sessionError } = await waitForSession();

      if (cancelled) return;

      if (sessionError) {
        console.error("Supabase Session Fehler:", sessionError);
        setAuthState("blocked");
        setMessage("Session konnte nicht geprüft werden.");
        window.location.replace("/admin/login");
        return;
      }

      if (!session) {
        setSessionEmail(null);
        setAuthState("blocked");
        setMessage("Nicht eingeloggt. Weiterleitung zum Admin-Login...");
        const redirect = encodeURIComponent(pathname || "/admin/users");
        window.location.replace(`/admin/login?redirect=${redirect}`);
        return;
      }

      setSessionEmail(session.user.email ?? null);
      setMessage("Adminrechte werden geprüft...");

      const { data: isAdmin, error: adminError } = await supabase.rpc(
        "is_admin_user"
      );

      if (cancelled) return;

      if (adminError) {
        console.error("Admin-Prüfung fehlgeschlagen:", adminError);
        setAuthState("blocked");
        setMessage(adminError.message || "Admin-Prüfung fehlgeschlagen.");
        return;
      }

      if (isAdmin !== true) {
        await supabase.auth.signOut();

        if (cancelled) return;

        setSessionEmail(null);
        setAuthState("blocked");
        setMessage("Dieser Account hat keine Adminrechte.");
        window.location.replace("/admin/login?error=not_admin");
        return;
      }

      setAuthState("allowed");
    }

    checkAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isLoginPage) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSessionEmail(session?.user.email ?? null);
      }

      if (event === "SIGNED_OUT") {
        setSessionEmail(null);
        const redirect = encodeURIComponent(pathname || "/admin/users");
        window.location.replace(`/admin/login?redirect=${redirect}`);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [isLoginPage, pathname, router]);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout fehlgeschlagen:", error);
      setLoggingOut(false);
      setMessage(error.message || "Logout fehlgeschlagen.");
      return;
    }

    setSessionEmail(null);
    window.location.replace("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
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

  if (authState === "blocked") {
    return (
      <div style={centerPageStyle}>
        <div style={errorCardStyle}>
          <h1 style={statusTitleStyle}>Admin-Zugriff blockiert</h1>
          <p style={statusTextStyle}>{message}</p>
          <button
            type="button"
            onClick={() => window.location.replace("/admin/login")}
            style={buttonStyle}
          >
            Zum Login
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
            <div style={topbarEmailStyle}>{sessionEmail || "Unbekannte Session"}</div>
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

const statusCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "440px",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
};

const errorCardStyle: CSSProperties = {
  ...statusCardStyle,
  border: "1px solid #7f1d1d",
  background: "#331717",
};

const statusTitleStyle: CSSProperties = {
  margin: "0 0 10px 0",
  color: "#e7f1eb",
  fontSize: "26px",
};

const statusTextStyle: CSSProperties = {
  margin: "0 0 18px 0",
  color: "#cfe0d6",
  lineHeight: 1.5,
};

const buttonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "10px 16px",
  borderRadius: "12px",
  border: "0",
  background: "#22c55e",
  color: "#08130c",
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
