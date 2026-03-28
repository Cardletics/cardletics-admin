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
    <div>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Revenue</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Echtgeld aus Abos + Coin-Käufen. Coins aus Marketplace-Gebühren und Boost-Pack-Ausgaben separat.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
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
            <h3 style={{ margin: 0 }}>Revenue Diagramm</h3>
            <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
              Umschaltbar nach Tag, Woche oder Monat.
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
                <div>Echtgeld: {formatMoney(item.realMoneyRevenue)}</div>
                <div>Abos: {formatMoney(item.subscriptionRevenue)}</div>
                <div>Coins: {formatMoney(item.coinRevenue)}</div>
                <div>Neue Abos: {item.newSubscriptions}</div>
                <div>Coin-Käufe: {item.coinPurchases}</div>
                <div>Boost-Käufe: {item.boostPurchases}</div>
                <div>Boost-Coins: {formatCoins(item.boostCoinsSpent)}</div>
                <div>Marketplace Verkäufe: {item.marketplaceSales}</div>
                <div>Marketplace Fee Coins: {formatCoins(item.marketplaceFeeCoins)}</div>
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