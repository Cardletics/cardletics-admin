"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type Subscription = {
  id: string;
  user_id: string;
  user_email: string | null;
  username: string | null;
  variant: string | null;
  variant_label: string | null;
  status: string | null;
  started_at: string | null;
  expires_at: string | null;
  provider: string | null;
  is_affiliate: boolean | null;
  price_eur: number | null;
  created_at: string;
};

type VariantFilter = "all" | "free" | "basic" | "pro" | "elite" | "master";
type StatusFilter =
  | "all"
  | "active"
  | "inactive"
  | "trialing"
  | "expired"
  | "cancelled"
  | "unknown";
type AffiliateFilter = "all" | "affiliate" | "nonAffiliate";
type SortOrder =
  | "newest"
  | "oldest"
  | "priceHigh"
  | "priceLow"
  | "expiresSoon"
  | "variant";

const VARIANTS: { value: VariantFilter; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite" },
  { value: "master", label: "Master" },
];

const ACTIVE_STATUSES = ["active", "trialing"];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [variantFilter, setVariantFilter] = useState<VariantFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [affiliateFilter, setAffiliateFilter] = useState<AffiliateFilter>("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let cancelled = false;

    async function loadSubscriptions() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase.rpc("admin_list_subscriptions");

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden der Subscriptions:", error);
        setSubscriptions([]);
        setLoadError(error.message || "Subscriptions konnten nicht geladen werden.");
      } else {
        setSubscriptions((data as Subscription[]) || []);
      }

      setLoading(false);
    }

    loadSubscriptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const providerOptions = useMemo(() => {
    const providers = subscriptions
      .map((sub) => sub.provider)
      .filter((provider): provider is string => !!provider && provider.trim() !== "");

    return Array.from(new Set(providers)).sort();
  }, [subscriptions]);

  const stats = useMemo(() => {
    const active = subscriptions.filter((sub) =>
      ACTIVE_STATUSES.includes(normalizeStatus(sub.status))
    );

    const paidActive = active.filter((sub) => {
      const variant = normalizeVariant(sub.variant);
      return variant !== "free";
    });

    const activeRevenue = paidActive.reduce((sum, sub) => {
      return sum + safeNumber(sub.price_eur);
    }, 0);

    const totalRevenue = subscriptions.reduce((sum, sub) => {
      return sum + safeNumber(sub.price_eur);
    }, 0);

    const affiliate = subscriptions.filter((sub) => sub.is_affiliate === true).length;

    return {
      total: subscriptions.length,
      active: active.length,
      paidActive: paidActive.length,
      affiliate,
      totalRevenue,
      activeRevenue,
      free: countVariant(subscriptions, "free"),
      basic: countVariant(subscriptions, "basic"),
      pro: countVariant(subscriptions, "pro"),
      elite: countVariant(subscriptions, "elite"),
      master: countVariant(subscriptions, "master"),
    };
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (search.trim() !== "") {
      const value = search.trim().toLowerCase();

      result = result.filter((sub) => {
        const userId = sub.user_id.toLowerCase();
        const email = (sub.user_email || "").toLowerCase();
        const username = (sub.username || "").toLowerCase();
        const variant = normalizeVariant(sub.variant);
        const status = normalizeStatus(sub.status);
        const provider = (sub.provider || "").toLowerCase();

        return (
          userId.includes(value) ||
          email.includes(value) ||
          username.includes(value) ||
          variant.includes(value) ||
          status.includes(value) ||
          provider.includes(value)
        );
      });
    }

    if (variantFilter !== "all") {
      result = result.filter((sub) => normalizeVariant(sub.variant) === variantFilter);
    }

    if (statusFilter === "active") {
      result = result.filter((sub) =>
        ACTIVE_STATUSES.includes(normalizeStatus(sub.status))
      );
    }

    if (statusFilter === "inactive") {
      result = result.filter(
        (sub) => !ACTIVE_STATUSES.includes(normalizeStatus(sub.status))
      );
    }

    if (
      statusFilter !== "all" &&
      statusFilter !== "active" &&
      statusFilter !== "inactive"
    ) {
      result = result.filter((sub) => normalizeStatus(sub.status) === statusFilter);
    }

    if (affiliateFilter === "affiliate") {
      result = result.filter((sub) => sub.is_affiliate === true);
    }

    if (affiliateFilter === "nonAffiliate") {
      result = result.filter((sub) => sub.is_affiliate !== true);
    }

    if (providerFilter !== "all") {
      result = result.filter((sub) => (sub.provider || "") === providerFilter);
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return dateValue(b.created_at) - dateValue(a.created_at);
      }

      if (sortOrder === "oldest") {
        return dateValue(a.created_at) - dateValue(b.created_at);
      }

      if (sortOrder === "priceHigh") {
        return safeNumber(b.price_eur) - safeNumber(a.price_eur);
      }

      if (sortOrder === "priceLow") {
        return safeNumber(a.price_eur) - safeNumber(b.price_eur);
      }

      if (sortOrder === "expiresSoon") {
        return dateValue(a.expires_at) - dateValue(b.expires_at);
      }

      if (sortOrder === "variant") {
        return normalizeVariant(a.variant).localeCompare(normalizeVariant(b.variant));
      }

      return 0;
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

  const filteredRevenue = filteredSubscriptions.reduce((sum, sub) => {
    return sum + safeNumber(sub.price_eur);
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
      <style jsx global>{`
        @media (min-width: 900px) {
          .subscriptions-mobile-list {
            display: none !important;
          }

          .subscriptions-desktop-table {
            display: block !important;
          }
        }
      `}</style>

      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Subscriptions</h1>
        <p style={pageSubtitleStyle}>
          Übersicht über alle Abos, Status, Affiliate, Provider und Umsatz.
        </p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard title="Alle Abos" value={loading ? "..." : String(stats.total)} />
        <KpiCard title="Aktive Abos" value={loading ? "..." : String(stats.active)} />
        <KpiCard
          title="Aktive bezahlt"
          value={loading ? "..." : String(stats.paidActive)}
        />
        <KpiCard
          title="Affiliate Abos"
          value={loading ? "..." : String(stats.affiliate)}
        />
        <KpiCard
          title="Aktiver Monatswert"
          value={loading ? "..." : formatMoney(stats.activeRevenue)}
        />
        <KpiCard
          title="Gesamtwert Einträge"
          value={loading ? "..." : formatMoney(stats.totalRevenue)}
        />
        <KpiCard
          title="Gefilterte Einträge"
          value={loading ? "..." : String(filteredSubscriptions.length)}
        />
        <KpiCard
          title="Gefilterter Umsatz"
          value={loading ? "..." : formatMoney(filteredRevenue)}
        />
      </div>

      <div style={variantGridStyle}>
        <MiniStat title="Free" value={loading ? "..." : String(stats.free)} />
        <MiniStat title="Basic" value={loading ? "..." : String(stats.basic)} />
        <MiniStat title="Pro" value={loading ? "..." : String(stats.pro)} />
        <MiniStat title="Elite" value={loading ? "..." : String(stats.elite)} />
        <MiniStat title="Master" value={loading ? "..." : String(stats.master)} />
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden der Subscriptions</strong>
          <p style={errorTextStyle}>{loadError}</p>
          <p style={errorHintStyle}>
            Prüfe, ob die RPC <strong>admin_list_subscriptions</strong> existiert
            und du mit einem Adminaccount eingeloggt bist.
          </p>
        </div>
      )}

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
              placeholder="User, E-Mail, Username, Variante, Status, Provider"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Variante</label>
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value as VariantFilter)}
              style={inputStyle}
            >
              <option value="all">Alle Varianten</option>
              {VARIANTS.map((variant) => (
                <option key={variant.value} value={variant.value}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="active">Aktiv inkl. Trial</option>
              <option value="inactive">Inaktiv</option>
              <option value="trialing">Nur Trialing</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Affiliate</label>
            <select
              value={affiliateFilter}
              onChange={(e) =>
                setAffiliateFilter(e.target.value as AffiliateFilter)
              }
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
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              style={inputStyle}
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="priceHigh">Preis hoch zu niedrig</option>
              <option value="priceLow">Preis niedrig zu hoch</option>
              <option value="expiresSoon">Läuft bald ab</option>
              <option value="variant">Nach Variante</option>
            </select>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
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
                      <div style={mobileLabelStyle}>User</div>
                      <div style={mobileValueStrongStyle}>
                        {sub.username || sub.user_email || sub.user_id}
                      </div>
                      <div style={mobileEmailStyle}>
                        {sub.user_email || "Keine E-Mail"}
                      </div>
                    </div>

                    <span style={getStatusBadgeStyle(sub.status)}>
                      {normalizeStatus(sub.status)}
                    </span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="Variante" value={variantLabel(sub)} />
                    <InfoItem
                      label="Preis"
                      value={formatMoney(safeNumber(sub.price_eur))}
                    />
                    <InfoItem
                      label="Affiliate"
                      value={sub.is_affiliate ? "Ja" : "Nein"}
                    />
                    <InfoItem label="Provider" value={sub.provider || "—"} />
                    <InfoItem label="Started" value={formatDate(sub.started_at)} />
                    <InfoItem label="Expires" value={formatDate(sub.expires_at)} />
                    <InfoItem label="Created" value={formatDate(sub.created_at)} />
                    <InfoItem label="User ID" value={sub.user_id} />
                  </div>

                  <div style={mobileButtonRowStyle}>
                    <Link href={`/admin/users/${sub.user_id}`} style={detailsButtonStyle}>
                      User Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="subscriptions-desktop-table"
              style={desktopTableWrapperStyle}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1350px",
                }}
              >
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>E-Mail</th>
                    <th style={tableHeaderStyle}>Variante</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Preis</th>
                    <th style={tableHeaderStyle}>Affiliate</th>
                    <th style={tableHeaderStyle}>Provider</th>
                    <th style={tableHeaderStyle}>Started</th>
                    <th style={tableHeaderStyle}>Expires</th>
                    <th style={tableHeaderStyle}>Created</th>
                    <th style={tableHeaderStyle}>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} style={{ borderTop: "1px solid #27312d" }}>
                      <td style={tableCellStyle}>{sub.username || "—"}</td>
                      <td style={tableCellStyle}>{sub.user_email || "—"}</td>
                      <td style={tableCellStyle}>{variantLabel(sub)}</td>
                      <td style={tableCellStyle}>
                        <span style={getStatusBadgeStyle(sub.status)}>
                          {normalizeStatus(sub.status)}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        {formatMoney(safeNumber(sub.price_eur))}
                      </td>
                      <td style={tableCellStyle}>
                        {sub.is_affiliate ? "Ja" : "Nein"}
                      </td>
                      <td style={tableCellStyle}>{sub.provider || "—"}</td>
                      <td style={tableCellStyle}>{formatDate(sub.started_at)}</td>
                      <td style={tableCellStyle}>{formatDate(sub.expires_at)}</td>
                      <td style={tableCellStyle}>{formatDate(sub.created_at)}</td>
                      <td style={tableCellStyle}>
                        <Link href={`/admin/users/${sub.user_id}`} style={tableButtonStyle}>
                          Details
                        </Link>
                      </td>
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

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div style={miniStatStyle}>
      <span style={miniTitleStyle}>{title}</span>
      <strong style={miniValueStyle}>{value}</strong>
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

