"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../lib/supabase";

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

const VARIANTS = ["Free", "Basic", "Pro", "Elite", "Master"];
const ACTIVE_STATUSES = ["active", "trialing"];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [variantFilter, setVariantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [affiliateFilter, setAffiliateFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function loadSubscriptions() {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .limit(1000);

      if (error) {
        console.error("Fehler beim Laden der subscriptions:", error);
      } else {
        setSubscriptions((data as Subscription[]) || []);
      }

      setLoading(false);
    }

    loadSubscriptions();
  }, []);

  const providerOptions = useMemo(() => {
    const providers = subscriptions
      .map((sub) => sub.provider)
      .filter((provider): provider is string => !!provider && provider.trim() !== "");

    return Array.from(new Set(providers)).sort();
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (search.trim() !== "") {
      const value = search.toLowerCase();

      result = result.filter((sub) => {
        const userId = sub.user_id.toLowerCase();
        const variant = sub.variant.toLowerCase();
        const status = sub.status.toLowerCase();
        const provider = (sub.provider || "").toLowerCase();

        return (
          userId.includes(value) ||
          variant.includes(value) ||
          status.includes(value) ||
          provider.includes(value)
        );
      });
    }

    if (variantFilter !== "all") {
      result = result.filter((sub) => sub.variant === variantFilter);
    }

    if (statusFilter === "active") {
      result = result.filter((sub) => ACTIVE_STATUSES.includes(sub.status));
    }

    if (statusFilter === "inactive") {
      result = result.filter((sub) => !ACTIVE_STATUSES.includes(sub.status));
    }

    if (statusFilter !== "all" && statusFilter !== "active" && statusFilter !== "inactive") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    if (affiliateFilter === "affiliate") {
      result = result.filter((sub) => sub.is_affiliate);
    }

    if (affiliateFilter === "nonAffiliate") {
      result = result.filter((sub) => !sub.is_affiliate);
    }

    if (providerFilter !== "all") {
      result = result.filter((sub) => (sub.provider || "") === providerFilter);
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      if (sortOrder === "priceHigh") {
        return (b.price_eur || 0) - (a.price_eur || 0);
      }

      return (a.price_eur || 0) - (b.price_eur || 0);
    });

    return result;
  }, [
    subscriptions,
    search,
    variantFilter,
    statusFilter,
    affiliateFilter,
    providerFilter,
    sortOrder,
  ]);

  const totalSubscriptions = subscriptions.length;

  const activeSubscriptions = subscriptions.filter((sub) =>
    ACTIVE_STATUSES.includes(sub.status)
  ).length;

  const affiliateSubscriptions = subscriptions.filter((sub) => sub.is_affiliate).length;

  const totalRevenue = subscriptions.reduce((sum, sub) => {
    return sum + (sub.price_eur || 0);
  }, 0);

  const filteredRevenue = filteredSubscriptions.reduce((sum, sub) => {
    return sum + (sub.price_eur || 0);
  }, 0);

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

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Subscriptions</h1>
        <p style={pageSubtitleStyle}>
          Übersicht über alle Abos, Status, Affiliate und Umsatz.
        </p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard
          title="Alle Abos"
          value={loading ? "..." : String(totalSubscriptions)}
        />
        <KpiCard
          title="Aktive Abos"
          value={loading ? "..." : String(activeSubscriptions)}
        />
        <KpiCard
          title="Affiliate Abos"
          value={loading ? "..." : String(affiliateSubscriptions)}
        />
        <KpiCard
          title="Gesamtumsatz"
          value={loading ? "..." : formatMoney(totalRevenue)}
        />
        <KpiCard
          title="Gefilterte Einträge"
          value={loading ? "..." : String(filteredSubscriptions.length)}
        />
        <KpiCard
          title="Gefilterter Umsatz"
          value={loading ? "..." : formatMoney(filteredRevenue)}
        />
        <KpiCard
          title="Elite"
          value={
            loading
              ? "..."
              : String(subscriptions.filter((sub) => sub.variant === "Elite").length)
          }
        />
        <KpiCard
          title="Master"
          value={
            loading
              ? "..."
              : String(subscriptions.filter((sub) => sub.variant === "Master").length)
          }
        />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Filter</h3>
          <span style={sectionCountStyle}>
            {loading ? "Lade..." : `${filteredSubscriptions.length} Einträge`}
          </span>
        </div>

        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Suche</label>
            <input
              type="text"
              placeholder="User ID, Variante, Status, Provider"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Variante</label>
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle Varianten</option>
              {VARIANTS.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
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
              <option value="trialing">Trialing</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
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
            <label style={labelStyle}>Provider</label>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle Provider</option>
              {providerOptions.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Sortierung</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={inputStyle}
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="priceHigh">Preis hoch zu niedrig</option>
              <option value="priceLow">Preis niedrig zu hoch</option>
            </select>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Abo-Liste</h3>
          <span style={sectionCountStyle}>
            {loading ? "Lade..." : `${filteredSubscriptions.length} Einträge`}
          </span>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Lade Abos...</p>
        ) : filteredSubscriptions.length === 0 ? (
          <p style={emptyTextStyle}>Keine Abos gefunden.</p>
        ) : (
          <>
            <div className="subscriptions-mobile-list" style={mobileListStyle}>
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} style={mobileCardStyle}>
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>User ID</div>
                      <div style={mobileValueStrongStyle}>{sub.user_id}</div>
                    </div>

                    <span style={getStatusBadgeStyle(sub.status)}>{sub.status}</span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="Variante" value={sub.variant} />
                    <InfoItem
                      label="Affiliate"
                      value={sub.is_affiliate ? "Ja" : "Nein"}
                    />
                    <InfoItem label="Provider" value={sub.provider || "—"} />
                    <InfoItem
                      label="Preis"
                      value={formatMoney(sub.price_eur || 0)}
                    />
                    <InfoItem
                      label="Started At"
                      value={formatDate(sub.started_at)}
                    />
                    <InfoItem
                      label="Expires At"
                      value={formatDate(sub.expires_at)}
                    />
                    <InfoItem
                      label="Created At"
                      value={formatDate(sub.created_at)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="subscriptions-desktop-table" style={desktopTableWrapperStyle}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1250px",
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
                      <td style={tableCellStyle}>
                        <span style={getStatusBadgeStyle(sub.status)}>{sub.status}</span>
                      </td>
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

function getStatusBadgeStyle(status: string): CSSProperties {
  const baseStyle: CSSProperties = {
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  if (status === "active") {
    return {
      ...baseStyle,
      background: "#163322",
      color: "#86efac",
    };
  }

  if (status === "trialing") {
    return {
      ...baseStyle,
      background: "#10233a",
      color: "#93c5fd",
    };
  }

  if (status === "expired") {
    return {
      ...baseStyle,
      background: "#3a2a10",
      color: "#fcd34d",
    };
  }

  if (status === "cancelled") {
    return {
      ...baseStyle,
      background: "#3a1111",
      color: "#fca5a5",
    };
  }

  return {
    ...baseStyle,
    background: "#27312d",
    color: "#cfe0d6",
  };
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

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#cfe0d6",
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

const emptyTextStyle: CSSProperties = {
  color: "#94a39b",
  margin: 0,
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

const mobileCardTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const mobileLabelStyle: CSSProperties = {
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "4px",
};

const mobileValueStrongStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#e7f1eb",
  wordBreak: "break-word",
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