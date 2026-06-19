"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../lib/supabase";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

type DashboardRow = {
  total_users: number | string | null;
  active_15m: number | string | null;
  active_24h: number | string | null;
  active_7d: number | string | null;
  new_24h: number | string | null;
  new_7d: number | string | null;
  new_30d: number | string | null;

  total_coins: number | string | null;
  avg_coins: number | string | null;
  total_card_points: number | string | null;

  total_subscriptions: number | string | null;
  active_subscriptions: number | string | null;
  paid_active_subscriptions: number | string | null;
  variant_free: number | string | null;
  variant_basic: number | string | null;
  variant_pro: number | string | null;
  variant_elite: number | string | null;
  variant_master: number | string | null;

  subscription_revenue_total: number | string | null;
  subscription_revenue_active: number | string | null;
  coin_revenue_total: number | string | null;
  real_money_total: number | string | null;
  real_money_today: number | string | null;
  real_money_7d: number | string | null;
  real_money_30d: number | string | null;

  coin_purchase_count: number | string | null;
  coin_purchase_count_30d: number | string | null;
  boost_purchase_count: number | string | null;
  boost_purchase_count_30d: number | string | null;
  boost_coins_spent_total: number | string | null;
  pending_pack_rewards: number | string | null;

  latest_users: JsonArray | null;
  latest_revenue_events: JsonArray | null;
  daily_revenue_chart: JsonArray | null;
};

type LatestUser = {
  id: string;
  email: string | null;
  username: string | null;
  coins: number | string | null;
  card_points: number | string | null;
  created_at: string | null;
  last_seen_at: string | null;
};

type RevenueEvent = {
  id: string;
  kind: string;
  label: string | null;
  amount_eur: number | string | null;
  user_id: string;
  email: string | null;
  username: string | null;
  created_at: string | null;
};

type ChartItem = {
  date: string;
  label: string;
  subscription_revenue: number | string | null;
  coin_revenue: number | string | null;
  real_money: number | string | null;
  subscription_count: number | string | null;
  coin_purchase_count: number | string | null;
};

