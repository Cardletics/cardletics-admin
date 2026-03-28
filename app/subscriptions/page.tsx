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
    <div>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Subscriptions</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Übersicht über alle Abos, Status, Affiliate und Umsatz.
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
        <h3 style={{ marginTop: 0 }}>Filter</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>Abo-Tabelle</h3>
          <span style={{ color: "#6b7280" }}>
            {loading ? "Lade..." : `${filteredSubscriptions.length} Einträge`}
          </span>
        </div>

        {loading ? (
          <p>Lade Abos...</p>
        ) : filteredSubscriptions.length === 0 ? (
          <p>Keine Abos gefunden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1250px",
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

function getStatusBadgeStyle(status: string): CSSProperties {
  const baseStyle: CSSProperties = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  };

  if (status === "active") {
    return {
      ...baseStyle,
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "trialing") {
    return {
      ...baseStyle,
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (status === "expired") {
    return {
      ...baseStyle,
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  if (status === "cancelled") {
    return {
      ...baseStyle,
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  return {
    ...baseStyle,
    background: "#e5e7eb",
    color: "#374151",
  };
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