
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

type JsonMap = Record<string, unknown>;
type UserDetail = {
  profile?: JsonMap | null;
  subscription?: JsonMap | null;
  inventory_count?: number | string | null;
  coin_purchase_count?: number | string | null;
  boost_purchase_count?: number | string | null;
  pending_pack_rewards?: number | string | null;
};
type CoinMode = "set" | "add" | "subtract";
type SubscriptionVariant = "free" | "basic" | "pro" | "elite" | "master";
type SubscriptionStatus = "active" | "trialing" | "cancelled" | "expired";

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = String(params?.id || "");

  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [inventory, setInventory] = useState<JsonMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [coinMode, setCoinMode] = useState<CoinMode>("add");
  const [coinAmount, setCoinAmount] = useState("0");
  const [savingCoins, setSavingCoins] = useState(false);

  const [subscriptionVariant, setSubscriptionVariant] = useState<SubscriptionVariant>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("active");
  const [subscriptionMonths, setSubscriptionMonths] = useState("1");
  const [subscriptionProvider, setSubscriptionProvider] = useState("admin");
  const [savingSubscription, setSavingSubscription] = useState(false);
  const [cardSearch, setCardSearch] = useState("");

  async function loadDetail() {
    if (!userId) return;
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_get_user_detail", { p_user_id: userId });

    if (error) {
      setDetail(null);
      setErrorMessage(error.message || "User Details konnten nicht geladen werden.");
      setLoading(false);
      return;
    }

    const loaded = (data || {}) as UserDetail;
    setDetail(loaded);

    const sub = loaded.subscription || null;
    if (sub) {
      setSubscriptionVariant(normalizeVariant(readString(sub, "variant")));
      setSubscriptionStatus(normalizeStatus(readString(sub, "status")));
      setSubscriptionProvider(readString(sub, "provider") || "admin");
    }

    setLoading(false);
  }

  async function loadInventory() {
    if (!userId) return;
    setInventoryLoading(true);

    const { data, error } = await supabase.rpc("admin_get_user_inventory", { p_user_id: userId });

    if (error) {
      setInventory([]);
      setErrorMessage(error.message || "Inventar konnte nicht geladen werden.");
      setInventoryLoading(false);
      return;
    }

    setInventory(Array.isArray(data) ? (data as JsonMap[]) : []);
    setInventoryLoading(false);
  }

  useEffect(() => {
    loadDetail();
    loadInventory();
  }, [userId]);

  const profile = detail?.profile || {};
  const subscription = detail?.subscription || null;

  const filteredInventory = useMemo(() => {
    const search = cardSearch.trim().toLowerCase();
    if (!search) return inventory;
    return inventory.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  }, [inventory, cardSearch]);

  async function handleCoinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number.parseInt(coinAmount, 10);
    if (Number.isNaN(amount) || amount < 0) {
      setErrorMessage("Bitte eine gültige Coin-Zahl eingeben.");
      return;
    }

    setSavingCoins(true);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_adjust_user_coins", {
      p_user_id: userId,
      p_mode: coinMode,
      p_amount: amount,
    });

    if (error) {
      setErrorMessage(error.message || "Coins konnten nicht geändert werden.");
      setSavingCoins(false);
      return;
    }

    setMessage(`Coins geändert: ${readNumber(data as JsonMap, "old_coins")} → ${readNumber(data as JsonMap, "new_coins")}`);
    setSavingCoins(false);
    await loadDetail();
  }

  async function handleSubscriptionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const months = Number.parseInt(subscriptionMonths, 10);
    if (Number.isNaN(months) || months < 0) {
      setErrorMessage("Bitte eine gültige Monatszahl eingeben.");
      return;
    }

    setSavingSubscription(true);
    setMessage(null);
    setErrorMessage(null);

    const { error } = await supabase.rpc("admin_update_user_subscription", {
      p_user_id: userId,
      p_variant: subscriptionVariant,
      p_status: subscriptionStatus,
      p_months: months,
      p_provider: subscriptionProvider || "admin",
    });

    if (error) {
      setErrorMessage(error.message || "Abo konnte nicht geändert werden.");
      setSavingSubscription(false);
      return;
    }

    setMessage("Abo wurde aktualisiert.");
    setSavingSubscription(false);
    await loadDetail();
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <div>
          <Link href="/admin/users" style={backLinkStyle}>← Zurück zu Users</Link>
          <h1 style={pageTitleStyle}>User Details</h1>
          <p style={pageSubtitleStyle}>Coins, Abo und Karten des Users verwalten.</p>
        </div>
        <button type="button" onClick={() => { loadDetail(); loadInventory(); }} style={secondaryButtonStyle}>Neu laden</button>
      </div>

      {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
      {message && <div style={successBoxStyle}>{message}</div>}

      <div style={kpiGridStyle}>
        <KpiCard title="Username" value={loading ? "..." : readString(profile, "username") || "—"} />
        <KpiCard title="E-Mail" value={loading ? "..." : readString(profile, "email") || "—"} />
        <KpiCard title="Coins" value={loading ? "..." : formatNumber(readNumber(profile, "coins"))} accent="green" />
        <KpiCard title="Card Points" value={loading ? "..." : formatNumber(readNumber(profile, "card_points"))} />
        <KpiCard title="Karten" value={loading ? "..." : formatNumber(detail?.inventory_count)} />
        <KpiCard title="Pending Rewards" value={loading ? "..." : formatNumber(detail?.pending_pack_rewards)} accent="orange" />
      </div>

      <div style={gridTwoStyle}>
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Profil</h2>
          <InfoGrid items={[
            ["User ID", userId],
            ["Username", readString(profile, "username") || "—"],
            ["E-Mail", readString(profile, "email") || "—"],
            ["Coins", formatNumber(readNumber(profile, "coins"))],
            ["Card Points", formatNumber(readNumber(profile, "card_points"))],
            ["Admin", readBoolean(profile, "is_admin") ? "Ja" : "Nein"],
            ["Erstellt", formatDate(readString(profile, "created_at"))],
            ["Last Seen", formatDate(readString(profile, "last_seen_at"))],
          ]} />
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Coins bearbeiten</h2>
          <form onSubmit={handleCoinSubmit} style={formStyle}>
            <label style={labelStyle}>Aktion</label>
            <select value={coinMode} onChange={(e) => setCoinMode(e.target.value as CoinMode)} style={inputStyle}>
              <option value="add">Coins hinzufügen</option>
              <option value="subtract">Coins abziehen</option>
              <option value="set">Coins exakt setzen</option>
            </select>
            <label style={labelStyle}>Betrag</label>
            <input type="number" min="0" step="1" value={coinAmount} onChange={(e) => setCoinAmount(e.target.value)} style={inputStyle} />
            <button type="submit" disabled={savingCoins} style={primaryButtonStyle}>{savingCoins ? "Speichere..." : "Coins speichern"}</button>
          </form>
          <p style={hintStyle}>Abziehen geht nie unter 0. Setzen ersetzt den aktuellen Coin-Wert.</p>
        </section>
      </div>

      <div style={gridTwoStyle}>
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Aktuelles Abo</h2>
          {subscription ? (
            <InfoGrid items={[
              ["Variante", labelVariant(readString(subscription, "variant"))],
              ["Status", readString(subscription, "status") || "—"],
              ["Preis", formatMoney(readNumber(subscription, "price_eur"))],
              ["Provider", readString(subscription, "provider") || "—"],
              ["Affiliate", readBoolean(subscription, "is_affiliate") ? "Ja" : "Nein"],
              ["Started", formatDate(readString(subscription, "started_at"))],
              ["Expires", formatDate(readString(subscription, "expires_at"))],
            ]} />
          ) : <p style={emptyTextStyle}>Noch kein Abo vorhanden.</p>}
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Abo hoch-/runtersetzen</h2>
          <form onSubmit={handleSubscriptionSubmit} style={formStyle}>
            <label style={labelStyle}>Variante</label>
            <select value={subscriptionVariant} onChange={(e) => setSubscriptionVariant(e.target.value as SubscriptionVariant)} style={inputStyle}>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="elite">Elite</option>
              <option value="master">Master</option>
            </select>
            <label style={labelStyle}>Status</label>
            <select value={subscriptionStatus} onChange={(e) => setSubscriptionStatus(e.target.value as SubscriptionStatus)} style={inputStyle}>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
            <label style={labelStyle}>Laufzeit in Monaten</label>
            <input type="number" min="0" step="1" value={subscriptionMonths} onChange={(e) => setSubscriptionMonths(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Provider</label>
            <input type="text" value={subscriptionProvider} onChange={(e) => setSubscriptionProvider(e.target.value)} style={inputStyle} />
            <button type="submit" disabled={savingSubscription} style={primaryButtonStyle}>{savingSubscription ? "Speichere..." : "Abo speichern"}</button>
          </form>
          <p style={hintStyle}>Free = 0 €. Basic 1,99 €, Pro 2,99 €, Elite 4,99 €, Master 7,99 €.</p>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Karten / Inventory</h2>
            <p style={sectionTextStyle}>Aktuell Anzeige. Karte hinzufügen/entfernen bauen wir danach separat.</p>
          </div>
          <span style={sectionCountStyle}>{inventoryLoading ? "Lade..." : `${filteredInventory.length} Karten`}</span>
        </div>
        <input type="text" placeholder="Karte suchen..." value={cardSearch} onChange={(e) => setCardSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
        {inventoryLoading ? <p style={emptyTextStyle}>Inventar wird geladen...</p> : filteredInventory.length === 0 ? <p style={emptyTextStyle}>Keine Karten gefunden.</p> : (
          <div style={cardGridStyle}>{filteredInventory.map((card, index) => (
            <div key={readString(card, "id") || `${index}`} style={inventoryCardStyle}>
              <div style={cardTopRowStyle}>
                <strong style={cardNameStyle}>{cardTitle(card)}</strong>
                <span style={rarityBadgeStyle}>{cardRarity(card)}</span>
              </div>
              <InfoGrid compact items={[
                ["ID", readString(card, "id") || "—"],
                ["Card ID", readString(card, "card_id") || readString(card, "card_key") || "—"],
                ["Status", readString(card, "status") || "—"],
                ["Quantity", String(readNumber(card, "quantity") || readNumber(card, "count") || 1)],
                ["Set", readString(card, "set_id") || readString(card, "set") || "—"],
                ["Created", formatDate(readString(card, "created_at"))],
              ]} />
            </div>
          ))}</div>
        )}
      </section>
    </div>
  );
}

function KpiCard({ title, value, accent = "default" }: { title: string; value: string; accent?: "default" | "green" | "orange" }) {
  return <div style={kpiCardStyle}><p style={kpiTitleStyle}>{title}</p><h3 style={accent === "green" ? greenValueStyle : accent === "orange" ? orangeValueStyle : kpiValueStyle}>{value}</h3></div>;
}

function InfoGrid({ items, compact = false }: { items: [string, string][]; compact?: boolean }) {
  return <div style={compact ? infoGridCompactStyle : infoGridStyle}>{items.map(([label, value]) => <div key={`${label}-${value}`} style={infoItemStyle}><div style={infoLabelStyle}>{label}</div><div style={infoValueStyle}>{value}</div></div>)}</div>;
}
function readString(source: JsonMap | null | undefined, key: string) { const v = source?.[key]; return v === null || v === undefined ? "" : String(v); }
function readNumber(sourceOrValue: JsonMap | unknown, key?: string) { const v = key && sourceOrValue && typeof sourceOrValue === "object" ? (sourceOrValue as JsonMap)[key] : sourceOrValue; if (typeof v === "number") return Number.isNaN(v) ? 0 : v; if (typeof v === "string") { const n = Number(v); return Number.isNaN(n) ? 0 : n; } return 0; }
function readBoolean(source: JsonMap | null | undefined, key: string) { return source?.[key] === true; }
function formatNumber(value: unknown) { return Math.round(readNumber(value)).toLocaleString("de-DE"); }
function formatMoney(value: unknown) { return readNumber(value).toLocaleString("de-DE", { style: "currency", currency: "EUR" }); }
function formatDate(value?: string | null) { if (!value) return "—"; const d = new Date(value); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("de-DE"); }
function normalizeVariant(value: string): SubscriptionVariant { const v = value.toLowerCase().trim(); if (v === "basic" || v === "pro" || v === "elite" || v === "master") return v; return "free"; }
function normalizeStatus(value: string): SubscriptionStatus { const v = value.toLowerCase().trim(); if (v === "trialing" || v === "cancelled" || v === "expired") return v; return "active"; }
function labelVariant(value: string) { const v = normalizeVariant(value); return v.charAt(0).toUpperCase() + v.slice(1); }
function cardTitle(card: JsonMap) { return readString(card, "card_name") || readString(card, "name") || readString(card, "title") || readString(card, "card_id") || "Unbekannte Karte"; }
function cardRarity(card: JsonMap) { return readString(card, "rarity") || readString(card, "rarity_id") || readString(card, "tier") || "—"; }

const pageStyle: CSSProperties = { width: "100%" };
const pageHeaderStyle: CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 20 };
const backLinkStyle: CSSProperties = { display: "inline-flex", marginBottom: 10, color: "#86efac", textDecoration: "none", fontWeight: 800 };
const pageTitleStyle: CSSProperties = { marginTop: 0, marginBottom: 8, fontSize: 30, color: "#e7f1eb" };
const pageSubtitleStyle: CSSProperties = { marginTop: 0, color: "#94a39b", lineHeight: 1.5 };
const secondaryButtonStyle: CSSProperties = { minHeight: 42, padding: "9px 14px", borderRadius: 12, border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", fontWeight: 800, cursor: "pointer" };
const errorBoxStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", color: "#fecaca", borderRadius: 14, padding: "12px 14px", marginBottom: 16, lineHeight: 1.5 };
const successBoxStyle: CSSProperties = { background: "#163322", border: "1px solid #166534", color: "#bbf7d0", borderRadius: 14, padding: "12px 14px", marginBottom: 16, lineHeight: 1.5 };
const kpiGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 20 };
const kpiCardStyle: CSSProperties = { background: "#171f1c", padding: 16, borderRadius: 16, border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: 13, color: "#94a39b" };
const kpiValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: 22, color: "#e7f1eb", wordBreak: "break-word" };
const greenValueStyle: CSSProperties = { ...kpiValueStyle, color: "#86efac" };
const orangeValueStyle: CSSProperties = { ...kpiValueStyle, color: "#fdba74" };
const gridTwoStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 18 };
const cardStyle: CSSProperties = { background: "#171f1c", borderRadius: 16, padding: 18, border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: 18 };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 };
const sectionTitleStyle: CSSProperties = { margin: "0 0 16px 0", color: "#e7f1eb", fontSize: 20 };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const sectionCountStyle: CSSProperties = { color: "#94a39b", fontSize: 14 };
const formStyle: CSSProperties = { display: "grid", gap: 12 };
const labelStyle: CSSProperties = { display: "block", color: "#cfe0d6", fontWeight: 800 };
const inputStyle: CSSProperties = { width: "100%", minHeight: 46, borderRadius: 12, border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", padding: "11px 13px", boxSizing: "border-box", outline: "none" };
const primaryButtonStyle: CSSProperties = { minHeight: 46, border: 0, borderRadius: 12, background: "#22c55e", color: "#08130c", fontWeight: 900, cursor: "pointer" };
const hintStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5, margin: "14px 0 0 0" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5 };
const infoGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 };
const infoGridCompactStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 };
const infoItemStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: 12, padding: 12 };
const infoLabelStyle: CSSProperties = { fontSize: 12, color: "#94a39b", marginBottom: 6 };
const infoValueStyle: CSSProperties = { fontSize: 14, color: "#e7f1eb", wordBreak: "break-word" };
const cardGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 };
const inventoryCardStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: 16, padding: 14 };
const cardTopRowStyle: CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 };
const cardNameStyle: CSSProperties = { color: "#e7f1eb", fontSize: 16, wordBreak: "break-word" };
const rarityBadgeStyle: CSSProperties = { display: "inline-flex", padding: "6px 9px", borderRadius: 999, background: "#172554", color: "#93c5fd", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" };