const emptyDashboard: DashboardRow = {
  total_users: 0,
  active_15m: 0,
  active_24h: 0,
  active_7d: 0,
  new_24h: 0,
  new_7d: 0,
  new_30d: 0,

  total_coins: 0,
  avg_coins: 0,
  total_card_points: 0,

  total_subscriptions: 0,
  active_subscriptions: 0,
  paid_active_subscriptions: 0,
  variant_free: 0,
  variant_basic: 0,
  variant_pro: 0,
  variant_elite: 0,
  variant_master: 0,

  subscription_revenue_total: 0,
  subscription_revenue_active: 0,
  coin_revenue_total: 0,
  real_money_total: 0,
  real_money_today: 0,
  real_money_7d: 0,
  real_money_30d: 0,

  coin_purchase_count: 0,
  coin_purchase_count_30d: 0,
  boost_purchase_count: 0,
  boost_purchase_count_30d: 0,
  boost_coins_spent_total: 0,
  pending_pack_rewards: 0,

  latest_users: [],
  latest_revenue_events: [],
  daily_revenue_chart: [],
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardRow>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase.rpc("admin_dashboard_overview");

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden des Dashboards:", error);
        setDashboard(emptyDashboard);
        setLoadError(error.message || "Dashboard konnte nicht geladen werden.");
      } else {
        const rows = (data as DashboardRow[] | null) || [];
        setDashboard(rows[0] || emptyDashboard);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestUsers = useMemo(() => {
    return toObjectArray(dashboard.latest_users) as LatestUser[];
  }, [dashboard.latest_users]);

  const latestRevenueEvents = useMemo(() => {
    return toObjectArray(dashboard.latest_revenue_events) as RevenueEvent[];
  }, [dashboard.latest_revenue_events]);

  const chartData = useMemo(() => {
    return toObjectArray(dashboard.daily_revenue_chart) as ChartItem[];
  }, [dashboard.daily_revenue_chart]);

  const maxRevenue = Math.max(
    1,
    ...chartData.map((item) => toNumber(item.real_money))
  );

  const variantData = [
    { label: "Free", value: toNumber(dashboard.variant_free) },
    { label: "Basic", value: toNumber(dashboard.variant_basic) },
    { label: "Pro", value: toNumber(dashboard.variant_pro) },
    { label: "Elite", value: toNumber(dashboard.variant_elite) },
    { label: "Master", value: toNumber(dashboard.variant_master) },
  ];

  const maxVariant = Math.max(1, ...variantData.map((item) => item.value));

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Dashboard</h1>
        <p style={pageSubtitleStyle}>
          Zentrale Admin-Übersicht für Nutzer, Economy, Abos, Revenue und letzte Aktivitäten.
        </p>
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden des Dashboards</strong>
          <p style={errorTextStyle}>{loadError}</p>
          <p style={errorHintStyle}>
            Prüfe, ob die RPC <strong>admin_dashboard_overview</strong> existiert und du als Admin eingeloggt bist.
          </p>
        </div>
      )}

      <section style={heroRevenueCardStyle}>
        <div>
          <div style={heroLabelStyle}>Echtgeld heute</div>
          <div style={heroValueStyle}>{loading ? "..." : formatMoney(dashboard.real_money_today)}</div>
          <div style={heroSublineStyle}>
            {loading ? "Lade Vergleich..." : `${formatMoney(dashboard.real_money_7d)} in den letzten 7 Tagen`}
          </div>
        </div>

        <div style={heroMetaGridStyle}>
          <HeroMini title="30 Tage" value={loading ? "..." : formatMoney(dashboard.real_money_30d)} />
          <HeroMini title="Gesamt" value={loading ? "..." : formatMoney(dashboard.real_money_total)} />
        </div>
      </section>

      <SectionTitle title="Schnellzugriff" subtitle="Direkt zu den wichtigsten Adminbereichen." />
      <div style={quickGridStyle}>
        <QuickLink href="/admin/users" title="Users" text="Nutzer suchen und Details öffnen" />
        <QuickLink href="/admin/subscriptions" title="Subscriptions" text="Abos, Status und Affiliate prüfen" />
        <QuickLink href="/admin/revenue" title="Revenue" text="Umsatz-Events und Zahlungen prüfen" />
        <QuickLink href="/admin/analytics" title="Analytics" text="Aktivität und Kennzahlen ansehen" />
      </div>

      <SectionTitle title="Nutzer" subtitle="Registrierungen und Aktivität aus profiles." />
      <div style={kpiGridStyle}>
        <KpiCard title="User gesamt" value={loading ? "..." : formatNumber(dashboard.total_users)} />
        <KpiCard title="Aktiv 15 Min." value={loading ? "..." : formatNumber(dashboard.active_15m)} accent="green" />
        <KpiCard title="Aktiv 24 Std." value={loading ? "..." : formatNumber(dashboard.active_24h)} />
        <KpiCard title="Aktiv 7 Tage" value={loading ? "..." : formatNumber(dashboard.active_7d)} />
        <KpiCard title="Neue 24 Std." value={loading ? "..." : formatNumber(dashboard.new_24h)} />
        <KpiCard title="Neue 7 Tage" value={loading ? "..." : formatNumber(dashboard.new_7d)} />
        <KpiCard title="Neue 30 Tage" value={loading ? "..." : formatNumber(dashboard.new_30d)} />
      </div>

      <SectionTitle title="Economy" subtitle="Coins, Card Points, interne Ausgaben und Rewards." />
      <div style={kpiGridStyle}>
        <KpiCard title="Coins gesamt" value={loading ? "..." : formatNumber(dashboard.total_coins)} accent="orange" />
        <KpiCard title="Ø Coins/User" value={loading ? "..." : formatNumber(dashboard.avg_coins)} />
        <KpiCard title="Card Points gesamt" value={loading ? "..." : formatNumber(dashboard.total_card_points)} />
        <KpiCard title="Boost-Coins ausgegeben" value={loading ? "..." : formatNumber(dashboard.boost_coins_spent_total)} />
        <KpiCard title="Pending Pack Rewards" value={loading ? "..." : formatNumber(dashboard.pending_pack_rewards)} accent="orange" />
      </div>

      <SectionTitle title="Subscriptions" subtitle="Abo-Verteilung und aktiver Monatswert." />
      <div style={kpiGridStyle}>
        <KpiCard title="Abos gesamt" value={loading ? "..." : formatNumber(dashboard.total_subscriptions)} />
        <KpiCard title="Aktive Abos" value={loading ? "..." : formatNumber(dashboard.active_subscriptions)} accent="green" />
        <KpiCard title="Aktive bezahlt" value={loading ? "..." : formatNumber(dashboard.paid_active_subscriptions)} />
        <KpiCard title="Aktiver Abo-Monatswert" value={loading ? "..." : formatMoney(dashboard.subscription_revenue_active)} />
        <KpiCard title="Abo-Umsatz gesamt" value={loading ? "..." : formatMoney(dashboard.subscription_revenue_total)} />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Abo-Verteilung</h3>
            <p style={sectionTextStyle}>Free, Basic, Pro, Elite und Master.</p>
          </div>
        </div>

        <div style={barListStyle}>
          {variantData.map((item) => (
            <div key={item.label} style={barRowStyle}>
              <div style={barLabelStyle}>{item.label}</div>
              <div style={barTrackStyle}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(4, (item.value / maxVariant) * 100)}%`,
                    background: "linear-gradient(90deg, #22c55e, #86efac)",
                    borderRadius: "999px",
                  }}
                />
              </div>
              <div style={barValueStyle}>{formatNumber(item.value)}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle title="Revenue" subtitle="Echtgeld zählt nur aus Abos und Coin-Käufen. Boosts sind interne Coin-Ausgaben." />
      <div style={kpiGridStyle}>
        <KpiCard title="Echtgeld gesamt" value={loading ? "..." : formatMoney(dashboard.real_money_total)} accent="green" />
        <KpiCard title="Echtgeld 30 Tage" value={loading ? "..." : formatMoney(dashboard.real_money_30d)} />
        <KpiCard title="Coin-Umsatz gesamt" value={loading ? "..." : formatMoney(dashboard.coin_revenue_total)} />
        <KpiCard title="Coin-Käufe gesamt" value={loading ? "..." : formatNumber(dashboard.coin_purchase_count)} />
        <KpiCard title="Coin-Käufe 30 Tage" value={loading ? "..." : formatNumber(dashboard.coin_purchase_count_30d)} />
        <KpiCard title="Boost-Käufe 30 Tage" value={loading ? "..." : formatNumber(dashboard.boost_purchase_count_30d)} />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Revenue-Verlauf 14 Tage</h3>
            <p style={sectionTextStyle}>Abos + Coin-Käufe nach Tag.</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <p style={sectionTextStyle}>Noch keine Chartdaten vorhanden.</p>
        ) : (
          <div style={chartGridStyle}>
            {chartData.map((item) => {
              const realMoney = toNumber(item.real_money);
              return (
                <div key={item.date} style={chartItemStyle}>
                  <div style={chartBarWrapperStyle}>
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.max(4, (realMoney / maxRevenue) * 100)}%`,
                        background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
                        borderRadius: "10px 10px 0 0",
                      }}
                    />
                  </div>
                  <strong style={chartLabelStyle}>{item.label}</strong>
                  <span style={chartValueStyle}>{formatMoney(realMoney)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={twoColumnGridStyle}>
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Letzte Registrierungen</h3>
              <p style={sectionTextStyle}>Die neuesten Profile.</p>
            </div>
            <Link href="/admin/users" style={smallLinkStyle}>Alle User</Link>
          </div>

          {latestUsers.length === 0 ? (
            <p style={sectionTextStyle}>Noch keine User vorhanden.</p>
          ) : (
            <div style={listStyle}>
              {latestUsers.map((user) => (
                <Link key={user.id} href={`/admin/users/${user.id}`} style={listItemLinkStyle}>
                  <div>
                    <strong style={listTitleStyle}>{user.username || user.email || "Kein Username"}</strong>
                    <div style={listSubStyle}>{user.email || user.id}</div>
                    <div style={listSubStyle}>Registriert: {formatDate(user.created_at)}</div>
                  </div>
                  <div style={listRightStyle}>
                    <div>{formatNumber(user.coins)} Coins</div>
                    <div>{formatNumber(user.card_points)} CP</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Letzte Echtgeld-Events</h3>
              <p style={sectionTextStyle}>Abos und Coin-Käufe.</p>
            </div>
            <Link href="/admin/revenue" style={smallLinkStyle}>Revenue</Link>
          </div>

          {latestRevenueEvents.length === 0 ? (
            <p style={sectionTextStyle}>Noch keine Revenue Events vorhanden.</p>
          ) : (
            <div style={listStyle}>
              {latestRevenueEvents.map((event) => (
                <Link key={`${event.kind}-${event.id}`} href={`/admin/users/${event.user_id}`} style={listItemLinkStyle}>
                  <div>
                    <strong style={listTitleStyle}>{kindLabel(event.kind)} · {event.label || "—"}</strong>
                    <div style={listSubStyle}>{event.username || event.email || event.user_id}</div>
                    <div style={listSubStyle}>{formatDate(event.created_at)}</div>
                  </div>
                  <div style={listRightStyle}>{formatMoney(event.amount_eur)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={sectionTitleBlockStyle}>
      <h2 style={sectionMainTitleStyle}>{title}</h2>
      <p style={sectionMainSubtitleStyle}>{subtitle}</p>
    </div>
  );
}

function KpiCard({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: string;
  accent?: "default" | "green" | "orange";
}) {
  const valueStyle =
    accent === "green"
      ? connectedValueStyle
      : accent === "orange"
      ? orangeValueStyle
      : kpiValueStyle;

  return (
    <div style={kpiCardStyle}>
      <p style={kpiTitleStyle}>{title}</p>
      <h3 style={valueStyle}>{value}</h3>
    </div>
  );
}

function HeroMini({ title, value }: { title: string; value: string }) {
  return (
    <div style={heroMetaCardStyle}>
      <span style={heroMetaLabelStyle}>{title}</span>
      <strong style={heroMetaValueStyle}>{value}</strong>
    </div>
  );
}

function QuickLink({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} style={quickLinkStyle}>
      <strong style={quickTitleStyle}>{title}</strong>
      <span style={quickTextStyle}>{text}</span>
    </Link>
  );
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function toObjectArray(value: JsonArray | null | undefined) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "object" && item !== null) as JsonObject[];
}

function formatNumber(value: number | string | null | undefined) {
  return Math.round(toNumber(value)).toLocaleString("de-DE");
}

function formatMoney(value: number | string | null | undefined) {
  return toNumber(value).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("de-DE");
}

function kindLabel(kind: string) {
  if (kind === "subscription") return "Abo";
  if (kind === "coin_purchase") return "Coin-Kauf";
  return kind;
}

const pageStyle: CSSProperties = { width: "100%" };

const pageHeaderStyle: CSSProperties = { marginBottom: "20px" };

const pageTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "30px",
  color: "#e7f1eb",
};

const pageSubtitleStyle: CSSProperties = {
  marginTop: 0,
  color: "#94a39b",
  lineHeight: 1.5,
};

const errorCardStyle: CSSProperties = {
  background: "#331717",
  border: "1px solid #7f1d1d",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "20px",
  color: "#fecaca",
};

const errorTextStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fecaca" };
const errorHintStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fca5a5", lineHeight: 1.5 };

const heroRevenueCardStyle: CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
  display: "grid",
  gap: "16px",
  marginBottom: "20px",
};

const heroLabelStyle: CSSProperties = {
  fontSize: "14px",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "8px",
};

const heroValueStyle: CSSProperties = {
  fontSize: "34px",
  fontWeight: 900,
  color: "white",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const heroSublineStyle: CSSProperties = {
  marginTop: "10px",
  color: "#bbf7d0",
  fontSize: "15px",
  fontWeight: 700,
};

const heroMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
};

const heroMetaCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "14px",
};

const heroMetaLabelStyle: CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "rgba(255,255,255,0.72)",
  marginBottom: "6px",
};

const heroMetaValueStyle: CSSProperties = { color: "white", fontSize: "18px" };

const sectionTitleBlockStyle: CSSProperties = { margin: "26px 0 12px 0" };
const sectionMainTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "22px" };
const sectionMainSubtitleStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };

const quickGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginBottom: "20px",
};

const quickLinkStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "16px",
  textDecoration: "none",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const quickTitleStyle: CSSProperties = { color: "#e7f1eb", fontSize: "17px" };
const quickTextStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.45 };

const kpiGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginBottom: "20px",
};

const kpiCardStyle: CSSProperties = {
  background: "#171f1c",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: "14px", color: "#94a39b" };
const kpiValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: "24px", color: "#e7f1eb", wordBreak: "break-word" };
const connectedValueStyle: CSSProperties = { ...kpiValueStyle, color: "#86efac" };
const orangeValueStyle: CSSProperties = { ...kpiValueStyle, color: "#fdba74" };

const cardStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginTop: "20px",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };

const barListStyle: CSSProperties = { display: "grid", gap: "14px" };
const barRowStyle: CSSProperties = { display: "grid", gridTemplateColumns: "80px 1fr 70px", alignItems: "center", gap: "12px" };
const barLabelStyle: CSSProperties = { color: "#cfe0d6", fontWeight: 800 };
const barTrackStyle: CSSProperties = { height: "14px", background: "#0f1512", border: "1px solid #27312d", borderRadius: "999px", overflow: "hidden" };
const barValueStyle: CSSProperties = { color: "#e7f1eb", fontWeight: 800, textAlign: "right" };

const chartGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
  alignItems: "end",
  gap: "12px",
  minHeight: "220px",
};

const chartItemStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: 0 };
const chartBarWrapperStyle: CSSProperties = { height: "145px", width: "100%", maxWidth: "44px", display: "flex", alignItems: "flex-end", justifyContent: "center", background: "#0f1512", borderRadius: "12px", overflow: "hidden", border: "1px solid #27312d" };
const chartLabelStyle: CSSProperties = { color: "#cfe0d6", fontSize: "11px", textAlign: "center" };
const chartValueStyle: CSSProperties = { color: "#94a39b", fontSize: "11px", textAlign: "center" };

const twoColumnGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" };
const smallLinkStyle: CSSProperties = { color: "#86efac", textDecoration: "none", fontWeight: 800 };
const listStyle: CSSProperties = { display: "grid", gap: "12px" };
const listItemLinkStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "12px", background: "#101714", border: "1px solid #27312d", borderRadius: "14px", padding: "14px", textDecoration: "none" };
const listTitleStyle: CSSProperties = { display: "block", color: "#e7f1eb", marginBottom: "6px" };
const listSubStyle: CSSProperties = { color: "#94a39b", fontSize: "13px", lineHeight: 1.45, wordBreak: "break-word" };
const listRightStyle: CSSProperties = { color: "#e7f1eb", fontWeight: 800, textAlign: "right", whiteSpace: "nowrap" };