function safeNumber(value: number | null | undefined) {
  if (typeof value !== "number") return 0;
  if (Number.isNaN(value)) return 0;
  return value;
}

function dateValue(value: string | null | undefined) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeVariant(value: string | null | undefined) {
  const variant = (value || "free").toLowerCase().trim();

  if (variant === "basic") return "basic";
  if (variant === "pro") return "pro";
  if (variant === "elite") return "elite";
  if (variant === "master") return "master";
  return "free";
}

function normalizeStatus(value: string | null | undefined) {
  const status = (value || "unknown").toLowerCase().trim();

  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "expired") return "expired";
  if (status === "cancelled") return "cancelled";
  if (status === "free") return "free";
  return "unknown";
}

function countVariant(subscriptions: Subscription[], variant: string) {
  return subscriptions.filter((sub) => normalizeVariant(sub.variant) === variant)
    .length;
}

function variantLabel(sub: Subscription) {
  if (sub.variant_label && sub.variant_label.trim() !== "") {
    return sub.variant_label;
  }

  const variant = normalizeVariant(sub.variant);
  return variant.charAt(0).toUpperCase() + variant.slice(1);
}

function getStatusBadgeStyle(statusValue: string | null | undefined): CSSProperties {
  const status = normalizeStatus(statusValue);

  if (status === "active") return activeBadgeStyle;
  if (status === "trialing") return trialBadgeStyle;
  if (status === "cancelled") return cancelledBadgeStyle;
  if (status === "expired") return expiredBadgeStyle;
  return unknownBadgeStyle;
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "14px",
};

const variantGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "10px",
  marginBottom: "20px",
};

const kpiCardStyle: CSSProperties = {
  background: "#171f1c",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const kpiTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: "#94a39b",
};

const kpiValueStyle: CSSProperties = {
  margin: "10px 0 0 0",
  fontSize: "22px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const miniStatStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  background: "#111814",
  border: "1px solid #27312d",
  borderRadius: "14px",
  padding: "12px 14px",
};

const miniTitleStyle: CSSProperties = {
  color: "#94a39b",
  fontSize: "13px",
  fontWeight: 800,
};

const miniValueStyle: CSSProperties = {
  color: "#e7f1eb",
  fontSize: "16px",
};

const errorCardStyle: CSSProperties = {
  background: "#331717",
  border: "1px solid #7f1d1d",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "20px",
  color: "#fecaca",
};

const errorTextStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#fecaca",
};

const errorHintStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#fca5a5",
  lineHeight: 1.5,
};

const cardStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginBottom: "20px",
};

const tableCardStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
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
  fontSize: "18px",
  fontWeight: 700,
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const mobileEmailStyle: CSSProperties = {
  marginTop: "4px",
  fontSize: "12px",
  color: "#94a39b",
  wordBreak: "break-word",
};

const mobileInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const mobileButtonRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "14px",
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
  whiteSpace: "nowrap",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  color: "#e7f1eb",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const tableButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "8px 12px",
  borderRadius: "10px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
};

const detailsButtonStyle: CSSProperties = {
  ...tableButtonStyle,
  minHeight: "38px",
};

const activeBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#163322",
  color: "#86efac",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const trialBadgeStyle: CSSProperties = {
  ...activeBadgeStyle,
  background: "#172554",
  color: "#93c5fd",
};

const cancelledBadgeStyle: CSSProperties = {
  ...activeBadgeStyle,
  background: "#2f1b1b",
  color: "#fca5a5",
};

const expiredBadgeStyle: CSSProperties = {
  ...activeBadgeStyle,
  background: "#292524",
  color: "#fdba74",
};

const unknownBadgeStyle: CSSProperties = {
  ...activeBadgeStyle,
  background: "#1f2937",
  color: "#d1d5db",
};
