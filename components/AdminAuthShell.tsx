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

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let cancelled = false;

    async function checkAdminSession() {
      if (isLoginPage) {
        setAuthState("allowed");
        return;
      }

      setAuthState("checking");
      setMessage("Admin-Session wird geprüft...");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (cancelled) return;

      if (sessionError) {
        console.error("Supabase Session Fehler:", sessionError);
        setAuthState("blocked");
        setMessage("Session konnte nicht geprüft werden.");
        router.replace("/admin/login");
        return;
      }

      const session = sessionData.session;

      if (!session) {
        setAuthState("blocked");
        setMessage("Nicht eingeloggt. Weiterleitung zum Admin-Login...");
        const redirect = encodeURIComponent(pathname || "/admin/users");
        router.replace(`/admin/login?redirect=${redirect}`);
        return;
      }

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

        setAuthState("blocked");
        setMessage("Dieser Account hat keine Adminrechte.");
        router.replace("/admin/login?error=not_admin");
        return;
      }

      setAuthState("allowed");
    }

    checkAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (isLoginPage) return;

      if (event === "SIGNED_OUT") {
        const redirect = encodeURIComponent(pathname || "/admin/users");
        router.replace(`/admin/login?redirect=${redirect}`);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [isLoginPage, pathname, router]);

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
            onClick={() => router.replace("/admin/login")}
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
