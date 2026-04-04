"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../lib/supabase";

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

  const todayRevenue = useMemo(() => {
    const today = new Date();
    const todayKey = today.toLocaleDateString("sv-SE");

    const subscriptionToday = subscriptions.reduce((sum, sub) => {
      const key = new Date(sub.created_at).toLocaleDateString("sv-SE");
      return key === todayKey ? sum + (sub.price_eur || 0) : sum;
    }, 0);

    const coinToday = coinPurchases.reduce((sum, purchase) => {
      const key = new Date(purchase.created_at).toLocaleDateString("sv-SE");
      return key === todayKey ? sum + (purchase.price_eur || 0) : sum;
    }, 0);

    return subscriptionToday + coinToday;
  }, [subscriptions, coinPurchases]);

  const yesterdayRevenue = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toLocaleDateString("sv-SE");

    const subscriptionYesterday = subscriptions.reduce((sum, sub) => {
      const key = new Date(sub.created_at).toLocaleDateString("sv-SE");
      return key === yesterdayKey ? sum + (sub.price_eur || 0) : sum;
    }, 0);

    const coinYesterday = coinPurchases.reduce((sum, purchase) => {
      const key = new Date(purchase.created_at).toLocaleDateString("sv-SE");
      return key === yesterdayKey ? sum + (purchase.price_eur || 0) : sum;
    }, 0);

    return subscriptionYesterday + coinYesterday;
  }, [subscriptions, coinPurchases]);

  const todayPurchasesCount = useMemo(() => {
    const today = new Date().toLocaleDateString("sv-SE");

    const subCount = subscriptions.filter(
      (sub) => new Date(sub.created_at).toLocaleDateString("sv-SE") === today
    ).length;

    const coinCount = coinPurchases.filter(
      (purchase) => new Date(purchase.created_at).toLocaleDateString("sv-SE") === today
    ).length;

    return subCount + coinCount;
  }, [subscriptions, coinPurchases]);

  const revenueChangePercent = useMemo(() => {
    if (yesterdayRevenue === 0) {
      if (todayRevenue === 0) return 0;
      return 100;
    }

    return ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  }, [todayRevenue, yesterdayRevenue]);

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
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Dashboard</h1>
        <p style={pageSubtitleStyle}>
          Übersicht über Nutzer, Abos, Coin-Käufe, Boost-Packs und Umsatz.
        </p>
      </div>

      <section style={heroRevenueCardStyle}>
        <div>
          <div style={heroLabelStyle}>Tageseinnahmen heute</div>
          <div style={heroValueStyle}>
            {loading ? "..." : formatMoney(todayRevenue)}
          </div>
          <div style={heroSublineStyle}>
            {loading
              ? "Lade Vergleich..."
              : `${revenueChangePercent >= 0 ? "+" : ""}${revenueChangePercent.toFixed(
                  1
                )}% vs. gestern`}
          </div>
        </div>

        <div style={heroMetaGridStyle}>
          <div style={heroMetaCardStyle}>
            <span style={heroMetaLabelStyle}>Gestern</span>
            <strong style={heroMetaValueStyle}>
              {loading ? "..." : formatMoney(yesterdayRevenue)}
            </strong>
          </div>

          <div style={heroMetaCardStyle}>
            <span style={heroMetaLabelStyle}>Käufe heute</span>
            <strong style={heroMetaValueStyle}>
              {loading ? "..." : String(todayPurchasesCount)}
            </strong>
          </div>
        </div>
      </section>

      <div style={kpiGridStyle}>
        <KpiCard title="Total Users" value={loading ? "..." : String(totalUsers)} />
        <KpiCard
          title="Gesamte Card Points"
          value={loading ? "..." : formatCoins(totalCardPoints)}
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
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Echtgeld-Diagramm</h3>
            <p style={sectionTextStyle}>
              Nur Abos und Coin-Käufe zählen als Umsatz. Boost-Packs zählen als Coin-Ausgabe.
            </p>
          </div>

          <div style={buttonGroupStyle}>
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

        <div style={chartGridStyle}>
          {chartData.map((item) => (
            <div key={item.label} style={chartCardStyle}>
              <div style={chartBarWrapperStyle}>
                <div
                  style={{
                    width: "100%",
                    height: `${(item.realMoneyRevenue / maxRevenue) * 100}%`,
                    minHeight: item.realMoneyRevenue > 0 ? "8px" : "0px",
                    background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
              </div>

              <strong style={chartLabelStyle}>{item.label}</strong>

              <div style={chartInfoStyle}>
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
        <h3 style={sectionTitleStyle}>Abo-Filter</h3>

        <div style={filterGridStyle}>
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
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Subscriptions</h3>
          <span style={sectionCountStyle}>
            {loading ? "Lade..." : `${filteredSubscriptions.length} Einträge`}
          </span>
        </div>

        {loading ? (
          <p style={sectionTextStyle}>Lade Daten...</p>
        ) : filteredSubscriptions.length === 0 ? (
          <p style={sectionTextStyle}>Keine Abos gefunden.</p>
        ) : (
          <>
            <div style={mobileSubscriptionListStyle}>
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} style={mobileSubscriptionCardStyle}>
                  <div style={mobileSubscriptionTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>User ID</div>
                      <div style={mobileValueStyle}>{sub.user_id}</div>
                    </div>
                    <div style={statusBadgeStyle}>
                      {sub.status}
                    </div>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="Variante" value={sub.variant} />
                    <InfoItem label="Affiliate" value={sub.is_affiliate ? "Ja" : "Nein"} />
                    <InfoItem label="Provider" value={sub.provider || "—"} />
                    <InfoItem label="Preis" value={formatMoney(sub.price_eur || 0)} />
                    <InfoItem label="Started At" value={formatDate(sub.started_at)} />
                    <InfoItem label="Expires At" value={formatDate(sub.expires_at)} />
                    <InfoItem label="Created At" value={formatDate(sub.created_at)} />
                  </div>
                </div>
              ))}
            </div>

            <div style={desktopTableWrapperStyle}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                }}
              >
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
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
                    <tr key={sub.id} style={{ borderTop: "1px solid #27312d" }}>
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
          </>
        )}
      </div>
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

