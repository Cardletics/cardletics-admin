"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  exportUserDetailsToExcel,
  exportUserDetailsToPdf,
} from "../../../lib/exportHelpers";

type Profile = {
  id: string;
  username: string | null;
  created_at: string;
  selected_background_id: string | null;
  card_points: number | null;
};

type Subscription = {
  id: string;
  user_id: string;
  variant: string;
  status: string;
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

type MarketplaceSale = {
  id: string;
  seller_user_id: string;
  buyer_user_id: string | null;
  sale_price_coins: number;
  fee_coins: number;
  created_at: string;
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = String(params.id);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [coinPurchases, setCoinPurchases] = useState<CoinPurchase[]>([]);
  const [boostPackPurchases, setBoostPackPurchases] = useState<BoostPackPurchase[]>([]);
  const [marketplaceSales, setMarketplaceSales] = useState<MarketplaceSale[]>([]);

  useEffect(() => {
    async function loadUserDetails() {
      setLoading(true);

      const profileResponse = await supabase
        .from("profiles")
        .select("id, username, created_at, selected_background_id, card_points")
        .eq("id", userId)
        .maybeSingle();

      if (profileResponse.error) {
        console.error("Fehler beim Laden des Profils:", profileResponse.error);
      } else {
        setProfile((profileResponse.data as Profile | null) || null);
      }

      const subscriptionsResponse = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      if (subscriptionsResponse.error) {
        console.error("Fehler beim Laden der Abos:", subscriptionsResponse.error);
      } else {
        setSubscriptions((subscriptionsResponse.data as Subscription[]) || []);
      }

      const coinPurchasesResponse = await supabase
        .from("coin_purchases")
        .select("*")
        .eq("user_id", userId);

      if (coinPurchasesResponse.error) {
        console.error("Fehler beim Laden der Coin-Käufe:", coinPurchasesResponse.error);
      } else {
        setCoinPurchases((coinPurchasesResponse.data as CoinPurchase[]) || []);
      }

      const boostPackPurchasesResponse = await supabase
        .from("boost_pack_purchases")
        .select("*")
        .eq("user_id", userId);

      if (boostPackPurchasesResponse.error) {
        console.error("Fehler beim Laden der Boost-Pack-Käufe:", boostPackPurchasesResponse.error);
      } else {
        setBoostPackPurchases(
          (boostPackPurchasesResponse.data as BoostPackPurchase[]) || []
        );
      }

      const marketplaceSalesResponse = await supabase
        .from("marketplace_sales")
        .select("*")
        .eq("seller_user_id", userId);

      if (marketplaceSalesResponse.error) {
        console.error("Fehler beim Laden der Marketplace-Sales:", marketplaceSalesResponse.error);
      } else {
        setMarketplaceSales((marketplaceSalesResponse.data as MarketplaceSale[]) || []);
      }

      setLoading(false);
    }

    loadUserDetails();
  }, [userId]);

  const totalSubscriptionRevenue = subscriptions.reduce(
    (sum, item) => sum + (item.price_eur || 0),
    0
  );

  const totalCoinRevenue = coinPurchases.reduce(
    (sum, item) => sum + (item.price_eur || 0),
    0
  );

  const totalBoostCoinsSpent = boostPackPurchases.reduce(
    (sum, item) => sum + (item.total_coin_cost || 0),
    0
  );

  const totalMarketplaceFeeCoins = marketplaceSales.reduce(
    (sum, item) => sum + (item.fee_coins || 0),
    0
  );

  const exportSections = useMemo(() => {
    return [
      {
        title: "Profil",
        rows: profile
          ? [
              {
                id: profile.id,
                username: profile.username || "",
                created_at: profile.created_at,
                selected_background_id: profile.selected_background_id || "",
                card_points: profile.card_points || 0,
              },
            ]
          : [],
      },
      {
        title: "Subscriptions",
        rows: subscriptions.map((item) => ({
          id: item.id,
          variant: item.variant,
          status: item.status,
          provider: item.provider || "",
          is_affiliate: item.is_affiliate ? "Ja" : "Nein",
          price_eur: item.price_eur || 0,
          started_at: item.started_at,
          expires_at: item.expires_at || "",
          created_at: item.created_at,
        })),
      },
      {
        title: "Coin Purchases",
        rows: coinPurchases.map((item) => ({
          id: item.id,
          coins_amount: item.coins_amount,
          price_eur: item.price_eur,
          provider: item.provider || "",
          created_at: item.created_at,
        })),
      },
      {
        title: "Boost Pack Purchases",
        rows: boostPackPurchases.map((item) => ({
          id: item.id,
          pack_name: item.pack_name,
          quantity: item.quantity,
          coin_cost: item.coin_cost,
          total_coin_cost: item.total_coin_cost,
          created_at: item.created_at,
        })),
      },
      {
        title: "Marketplace Sales",
        rows: marketplaceSales.map((item) => ({
          id: item.id,
          sale_price_coins: item.sale_price_coins,
          fee_coins: item.fee_coins,
          buyer_user_id: item.buyer_user_id || "",
          created_at: item.created_at,
        })),
      },
    ];
  }, [profile, subscriptions, coinPurchases, boostPackPurchases, marketplaceSales]);

  function handleExcelExport() {
    const baseName = `cardletics-user-${userId}`;
    exportUserDetailsToExcel(baseName, exportSections);
  }

  function handlePdfExport() {
    const baseName = `cardletics-user-${userId}`;
    const title = `Cardletics User Report: ${profile?.username || userId}`;
    exportUserDetailsToPdf(baseName, title, exportSections);
  }

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

  if (loading) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>User Details</h1>
        <p>Lade Daten...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>User Details</h1>
        <p>Kein User gefunden.</p>
        <Link href="/users" style={backLinkStyle}>
          Zurück zu Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={topBarStyle}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
            {profile.username || "Kein Username"}
          </h1>
          <p style={{ marginTop: 0, color: "#4b5563" }}>
            Detailansicht für diesen User.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleExcelExport} style={primaryButtonStyle}>
            Export Excel
          </button>
          <button onClick={handlePdfExport} style={secondaryButtonStyle}>
            Export PDF
          </button>
          <Link href="/users" style={backButtonStyle}>
            Zurück
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <KpiCard title="Card Points" value={String(profile.card_points || 0)} />
        <KpiCard title="Abos" value={String(subscriptions.length)} />
        <KpiCard title="Coin-Käufe" value={String(coinPurchases.length)} />
        <KpiCard title="Boost-Pack-Käufe" value={String(boostPackPurchases.length)} />
        <KpiCard
          title="Abo-Umsatz"
          value={formatMoney(totalSubscriptionRevenue)}
        />
        <KpiCard
          title="Coin-Umsatz"
          value={formatMoney(totalCoinRevenue)}
        />
        <KpiCard
          title="Boost Coins ausgegeben"
          value={String(totalBoostCoinsSpent)}
        />
        <KpiCard
          title="Marketplace Fee Coins"
          value={String(totalMarketplaceFeeCoins)}
        />
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Profil</h3>
        <div style={infoGridStyle}>
          <InfoItem label="User ID" value={profile.id} />
          <InfoItem label="Username" value={profile.username || "—"} />
          <InfoItem label="Registriert am" value={formatDate(profile.created_at)} />
          <InfoItem
            label="Background"
            value={profile.selected_background_id || "—"}
          />
        </div>
      </div>

      <SectionTable
        title="Subscriptions"
        headers={[
          "Variante",
          "Status",
          "Affiliate",
          "Provider",
          "Preis",
          "Started At",
          "Expires At",
        ]}
        rows={subscriptions.map((item) => [
          item.variant,
          item.status,
          item.is_affiliate ? "Ja" : "Nein",
          item.provider || "—",
          formatMoney(item.price_eur || 0),
          formatDate(item.started_at),
          formatDate(item.expires_at),
        ])}
      />

      <SectionTable
        title="Coin Purchases"
        headers={["Coins", "Preis", "Provider", "Created At"]}
        rows={coinPurchases.map((item) => [
          String(item.coins_amount),
          formatMoney(item.price_eur),
          item.provider || "—",
          formatDate(item.created_at),
        ])}
      />

      <SectionTable
        title="Boost Pack Purchases"
        headers={["Pack", "Menge", "Coin Cost", "Total Coin Cost", "Created At"]}
        rows={boostPackPurchases.map((item) => [
          item.pack_name,
          String(item.quantity),
          String(item.coin_cost),
          String(item.total_coin_cost),
          formatDate(item.created_at),
        ])}
      />

      <SectionTable
        title="Marketplace Sales"
        headers={["Sale Price Coins", "Fee Coins", "Buyer User ID", "Created At"]}
        rows={marketplaceSales.map((item) => [
          String(item.sale_price_coins),
          String(item.fee_coins),
          item.buyer_user_id || "—",
          formatDate(item.created_at),
        ])}
      />
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={kpiCardStyle}>
      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>{title}</p>
      <h3 style={{ margin: "10px 0 0 0", fontSize: "24px", color: "#111827" }}>
        {value}
      </h3>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{label}</p>
      <p style={{ margin: "6px 0 0 0", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

function SectionTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>

      {rows.length === 0 ? (
        <p>Keine Daten vorhanden.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {headers.map((header) => (
                  <th key={header} style={tableHeaderStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderTop: "1px solid #e5e7eb" }}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} style={tableCellStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const topBarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
};

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

const primaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #111827",
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  cursor: "pointer",
};

const backButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  textDecoration: "none",
};

const backLinkStyle: CSSProperties = {
  color: "#111827",
  textDecoration: "underline",
};