"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  username: string | null;
  card_points: number | null;
  created_at: string;
};

type Subscription = {
  id: string;
  user_id: string;
  variant: "Free" | "Basic" | "Pro" | "Elite" | "Master";
  status: "active" | "expired" | "cancelled" | "trialing";
  started_at: string;
  expires_at: string | null;
  provider: string | null;
  is_affiliate: boolean;
  price_eur: number | null;
  created_at: string;
};

type CoinPurchase = {
  id: string;
  user_id: string;
  coins_amount: number;
  price_eur: number;
  provider: string | null;
  created_at: string;
};

type BoostPackPurchase = {
  id: string;
  user_id: string;
  pack_name: string;
  quantity: number;
  coin_cost: number;
  total_coin_cost: number;
  created_at: string;
};

type ChartRange = "day" | "week" | "month";

type RevenueBucket = {
  label: string;
  subscriptionRevenue: number;
  coinRevenue: number;
  realMoneyRevenue: number;
  newSubscriptions: number;
  coinPurchases: number;
  boostPurchases: number;
  boostCoinsSpent: number;
};

const SUBSCRIPTION_VARIANTS = ["Free", "Basic", "Pro", "Elite", "Master"];
const ACTIVE_STATUSES = ["active", "trialing"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [coinPurchases, setCoinPurchases] = useState<CoinPurchase[]>([]);
  const [boostPackPurchases, setBoostPackPurchases] = useState<BoostPackPurchase[]>([]);

  const [variantFilter, setVariantFilter] = useState("all");
  const [affiliateFilter, setAffiliateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [chartRange, setChartRange] = useState<ChartRange>("day");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const profilesResponse = await supabase
        .from("profiles")
        .select("id, username, card_points, created_at")
        .limit(1000);

      if (profilesResponse.error) {
        console.error("Fehler beim Laden von profiles:", profilesResponse.error);
      } else {
        setProfiles((profilesResponse.data as Profile[]) || []);
      }

      const subscriptionsResponse = await supabase
        .from("subscriptions")
        .select("*")
        .limit(1000);

      if (subscriptionsResponse.error) {
        console.error("Fehler beim Laden von subscriptions:", subscriptionsResponse.error);
      } else {
        setSubscriptions((subscriptionsResponse.data as Subscription[]) || []);
      }

      const coinPurchasesResponse = await supabase
        .from("coin_purchases")
        .select("*")
        .limit(1000);

      if (coinPurchasesResponse.error) {
        console.error("Fehler beim Laden von coin_purchases:", coinPurchasesResponse.error);
      } else {
        setCoinPurchases((coinPurchasesResponse.data as CoinPurchase[]) || []);
      }

      const boostPackPurchasesResponse = await supabase
        .from("boost_pack_purchases")
        .select("*")
        .limit(1000);

      if (boostPackPurchasesResponse.error) {
        console.error(
          "Fehler beim Laden von boost_pack_purchases:",
          boostPackPurchasesResponse.error
        );
      } else {
        setBoostPackPurchases(
          (boostPackPurchasesResponse.data as BoostPackPurchase[]) || []
        );
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const totalUsers = profiles.length;

  const totalCardPoints = profiles.reduce((sum, user) => {
    return sum + (user.card_points || 0);
  }, 0);

  const latestSignup = useMemo(() => {
    if (profiles.length === 0) return null;

    const sorted = [...profiles].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sorted[0]?.created_at || null;
  }, [profiles]);

  const activeSubscriptionsCount = subscriptions.filter((sub) =>
    ACTIVE_STATUSES.includes(sub.status)
  ).length;

  const affiliateSubscriptionsCount = subscriptions.filter((sub) => sub.is_affiliate).length;

  const nonAffiliateSubscriptionsCount = subscriptions.filter((sub) => !sub.is_affiliate).length;

  const totalSubscriptionRevenue = subscriptions.reduce((sum, sub) => {
    return sum + (sub.price_eur || 0);
  }, 0);

  const totalCoinRevenue = coinPurchases.reduce((sum, item) => {
    return sum + (item.price_eur || 0);
  }, 0);

  const totalRealMoneyRevenue = totalSubscriptionRevenue + totalCoinRevenue;

  const totalBoostCoinsSpent = boostPackPurchases.reduce((sum, item) => {
    return sum + (item.total_coin_cost || 0);
  }, 0);

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (variantFilter !== "all") {
      result = result.filter((sub) => sub.variant === variantFilter);
    }

    if (affiliateFilter === "affiliate") {
      result = result.filter((sub) => sub.is_affiliate);
    }

    if (affiliateFilter === "nonAffiliate") {
      result = result.filter((sub) => !sub.is_affiliate);
    }

    if (statusFilter === "active") {
      result = result.filter((sub) => ACTIVE_STATUSES.includes(sub.status));
    }

    if (statusFilter === "inactive") {
      result = result.filter((sub) => !ACTIVE_STATUSES.includes(sub.status));
    }

    result.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [subscriptions, variantFilter, affiliateFilter, statusFilter]);

  const chartData = useMemo(() => {
    const bucketMap = new Map<string, RevenueBucket>();

    function getBucketLabel(dateString: string, range: ChartRange) {
      const date = new Date(dateString);

      if (range === "day") {
        return date.toLocaleDateString("de-DE");
      }

      if (range === "week") {
        const start = new Date(date);
        const day = start.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        start.setDate(start.getDate() + diff);

        return `KW ${getWeekNumber(date)} (${start.toLocaleDateString("de-DE")})`;
      }

      return date.toLocaleDateString("de-DE", {
        month: "short",
        year: "numeric",
      });
    }

    function ensureBucket(label: string) {
      if (!bucketMap.has(label)) {
        bucketMap.set(label, {
          label,
          subscriptionRevenue: 0,
          coinRevenue: 0,
          realMoneyRevenue: 0,
          newSubscriptions: 0,
          coinPurchases: 0,
          boostPurchases: 0,
          boostCoinsSpent: 0,
        });
      }

      return bucketMap.get(label)!;
    }

    subscriptions.forEach((sub) => {
      const label = getBucketLabel(sub.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.subscriptionRevenue += sub.price_eur || 0;
      bucket.newSubscriptions += 1;
      bucket.realMoneyRevenue = bucket.subscriptionRevenue + bucket.coinRevenue;
    });

    coinPurchases.forEach((purchase) => {
      const label = getBucketLabel(purchase.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.coinRevenue += purchase.price_eur || 0;
      bucket.coinPurchases += 1;
      bucket.realMoneyRevenue = bucket.subscriptionRevenue + bucket.coinRevenue;
    });

    boostPackPurchases.forEach((purchase) => {
      const label = getBucketLabel(purchase.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.boostPurchases += purchase.quantity || 0;
      bucket.boostCoinsSpent += purchase.total_coin_cost || 0;
    });

    return Array.from(bucketMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "de")
    );
  }, [subscriptions, coinPurchases, boostPackPurchases, chartRange]);

  const maxRevenue = Math.max(...chartData.map((item) => item.realMoneyRevenue), 1);

  function formatDate(dateString: string | null) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("de-DE");
  }

  function formatMoney(value: number) {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  }

  function formatCoins(value: number) {
    return value.toLocaleString("de-DE");
  }

  function getVariantCount(variant: string) {
    return subscriptions.filter((sub) => sub.variant === variant).length;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Übersicht über Nutzer, Abos, Coin-Käufe, Boost-Packs und Umsatz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <KpiCard title="Total Users" value={loading ? "..." : String(totalUsers)} />
        <KpiCard
          title="Gesamte Card Points"
          value={loading ? "..." : String(totalCardPoints)}
        />
        <KpiCard
          title="Neueste Registrierung"
          value={loading ? "..." : formatDate(latestSignup)}
        />
        <KpiCard
          title="Echtgeld-Umsatz gesamt"
          value={loading ? "..." : formatMoney(totalRealMoneyRevenue)}
        />

        <KpiCard
          title="Alle Abos"
          value={loading ? "..." : String(subscriptions.length)}
        />
        <KpiCard
          title="Aktive Abos"
          value={loading ? "..." : String(activeSubscriptionsCount)}
        />
        <KpiCard
          title="Affiliate Abos"
          value={loading ? "..." : String(affiliateSubscriptionsCount)}
        />
        <KpiCard
          title="Ohne Affiliate"
          value={loading ? "..." : String(nonAffiliateSubscriptionsCount)}
        />

        <KpiCard title="Free" value={loading ? "..." : String(getVariantCount("Free"))} />
        <KpiCard title="Basic" value={loading ? "..." : String(getVariantCount("Basic"))} />
        <KpiCard title="Pro" value={loading ? "..." : String(getVariantCount("Pro"))} />
        <KpiCard title="Elite" value={loading ? "..." : String(getVariantCount("Elite"))} />
        <KpiCard title="Master" value={loading ? "..." : String(getVariantCount("Master"))} />
        <KpiCard
          title="Coin-Käufe"
          value={loading ? "..." : String(coinPurchases.length)}
        />
        <KpiCard
          title="Boost-Pack-Käufe"
          value={loading ? "..." : String(boostPackPurchases.length)}
        />
        <KpiCard
          title="Abo-Umsatz"
          value={loading ? "..." : formatMoney(totalSubscriptionRevenue)}
        />
        <KpiCard
          title="Coin-Umsatz"
          value={loading ? "..." : formatMoney(totalCoinRevenue)}
        />
        <KpiCard
          title="Für Boost-Packs ausgegebene Coins"
          value={loading ? "..." : formatCoins(totalBoostCoinsSpent)}
        />
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Echtgeld-Diagramm</h3>
            <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
              Nur Abos und Coin-Käufe zählen als Umsatz. Boost-Packs zählen als Coin-Ausgabe.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setChartRange("day")}
              style={chartRange === "day" ? activeButtonStyle : buttonStyle}
            >
              Tag
            </button>
            <button
              onClick={() => setChartRange("week")}
              style={chartRange === "week" ? activeButtonStyle : buttonStyle}
            >
              Woche
            </button>
            <button
              onClick={() => setChartRange("month")}
              style={chartRange === "month" ? activeButtonStyle : buttonStyle}
            >
              Monat
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {chartData.map((item) => (
            <div
              key={item.label}
              style={{
                background: "#f9fafb",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  height: "160px",
                  display: "flex",
                  alignItems: "flex-end",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(item.realMoneyRevenue / maxRevenue) * 100}%`,
                    minHeight: item.realMoneyRevenue > 0 ? "8px" : "0px",
                    background: "#111827",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              </div>

              <strong style={{ display: "block", marginBottom: "6px" }}>{item.label}</strong>
              <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                <div>Echtgeld gesamt: {formatMoney(item.realMoneyRevenue)}</div>
                <div>Abos: {formatMoney(item.subscriptionRevenue)}</div>
                <div>Coins: {formatMoney(item.coinRevenue)}</div>
                <div>Neue Abos: {item.newSubscriptions}</div>
                <div>Coin-Käufe: {item.coinPurchases}</div>
                <div>Boost-Pack-Käufe: {item.boostPurchases}</div>
                <div>Boost-Coins: {formatCoins(item.boostCoinsSpent)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Abo-Filter</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>Variante</label>
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle Varianten</option>
              {SUBSCRIPTION_VARIANTS.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Affiliate</label>
            <select
              value={affiliateFilter}
              onChange={(e) => setAffiliateFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="affiliate">Nur Affiliate</option>
              <option value="nonAffiliate">Nur ohne Affiliate</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="active">Nur aktiv</option>
              <option value="inactive">Nur inaktiv</option>
            </select>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>Subscriptions</h3>
          <span style={{ color: "#6b7280" }}>
            {loading ? "Lade..." : `${filteredSubscriptions.length} Einträge`}
          </span>
        </div>

        {loading ? (
          <p>Lade Daten...</p>
        ) : filteredSubscriptions.length === 0 ? (
          <p>Keine Abos gefunden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  <th style={tableHeaderStyle}>User ID</th>
                  <th style={tableHeaderStyle}>Variante</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Affiliate</th>
                  <th style={tableHeaderStyle}>Provider</th>
                  <th style={tableHeaderStyle}>Preis</th>
                  <th style={tableHeaderStyle}>Started At</th>
                  <th style={tableHeaderStyle}>Expires At</th>
                  <th style={tableHeaderStyle}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={tableCellStyle}>{sub.user_id}</td>
                    <td style={tableCellStyle}>{sub.variant}</td>
                    <td style={tableCellStyle}>{sub.status}</td>
                    <td style={tableCellStyle}>{sub.is_affiliate ? "Ja" : "Nein"}</td>
                    <td style={tableCellStyle}>{sub.provider || "—"}</td>
                    <td style={tableCellStyle}>{formatMoney(sub.price_eur || 0)}</td>
                    <td style={tableCellStyle}>{formatDate(sub.started_at)}</td>
                    <td style={tableCellStyle}>{formatDate(sub.expires_at)}</td>
                    <td style={tableCellStyle}>{formatDate(sub.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={kpiCardStyle}>
      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>{title}</p>
      <h3
        style={{
          margin: "10px 0 0 0",
          fontSize: "24px",
          color: "#111827",
          wordBreak: "break-word",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function getWeekNumber(date: Date) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  marginTop: "24px",
};

const kpiCardStyle: CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
};

const buttonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "white",
  cursor: "pointer",
};

const activeButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#111827",
  color: "white",
  border: "1px solid #111827",
};

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  color: "#111827",
  verticalAlign: "top",
};