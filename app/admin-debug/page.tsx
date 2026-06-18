"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type DebugState = {
  sessionExists: string;
  email: string;
  userId: string;
  isAdmin: string;
  lastError: string;
};

const initialState: DebugState = {
  sessionExists: "unbekannt",
  email: "—",
  userId: "—",
  isAdmin: "unbekannt",
  lastError: "—",
};

export default function AdminDebugPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<DebugState>(initialState);
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function addLog(text: string) {
    setLog((old) => [`${new Date().toLocaleTimeString("de-DE")} - ${text}`, ...old]);
  }

  async function checkSession() {
    setLoading(true);
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      setState((old) => ({ ...old, sessionExists: "nein", lastError: sessionError.message }));
      addLog(`Session Fehler: ${sessionError.message}`);
      setLoading(false);
      return;
    }

    const session = sessionData.session;
    if (!session) {
      setState({
        sessionExists: "nein",
        email: "—",
        userId: "—",
        isAdmin: "nicht geprüft",
        lastError: "Keine Session vorhanden",
      });
      addLog("Keine Session vorhanden");
      setLoading(false);
      return;
    }

    const { data: adminData, error: adminError } = await supabase.rpc("is_admin_user");
    setState({
      sessionExists: "ja",
      email: session.user.email || "—",
      userId: session.user.id,
      isAdmin: adminError ? "Fehler" : adminData === true ? "true" : "false",
      lastError: adminError ? adminError.message : "—",
    });
    addLog(adminError ? `Session ja, Admin Fehler: ${adminError.message}` : `Session ja, is_admin_user = ${adminData === true ? "true" : "false"}`);
    setLoading(false);
  }

  useEffect(() => {
    checkSession();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    addLog("Login gestartet");

    const clean = identifier.trim().toLowerCase();
    const { data: resolvedEmail, error: resolveError } = await supabase.rpc("admin_resolve_login_identifier", { p_identifier: clean });

    if (resolveError) {
      addLog(`Resolve Fehler: ${resolveError.message}`);
      setState((old) => ({ ...old, lastError: resolveError.message }));
      setLoading(false);
      return;
    }

    if (!resolvedEmail || typeof resolvedEmail !== "string") {
      addLog("Kein Adminaccount gefunden");
      setState((old) => ({ ...old, lastError: "Kein Adminaccount gefunden" }));
      setLoading(false);
      return;
    }

    addLog(`Login E-Mail aufgelöst: ${resolvedEmail}`);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });

    if (loginError) {
      addLog(`Login Fehler: ${loginError.message}`);
      setState((old) => ({ ...old, lastError: loginError.message }));
      setLoading(false);
      return;
    }

    addLog("Login erfolgreich laut Supabase");
    await checkSession();
  }

  async function logout() {
    await supabase.auth.signOut();
    addLog("SignOut ausgeführt");
    await checkSession();
  }

  function clearBrowserStorage() {
    localStorage.clear();
    sessionStorage.clear();
    addLog("LocalStorage und SessionStorage gelöscht");
    window.location.reload();
  }

  return (
    <main style={page}>
      <section style={card}>
        <h1 style={title}>Cardletics Admin Debug</h1>
        <p style={text}>Diese Seite liegt außerhalb von /admin, damit wir die Supabase-Session prüfen können.</p>

        <div style={grid}>
          <Box label="Session vorhanden" value={state.sessionExists} />
          <Box label="E-Mail" value={state.email} />
          <Box label="User ID" value={state.userId} />
          <Box label="is_admin_user()" value={state.isAdmin} />
        </div>

        <div style={errorBox}><strong>Letzter Fehler:</strong><div>{state.lastError}</div></div>

        <form onSubmit={handleLogin} style={form}>
          <input style={input} placeholder="Username oder E-Mail" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoCapitalize="none" autoCorrect="off" />
          <input style={input} placeholder="Passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button style={button} disabled={loading} type="submit">{loading ? "Prüfe..." : "Debug Login testen"}</button>
        </form>

        <div style={actions}>
          <button style={secondaryButton} onClick={checkSession} disabled={loading}>Session neu prüfen</button>
          <button style={secondaryButton} onClick={logout}>Logout</button>
          <button style={dangerButton} onClick={clearBrowserStorage}>Browserdaten dieser Seite löschen</button>
          <a style={linkButton} href="/admin/users">/admin/users öffnen</a>
        </div>

        <h2 style={subTitle}>Log</h2>
        <pre style={logBox}>{log.join("\n") || "Noch kein Log"}</pre>
      </section>
    </main>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return <div style={box}><div style={boxLabel}>{label}</div><div style={boxValue}>{value}</div></div>;
}

const page = { minHeight: "100vh", background: "#07100c", color: "#e7f1eb", padding: 24, fontFamily: "Arial, sans-serif" };
const card = { maxWidth: 980, margin: "0 auto", background: "#171f1c", border: "1px solid #27312d", borderRadius: 18, padding: 22 };
const title = { margin: "0 0 8px", fontSize: 30 };
const subTitle = { marginTop: 22, fontSize: 20 };
const text = { color: "#94a39b", lineHeight: 1.5 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginTop: 18 };
const box = { background: "#101714", border: "1px solid #27312d", borderRadius: 14, padding: 14 };
const boxLabel = { color: "#94a39b", fontSize: 13, marginBottom: 8 };
const boxValue = { color: "#e7f1eb", fontSize: 18, fontWeight: 800, wordBreak: "break-word" as const };
const errorBox = { marginTop: 14, background: "#261a1a", border: "1px solid #633", borderRadius: 14, padding: 14, color: "#fecaca" };
const form = { display: "grid", gap: 12, marginTop: 18 };
const input = { minHeight: 46, borderRadius: 12, border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", padding: "10px 12px" };
const button = { minHeight: 48, border: 0, borderRadius: 12, background: "#22c55e", color: "#08130c", fontWeight: 900, cursor: "pointer" };
const actions = { display: "flex", gap: 10, flexWrap: "wrap" as const, marginTop: 16 };
const secondaryButton = { minHeight: 42, borderRadius: 12, border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", padding: "9px 12px", cursor: "pointer" };
const dangerButton = { ...secondaryButton, border: "1px solid #7f1d1d", background: "#331717", color: "#fecaca" };
const linkButton = { ...secondaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center" };
const logBox = { background: "#0b0f0d", border: "1px solid #27312d", borderRadius: 14, padding: 14, minHeight: 120, whiteSpace: "pre-wrap" as const, color: "#cfe0d6" };
