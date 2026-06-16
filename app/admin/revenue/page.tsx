"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type RevenueEvent = {
  id: string;
  user_id: string;
  user_email: string | null;
  username: string | null;
  source_table: string;
  kind: string;
  label: string | null;
  amount_eur: number | null;
  coins: number | null;
  status: string | null;
  provider: string | null;
  created_at: string;
};

type KindFilter = "all" | "real_money" | "subscription" | "coin_purchase" | "coin_spend";
type DateFilter = "all" | "today" | "7d" | "30d" | "90d" | "month";
type SortOrder = "newest" | "oldest" | "amountHigh" | "amountLow" | "coinsHigh";

const REAL_MONEY_KINDS = ["subscription", "coin_purchase"];

export default function RevenuePage() {
  const [events, setEvents] = useState<RevenueEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let cancelled = false;

    async function loadRevenue() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase.rpc("admin_list_revenue_events");

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden der Revenue Events:", error);
        setEvents([]);
        setLoadError(error.message || "Revenue konnte nicht geladen werden.");
      } else {
        setEvents((data as RevenueEvent[]) || []);
      }

      setLoading(false);
    }

    loadRevenue();

    return () => {
      cancelled = true;
    };
  }, []);

  const providerOptions = useMemo(() => {
    const providers = events
      .map((event) => event.provider)
      .filter((provider): provider is string => !!provider && provider.trim() !== "");

    return Array.from(new Set(providers)).sort();
  }, [events]);

  const statusOptions = useMemo(() => {
    const statuses = events
      .map((event) => normalize(event.status || "unknown"))
      .filter((status) => status.trim() !== "");

    return Array.from(new Set(statuses)).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (search.trim() !== "") {
      const value = search.trim().toLowerCase();
      result = result.filter((event) => {
        const username = (event.username || "").toLowerCase();
        const email = (event.user_email || "").toLowerCase();
        const userId = event.user_id.toLowerCase();
        const label = (event.label || "").toLowerCase();
        const status = (event.status || "").toLowerCase();
        const provider = (event.provider || "").toLowerCase();

        return (
          username.includes(value) ||
          email.includes(value) ||
          userId.includes(value) ||
          label.includes(value) ||
          status.includes(value) ||
          provider.includes(value)
        );
      });
    }

    if (kindFilter === "real_money") {
      result = result.filter((event) => REAL_MONEY_KINDS.includes(event.kind));
    }

    if (kindFilter !== "all" && kindFilter !== "real_money") {
      result = result.filter((event) => event.kind === kindFilter);
    }

    if (dateFilter !== "all") {
      result = result.filter((event) => isInsideDateFilter(event.created_at, dateFilter));
    }

    if (providerFilter !== "all") {
      result = result.filter((event) => (event.provider || "") === providerFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((event) => normalize(event.status || "unknown") === statusFilter);
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return dateValue(b.created_at) - dateValue(a.created_at);
      if (sortOrder === "oldest") return dateValue(a.created_at) - dateValue(b.created_at);
      if (sortOrder === "amountHigh") return safeNumber(b.amount_eur) - safeNumber(a.amount_eur);
      if (sortOrder === "amountLow") return safeNumber(a.amount_eur) - safeNumber(b.amount_eur);
      if (sortOrder === "coinsHigh") return safeNumber(b.coins) - safeNumber(a.coins);
      return 0;
    });

    return result;
  }, [events, search, kindFilter, dateFilter, providerFilter, statusFilter, sortOrder]);

  const allStats = useMemo(() => buildStats(events), [events]);
  const filteredStats = useMemo(() => buildStats(filteredEvents), [filteredEvents]);

  const chartData = useMemo(() => {
    const buckets = new Map<string, { key: string; label: string; revenue: number; coins: number }>();

    for (const event of filteredEvents) {
      const date = new Date(event.created_at);
      const key = date.toLocaleDateString("sv-SE");
      const label = date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });

      if (!buckets.has(key)) {
        buckets.set(key, { key, label, revenue: 0, coins: 0 });
      }

      const bucket = buckets.get(key)!;

      if (REAL_MONEY_KINDS.includes(event.kind)) {
        bucket.revenue += safeNumber(event.amount_eur);
      }

      if (event.kind === "coin_spend") {
        bucket.coins += safeNumber(event.coins);
      }
    }

    return Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredEvents]);

  const maxChartRevenue = Math.max(1, ...chartData.map((bucket) => bucket.revenue));

  return (
    <div style={pageStyle}>
      <style jsx global>{`
        @media (min-width: 900px) {
          .revenue-mobile-list { display: none !important; }
          .revenue-desktop-table { display: block !important; }
        }
      `}</style>

      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Revenue</h1>
        <p style={pageSubtitleStyle}>
          Echtgeld-Umsatz aus Abos und Coin-Käufen plus interne Coin-Ausgaben.
        </p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard title="Gesamt Echtgeld" value={loading ? "..." : formatMoney(allStats.realMoney)} />
        <KpiCard title="Abo-Umsatz" value={loading ? "..." : formatMoney(allStats.subscriptionRevenue)} />
        <KpiCard title="Coin-Umsatz" value={loading ? "..." : formatMoney(allStats.coinRevenue)} />
        <KpiCard title="Heute Echtgeld" value={loading ? "..." : formatMoney(allStats.todayRealMoney)} />
        <KpiCard title="Gefiltert Echtgeld" value={loading ? "..." : formatMoney(filteredStats.realMoney)} />
        <KpiCard title="Gefilterte Events" value={loading ? "..." : String(filteredStats.events)} />
        <KpiCard title="Coin-Käufe" value={loading ? "..." : String(filteredStats.coinPurchases)} />
        <KpiCard title="Interne Coin-Ausgaben" value={loading ? "..." : formatCoins(filteredStats.coinSpend)} />
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden der Revenue-Daten</strong>
          <p style={errorTextStyle}>{loadError}</p>
          <p style={errorHintStyle}>
            Prüfe, ob die RPC <strong>admin_list_revenue_events</strong> existiert und du als Admin eingeloggt bist.
          </p>
        </div>
      )}

      <div style={filterCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Filter</h3>
          <span style={sectionCountStyle}>{loading ? "Lade..." : `${filteredEvents.length} Events`}</span>
        </div>

        <div style={filterGridStyle}>
          <Field label="Suche">
            <input
              type="text"
              placeholder="User, E-Mail, Label, Provider, Status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </Field>

          <Field label="Art">
            <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as KindFilter)} style={inputStyle}>
              <option value="all">Alle</option>
              <option value="real_money">Nur Echtgeld</option>
              <option value="subscription">Nur Abos</option>
              <option value="coin_purchase">Nur Coin-Käufe</option>
              <option value="coin_spend">Nur Coin-Ausgaben</option>
            </select>
          </Field>

          <Field label="Zeitraum">
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as DateFilter)} style={inputStyle}>
              <option value="all">Alle</option>
              <option value="today">Heute</option>
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
              <option value="90d">Letzte 90 Tage</option>
              <option value="month">Dieser Monat</option>
            </select>
          </Field>

          <Field label="Provider">
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} style={inputStyle}>
              <option value="all">Alle Provider</option>
              {providerOptions.map((provider) => <option key={provider} value={provider}>{provider}</option>)}
            </select>
          </Field>

          <Field label="Status">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
              <option value="all">Alle Status</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </Field>

          <Field label="Sortierung">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)} style={inputStyle}>
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="amountHigh">Betrag hoch zu niedrig</option>
              <option value="amountLow">Betrag niedrig zu hoch</option>
              <option value="coinsHigh">Coins hoch zu niedrig</option>
            </select>
          </Field>
        </div>
      </div>

      <div style={chartCardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Echtgeld-Verlauf</h3>
            <p style={sectionTextStyle}>Abos + Coin-Käufe. Boosts zählen nur als interne Coin-Ausgabe.</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <p style={emptyTextStyle}>Keine Chart-Daten im gewählten Zeitraum.</p>
        ) : (
          <div style={chartGridStyle}>
            {chartData.slice(-31).map((bucket) => (
              <div key={bucket.key} style={chartItemStyle}>
                <div style={chartBarWrapperStyle}>
                  <div style={{
                    width: "100%",
                    height: `${Math.max(4, (bucket.revenue / maxChartRevenue) * 100)}%`,
                    background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
                    borderRadius: "10px 10px 0 0",
                  }} />
                </div>
                <strong style={chartLabelStyle}>{bucket.label}</strong>
                <span style={chartValueStyle}>{formatMoney(bucket.revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={tableCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Revenue Events</h3>
          <span style={sectionCountStyle}>{loading ? "Lade..." : `${filteredEvents.length} Events`}</span>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Lade Revenue-Daten...</p>
        ) : filteredEvents.length === 0 ? (
          <p style={emptyTextStyle}>Keine Revenue Events gefunden.</p>
        ) : (
          <>
            <div className="revenue-mobile-list" style={mobileListStyle}>
              {filteredEvents.map((event) => (
                <div key={`${event.source_table}-${event.id}`} style={mobileCardStyle}>
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>{kindLabel(event.kind)}</div>
                      <div style={mobileValueStrongStyle}>{event.label || "—"}</div>
                      <div style={mobileEmailStyle}>{event.username || event.user_email || event.user_id}</div>
                    </div>
                    <span style={getKindBadgeStyle(event.kind)}>{kindLabel(event.kind)}</span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="Echtgeld" value={formatMoney(safeNumber(event.amount_eur))} />
                    <InfoItem label="Coins" value={formatCoins(safeNumber(event.coins))} />
                    <InfoItem label="Provider" value={event.provider || "—"} />
                    <InfoItem label="Status" value={event.status || "—"} />
                    <InfoItem label="Datum" value={formatDate(event.created_at)} />
                    <InfoItem label="Quelle" value={event.source_table} />
                  </div>

                  <div style={mobileButtonRowStyle}>
                    <Link href={`/admin/users/${event.user_id}`} style={detailsButtonStyle}>User Details</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="revenue-desktop-table" style={desktopTableWrapperStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1250px" }}>
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>Datum</th>
                    <th style={tableHeaderStyle}>Art</th>
                    <th style={tableHeaderStyle}>Label</th>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>E-Mail</th>
                    <th style={tableHeaderStyle}>Echtgeld</th>
                    <th style={tableHeaderStyle}>Coins</th>
                    <th style={tableHeaderStyle}>Provider</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Quelle</th>
                    <th style={tableHeaderStyle}>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={`${event.source_table}-${event.id}`} style={{ borderTop: "1px solid #27312d" }}>
                      <td style={tableCellStyle}>{formatDate(event.created_at)}</td>
                      <td style={tableCellStyle}><span style={getKindBadgeStyle(event.kind)}>{kindLabel(event.kind)}</span></td>
                      <td style={tableCellStyle}>{event.label || "—"}</td>
                      <td style={tableCellStyle}>{event.username || "—"}</td>
                      <td style={tableCellStyle}>{event.user_email || "—"}</td>
                      <td style={tableCellStyle}>{formatMoney(safeNumber(event.amount_eur))}</td>
                      <td style={tableCellStyle}>{formatCoins(safeNumber(event.coins))}</td>
                      <td style={tableCellStyle}>{event.provider || "—"}</td>
                      <td style={tableCellStyle}>{event.status || "—"}</td>
                      <td style={tableCellMutedStyle}>{event.source_table}</td>
                      <td style={tableCellStyle}><Link href={`/admin/users/${event.user_id}`} style={tableButtonStyle}>Details</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function buildStats(events: RevenueEvent[]) {
  const todayKey = new Date().toLocaleDateString("sv-SE");
  let subscriptionRevenue = 0;
  let coinRevenue = 0;
  let todayRealMoney = 0;
  let coinSpend = 0;
  let coinPurchases = 0;

  for (const event of events) {
    const amount = safeNumber(event.amount_eur);
    const eventDateKey = new Date(event.created_at).toLocaleDateString("sv-SE");

    if (event.kind === "subscription") subscriptionRevenue += amount;
    if (event.kind === "coin_purchase") {
      coinRevenue += amount;
      coinPurchases += 1;
    }
    if (event.kind === "coin_spend") coinSpend += safeNumber(event.coins);
    if (REAL_MONEY_KINDS.includes(event.kind) && eventDateKey === todayKey) todayRealMoney += amount;
  }

  return {
    events: events.length,
    subscriptionRevenue,
    coinRevenue,
    realMoney: subscriptionRevenue + coinRevenue,
    todayRealMoney,
    coinSpend,
    coinPurchases,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={kpiCardStyle}>
      <p style={kpiTitleStyle}>{title}</p>
      <h3 style={kpiValueStyle}>{value}</h3>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoItemStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  );
}

function normalize(value: string) { return value.toLowerCase().trim(); }
function safeNumber(value: number | null | undefined) { return typeof value === "number" && !Number.isNaN(value) ? value : 0; }
function dateValue(value: string | null | undefined) { if (!value) return 0; const t = new Date(value).getTime(); return Number.isNaN(t) ? 0 : t; }
function formatDate(dateString: string | null) { if (!dateString) return "—"; return new Date(dateString).toLocaleString("de-DE"); }
function formatMoney(value: number) { return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" }); }
function formatCoins(value: number) { return value.toLocaleString("de-DE"); }

function isInsideDateFilter(dateString: string, filter: DateFilter) {
  const date = new Date(dateString);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return false;
  if (filter === "today") return date.toLocaleDateString("sv-SE") === now.toLocaleDateString("sv-SE");
  if (filter === "month") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  const diffMs = now.getTime() - date.getTime();
  if (filter === "7d") return diffMs <= 7 * 24 * 60 * 60 * 1000;
  if (filter === "30d") return diffMs <= 30 * 24 * 60 * 60 * 1000;
  if (filter === "90d") return diffMs <= 90 * 24 * 60 * 60 * 1000;
  return true;
}

function kindLabel(kind: string) {
  if (kind === "subscription") return "Abo";
  if (kind === "coin_purchase") return "Coin-Kauf";
  if (kind === "coin_spend") return "Coin-Ausgabe";
  return kind;
}

function getKindBadgeStyle(kind: string): CSSProperties {
  if (kind === "subscription") return subscriptionBadgeStyle;
  if (kind === "coin_purchase") return coinPurchaseBadgeStyle;
  if (kind === "coin_spend") return coinSpendBadgeStyle;
  return unknownBadgeStyle;
}

const pageStyle: CSSProperties = { width: "100%" };
const pageHeaderStyle: CSSProperties = { marginBottom: "20px" };
const pageTitleStyle: CSSProperties = { marginTop: 0, marginBottom: "8px", fontSize: "30px", color: "#e7f1eb" };
const pageSubtitleStyle: CSSProperties = { marginTop: 0, color: "#94a39b", lineHeight: 1.5 };
const kpiGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" };
const kpiCardStyle: CSSProperties = { background: "#171f1c", padding: "16px", borderRadius: "16px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: "13px", color: "#94a39b" };
const kpiValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: "22px", color: "#e7f1eb", wordBreak: "break-word" };
const errorCardStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", borderRadius: "16px", padding: "16px", marginBottom: "20px", color: "#fecaca" };
const errorTextStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fecaca" };
const errorHintStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fca5a5", lineHeight: 1.5 };
const filterCardStyle: CSSProperties = { background: "#171f1c", borderRadius: "16px", padding: "18px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: "20px" };
const chartCardStyle: CSSProperties = { ...filterCardStyle };
const tableCardStyle: CSSProperties = { ...filterCardStyle, marginBottom: 0 };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const sectionCountStyle: CSSProperties = { color: "#94a39b", fontSize: "14px" };
const filterGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" };
const labelStyle: CSSProperties = { display: "block", marginBottom: "8px", fontWeight: 700, color: "#cfe0d6" };
const inputStyle: CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", boxSizing: "border-box", minHeight: "46px" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", margin: 0 };
const chartGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", alignItems: "end", gap: "12px", minHeight: "230px" };
const chartItemStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: 0 };
const chartBarWrapperStyle: CSSProperties = { height: "150px", width: "100%", maxWidth: "46px", display: "flex", alignItems: "flex-end", justifyContent: "center", background: "#0f1512", borderRadius: "12px", overflow: "hidden", border: "1px solid #27312d" };
const chartLabelStyle: CSSProperties = { color: "#cfe0d6", fontSize: "11px", textAlign: "center" };
const chartValueStyle: CSSProperties = { color: "#94a39b", fontSize: "11px", textAlign: "center" };
const mobileListStyle: CSSProperties = { display: "grid", gap: "14px" };
const mobileCardStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "16px", padding: "16px" };
const mobileCardTopStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" };
const mobileLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "4px" };
const mobileValueStrongStyle: CSSProperties = { fontSize: "18px", fontWeight: 700, color: "#e7f1eb", wordBreak: "break-word" };
const mobileEmailStyle: CSSProperties = { marginTop: "4px", fontSize: "12px", color: "#94a39b", wordBreak: "break-word" };
const mobileInfoGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" };
const mobileButtonRowStyle: CSSProperties = { display: "flex", justifyContent: "flex-end", marginTop: "14px" };
const infoItemStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "12px", padding: "12px" };
const infoLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "6px" };
const infoValueStyle: CSSProperties = { fontSize: "14px", color: "#e7f1eb", wordBreak: "break-word" };
const desktopTableWrapperStyle: CSSProperties = { overflowX: "auto", marginTop: "18px", display: "none" };
const tableHeaderStyle: CSSProperties = { padding: "12px", fontSize: "14px", fontWeight: 700, color: "#cfe0d6", borderBottom: "1px solid #27312d", whiteSpace: "nowrap" };
const tableCellStyle: CSSProperties = { padding: "12px", fontSize: "14px", color: "#e7f1eb", verticalAlign: "top", whiteSpace: "nowrap" };
const tableCellMutedStyle: CSSProperties = { ...tableCellStyle, color: "#94a39b" };
const tableButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "40px", padding: "8px 12px", borderRadius: "10px", background: "#22c55e", color: "#08130c", fontWeight: 700, textDecoration: "none" };
const detailsButtonStyle: CSSProperties = { ...tableButtonStyle, minHeight: "38px" };
const subscriptionBadgeStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", borderRadius: "999px", background: "#172554", color: "#93c5fd", fontSize: "12px", fontWeight: 800, whiteSpace: "nowrap" };
const coinPurchaseBadgeStyle: CSSProperties = { ...subscriptionBadgeStyle, background: "#163322", color: "#86efac" };
const coinSpendBadgeStyle: CSSProperties = { ...subscriptionBadgeStyle, background: "#292524", color: "#fdba74" };
const unknownBadgeStyle: CSSProperties = { ...subscriptionBadgeStyle, background: "#1f2937", color: "#d1d5db" };
