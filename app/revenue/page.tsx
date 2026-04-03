"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../lib/supabase";

type Subscription = {
  id: string;
  user_id: string;
  variant: "Free" | "Basic" | "Pro" | "Elite" | "Master";
  status: "active" | "expired" | "cancelled" | "trialing";
  price_eur: number | null;
  created_at: string;
};

type CoinPurchase = {
  id: string;
  user_id: string;
  coins_amount: number;
  price_eur: number;
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

type MarketplaceSale = {
  id: string;
  seller_user_id: string;
  buyer_user_id: string | null;
  sale_price_coins: number;
  fee_coins: number;
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
  marketplaceSales: number;
  marketplaceFeeCoins: number;
};

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [coinPurchases, setCoinPurchases] = useState<CoinPurchase[]>([]);
  const [boostPackPurchases, setBoostPackPurchases] = useState<BoostPackPurchase[]>([]);
  const [marketplaceSales, setMarketplaceSales] = useState<MarketplaceSale[]>([]);

  const [chartRange, setChartRange] = useState<ChartRange>("day");

  useEffect(() => {
    async function loadRevenueData() {
      setLoading(true);

      const subscriptionsResponse = await supabase
        .from("subscriptions")
        .select("id, user_id, variant, status, price_eur, created_at")
        .limit(1000);

      if (subscriptionsResponse.error) {
        console.error("Fehler beim Laden von subscriptions:", subscriptionsResponse.error);
      } else {
        setSubscriptions((subscriptionsResponse.data as Subscription[]) || []);
      }

      const coinPurchasesResponse = await supabase
        .from("coin_purchases")
        .select("id, user_id, coins_amount, price_eur, created_at")
        .limit(1000);

      if (coinPurchasesResponse.error) {
        console.error("Fehler beim Laden von coin_purchases:", coinPurchasesResponse.error);
      } else {
        setCoinPurchases((coinPurchasesResponse.data as CoinPurchase[]) || []);
      }

      const boostPackPurchasesResponse = await supabase
        .from("boost_pack_purchases")
        .select("id, user_id, pack_name, quantity, coin_cost, total_coin_cost, created_at")
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

      const marketplaceSalesResponse = await supabase
        .from("marketplace_sales")
        .select("id, seller_user_id, buyer_user_id, sale_price_coins, fee_coins, created_at")
        .limit(1000);

      if (marketplaceSalesResponse.error) {
        console.error(
          "Fehler beim Laden von marketplace_sales:",
          marketplaceSalesResponse.error
        );
      } else {
        setMarketplaceSales((marketplaceSalesResponse.data as MarketplaceSale[]) || []);
      }

      setLoading(false);
    }

    loadRevenueData();
  }, []);

  const totalSubscriptionRevenue = subscriptions.reduce((sum, item) => {
    return sum + (item.price_eur || 0);
  }, 0);

  const totalCoinRevenue = coinPurchases.reduce((sum, item) => {
    return sum + (item.price_eur || 0);
  }, 0);

  const totalRealMoneyRevenue = totalSubscriptionRevenue + totalCoinRevenue;

  const totalBoostCoinsSpent = boostPackPurchases.reduce((sum, item) => {
    return sum + (item.total_coin_cost || 0);
  }, 0);

  const totalMarketplaceFeeCoins = marketplaceSales.reduce((sum, item) => {
    return sum + (item.fee_coins || 0);
  }, 0);

  const totalNewSubscriptions = subscriptions.length;
  const totalCoinPurchases = coinPurchases.length;
  const totalBoostPurchases = boostPackPurchases.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0);

  const todayRevenue = useMemo(() => {
    const todayKey = new Date().toLocaleDateString("sv-SE");

    const subscriptionToday = subscriptions.reduce((sum, item) => {
      const key = new Date(item.created_at).toLocaleDateString("sv-SE");
      return key === todayKey ? sum + (item.price_eur || 0) : sum;
    }, 0);

    const coinToday = coinPurchases.reduce((sum, item) => {
      const key = new Date(item.created_at).toLocaleDateString("sv-SE");
      return key === todayKey ? sum + (item.price_eur || 0) : sum;
    }, 0);

    return subscriptionToday + coinToday;
  }, [subscriptions, coinPurchases]);

  const yesterdayRevenue = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toLocaleDateString("sv-SE");

    const subscriptionYesterday = subscriptions.reduce((sum, item) => {
      const key = new Date(item.created_at).toLocaleDateString("sv-SE");
      return key === yesterdayKey ? sum + (item.price_eur || 0) : sum;
    }, 0);

    const coinYesterday = coinPurchases.reduce((sum, item) => {
      const key = new Date(item.created_at).toLocaleDateString("sv-SE");
      return key === yesterdayKey ? sum + (item.price_eur || 0) : sum;
    }, 0);

    return subscriptionYesterday + coinYesterday;
  }, [subscriptions, coinPurchases]);

  const revenueChangePercent = useMemo(() => {
    if (yesterdayRevenue === 0) {
      if (todayRevenue === 0) return 0;
      return 100;
    }

    return ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  }, [todayRevenue, yesterdayRevenue]);

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
          marketplaceSales: 0,
          marketplaceFeeCoins: 0,
        });
      }

      return bucketMap.get(label)!;
    }

    subscriptions.forEach((item) => {
      const label = getBucketLabel(item.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.subscriptionRevenue += item.price_eur || 0;
      bucket.newSubscriptions += 1;
      bucket.realMoneyRevenue = bucket.subscriptionRevenue + bucket.coinRevenue;
    });

    coinPurchases.forEach((item) => {
      const label = getBucketLabel(item.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.coinRevenue += item.price_eur || 0;
      bucket.coinPurchases += 1;
      bucket.realMoneyRevenue = bucket.subscriptionRevenue + bucket.coinRevenue;
    });

    boostPackPurchases.forEach((item) => {
      const label = getBucketLabel(item.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.boostPurchases += item.quantity || 0;
      bucket.boostCoinsSpent += item.total_coin_cost || 0;
    });

    marketplaceSales.forEach((item) => {
      const label = getBucketLabel(item.created_at, chartRange);
      const bucket = ensureBucket(label);

      bucket.marketplaceSales += 1;
      bucket.marketplaceFeeCoins += item.fee_coins || 0;
    });

    return Array.from(bucketMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "de")
    );
  }, [subscriptions, coinPurchases, boostPackPurchases, marketplaceSales, chartRange]);

  const maxRevenue = Math.max(...chartData.map((item) => item.realMoneyRevenue), 1);

  function formatMoney(value: number) {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  }

  function formatCoins(value: number) {
    return value.toLocaleString("de-DE");
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Revenue</h1>
        <p style={pageSubtitleStyle}>
          Echtgeld aus Abos und Coin-Käufen. Coins aus Marketplace-Gebühren und
          Boost-Pack-Ausgaben separat.
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
            <span style={heroMetaLabelStyle}>Gesamt Echtgeld</span>
            <strong style={heroMetaValueStyle}>
              {loading ? "..." : formatMoney(totalRealMoneyRevenue)}
            </strong>
          </div>
        </div>
      </section>

      <div style={kpiGridStyle}>
        <KpiCard
          title="Echtgeld gesamt"
          value={loading ? "..." : formatMoney(totalRealMoneyRevenue)}
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
          title="Neue Abos"
          value={loading ? "..." : String(totalNewSubscriptions)}
        />
        <KpiCard
          title="Coin-Käufe"
          value={loading ? "..." : String(totalCoinPurchases)}
        />
        <KpiCard
          title="Boost-Pack-Käufe"
          value={loading ? "..." : String(totalBoostPurchases)}
        />
        <KpiCard
          title="Boost-Pack Coin-Ausgaben"
          value={loading ? "..." : formatCoins(totalBoostCoinsSpent)}
        />
        <KpiCard
          title="Marketplace Fee Coins"
          value={loading ? "..." : formatCoins(totalMarketplaceFeeCoins)}
        />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Revenue Diagramm</h3>
            <p style={sectionTextStyle}>
              Umschaltbar nach Tag, Woche oder Monat.
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
                <div>Echtgeld: {formatMoney(item.realMoneyRevenue)}</div>
                <div>Abos: {formatMoney(item.subscriptionRevenue)}</div>
                <div>Coins: {formatMoney(item.coinRevenue)}</div>
                <div>Neue Abos: {item.newSubscriptions}</div>
                <div>Coin-Käufe: {item.coinPurchases}</div>
                <div>Boost-Käufe: {item.boostPurchases}</div>
                <div>Boost-Coins: {formatCoins(item.boostCoinsSpent)}</div>
                <div>Marketplace Verkäufe: {item.marketplaceSales}</div>
                <div>
                  Marketplace Fee Coins: {formatCoins(item.marketplaceFeeCoins)}
                </div>
              </div>
            </div>
          ))}
        </div>
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