function getWeekNumber(date: Date) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const pageStyle: CSSProperties = {
  width: "100%",
};

const pageHeaderStyle: CSSProperties = {
  marginBottom: "20px",
};

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
  fontWeight: 800,
  color: "white",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const heroSublineStyle: CSSProperties = {
  marginTop: "10px",
  color: "#bbf7d0",
  fontSize: "15px",
  fontWeight: 600,
};

const heroMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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

const heroMetaValueStyle: CSSProperties = {
  color: "white",
  fontSize: "18px",
};

const kpiGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

const kpiTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#94a39b",
};

const kpiValueStyle: CSSProperties = {
  margin: "10px 0 0 0",
  fontSize: "24px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

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

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "#e7f1eb",
};

const sectionTextStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#94a39b",
  lineHeight: 1.5,
};

const sectionCountStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#0f1512",
  color: "#e7f1eb",
  cursor: "pointer",
  minHeight: "44px",
};

const activeButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#22c55e",
  color: "#08130c",
  border: "1px solid #22c55e",
  fontWeight: 700,
};

const chartGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "20px",
};

const chartCardStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "14px",
};

const chartBarWrapperStyle: CSSProperties = {
  height: "160px",
  display: "flex",
  alignItems: "flex-end",
  marginBottom: "12px",
};

const chartLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#e7f1eb",
};

const chartInfoStyle: CSSProperties = {
  fontSize: "14px",
  color: "#b7c6be",
  lineHeight: 1.7,
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "16px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#0f1512",
  color: "#e7f1eb",
  boxSizing: "border-box",
  minHeight: "46px",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#cfe0d6",
};

const mobileSubscriptionListStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

const mobileSubscriptionCardStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "16px",
};

const mobileSubscriptionTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "14px",
};

const mobileLabelStyle: CSSProperties = {
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "4px",
};

const mobileValueStyle: CSSProperties = {
  fontSize: "14px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const statusBadgeStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#163322",
  color: "#86efac",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const mobileInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const infoItemStyle: CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "12px",
  padding: "12px",
};

const infoLabelStyle: CSSProperties = {
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "6px",
};

const infoValueStyle: CSSProperties = {
  fontSize: "14px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const desktopTableWrapperStyle: CSSProperties = {
  overflowX: "auto",
  marginTop: "18px",
  display: "none",
};

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#cfe0d6",
  borderBottom: "1px solid #27312d",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  color: "#e7f1eb",
  verticalAlign: "top",
};

if (typeof window !== "undefined") {
  const styleId = "dashboard-responsive-styles";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media (min-width: 900px) {
        .dashboard-desktop-table {
          display: block;
        }
      }
    `;
    document.head.appendChild(style);
  }
}