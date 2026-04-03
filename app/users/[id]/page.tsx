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
        console.error(
          "Fehler beim Laden der Boost-Pack-Käufe:",
          boostPackPurchasesResponse.error
        );
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
        console.error(
          "Fehler beim Laden der Marketplace-Sales:",
          marketplaceSalesResponse.error
        );
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
      <div style={pageStyle}>
        <h1 style={pageTitleStyle}>User Details</h1>
        <p style={pageSubtitleStyle}>Lade Daten...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={pageStyle}>
        <h1 style={pageTitleStyle}>User Details</h1>
        <p style={pageSubtitleStyle}>Kein User gefunden.</p>
        <Link href="/users" style={backTextLinkStyle}>
          Zurück zu Users
        </Link>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroCardStyle}>
        <div style={heroTopStyle}>
          <div>
            <div style={heroLabelStyle}>User Detailansicht</div>
            <h1 style={heroTitleStyle}>{profile.username || "Kein Username"}</h1>
            <p style={heroSubtitleStyle}>
              Alle wichtigen Profil-, Abo-, Kauf- und Marketplace-Daten für diesen
              User.
            </p>
          </div>

          <div style={heroButtonGridStyle}>
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

        <div style={heroMetaGridStyle}>
          <div style={heroMetaCardStyle}>
            <span style={heroMetaLabelStyle}>User ID</span>
            <strong style={heroMetaValueStyle}>{profile.id}</strong>
          </div>

          <div style={heroMetaCardStyle}>
            <span style={heroMetaLabelStyle}>Registriert</span>
            <strong style={heroMetaValueStyle}>
              {formatDate(profile.created_at)}
            </strong>
          </div>
        </div>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard title="Card Points" value={String(profile.card_points || 0)} />
        <KpiCard title="Abos" value={String(subscriptions.length)} />
        <KpiCard title="Coin-Käufe" value={String(coinPurchases.length)} />
        <KpiCard
          title="Boost-Pack-Käufe"
          value={String(boostPackPurchases.length)}
        />
        <KpiCard
          title="Abo-Umsatz"
          value={formatMoney(totalSubscriptionRevenue)}
        />
        <KpiCard title="Coin-Umsatz" value={formatMoney(totalCoinRevenue)} />
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
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Profil</h3>
        </div>

        <div style={profileGridStyle}>
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
      <p style={kpiTitleStyle}>{title}</p>
      <h3 style={kpiValueStyle}>{value}</h3>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoItemStyle}>
      <p style={infoLabelStyle}>{label}</p>
      <p style={infoValueStyle}>{value}</p>
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
      <div style={sectionHeaderStyle}>
        <h3 style={sectionTitleStyle}>{title}</h3>
        <span style={sectionCountStyle}>{rows.length} Einträge</span>
      </div>

      {rows.length === 0 ? (
        <p style={emptyTextStyle}>Keine Daten vorhanden.</p>
      ) : (
        <>
          <div className="user-detail-mobile-list" style={mobileListStyle}>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} style={mobileCardStyle}>
                <div style={mobileInfoGridStyle}>
                  {headers.map((header, cellIndex) => (
                    <InfoItem
                      key={`${rowIndex}-${cellIndex}`}
                      label={header}
                      value={row[cellIndex] || "—"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className="user-detail-desktop-table"
            style={desktopTableWrapperStyle}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr style={{ background: "#111814", textAlign: "left" }}>
                  {headers.map((header) => (
                    <th key={header} style={tableHeaderStyle}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ borderTop: "1px solid #27312d" }}>
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
        </>
      )}
    </div>
  );
}

const pageStyle: CSSProperties = {
  width: "100%",
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

const heroCardStyle: CSSProperties = {
  background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)",
  border: "1px solid #2f5f45",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
  marginBottom: "20px",
};

const heroTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
};

const heroLabelStyle: CSSProperties = {
  fontSize: "14px",
  color: "rgba(255,255,255,0.75)",
  marginBottom: "8px",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: 800,
  color: "white",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const heroSubtitleStyle: CSSProperties = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#bbf7d0",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: 1.5,
};

const heroButtonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
  width: "100%",
  maxWidth: "220px",
};

const heroMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
  marginTop: "16px",
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
  fontSize: "16px",
  wordBreak: "break-word",
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

const sectionCountStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const emptyTextStyle: CSSProperties = {
  color: "#94a39b",
  margin: 0,
};

const profileGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const infoItemStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "12px",
  padding: "12px",
};

const infoLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "6px",
};

const infoValueStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: "#e7f1eb",
  wordBreak: "break-word",
  fontSize: "14px",
};

const mobileListStyle: CSSProperties = {
  display: "grid",
  gap: "14px",
};

const mobileCardStyle: CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "16px",
};

const mobileInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
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

const primaryButtonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #22c55e",
  background: "#22c55e",
  color: "#08130c",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#0f1512",
  color: "#e7f1eb",
  cursor: "pointer",
  fontWeight: 700,
};

const backButtonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#171f1c",
  color: "#e7f1eb",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const backTextLinkStyle: CSSProperties = {
  color: "#86efac",
  textDecoration: "underline",
};