"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type JsonMap = Record<string, unknown>;

type AffiliateRow = {
  user_id: string;
  username: string | null;
  email: string | null;
  display_name: string | null;
  is_enabled: boolean;
  commission_percent: number | string | null;
  recurring_commission: boolean;
  applies_to_subscriptions: boolean;
  applies_to_coin_purchases: boolean;
  minimum_payout_eur: number | string | null;
  admin_note: string | null;
  code: string | null;
  paid_referrals: number | string | null;
  open_balance_eur: number | string | null;
  reserved_balance_eur: number | string | null;
  paid_eur: number | string | null;
  total_earned_eur: number | string | null;
  created_at: string | null;
  updated_at: string | null;
};

type PayoutRow = {
  id: string;
  affiliate_user_id: string;
  username: string | null;
  email: string | null;
  amount_eur: number | string | null;
  amount_cents: number | string | null;
  status: string | null;
  requested_at: string | null;
  processed_at: string | null;
  admin_note: string | null;
  commission_count: number | string | null;
};

type FilterMode = "all" | "enabled" | "disabled";

type PayoutAction = "paid" | "rejected";

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [payoutBusyId, setPayoutBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const [affiliatesResult, payoutsResult] = await Promise.all([
      supabase.rpc("admin_list_affiliates"),
      supabase.rpc("admin_list_affiliate_payouts"),
    ]);

    if (affiliatesResult.error) {
      setError(affiliatesResult.error.message || "Affiliates konnten nicht geladen werden.");
      setAffiliates([]);
    } else {
      setAffiliates((affiliatesResult.data as AffiliateRow[]) || []);
    }

    if (payoutsResult.error) {
      setError((current) => current || payoutsResult.error?.message || "Auszahlungen konnten nicht geladen werden.");
      setPayouts([]);
    } else {
      setPayouts((payoutsResult.data as PayoutRow[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const visibleAffiliates = useMemo(() => {
    const term = search.trim().toLowerCase();

    return affiliates.filter((affiliate) => {
      if (filter === "enabled" && !affiliate.is_enabled) return false;
      if (filter === "disabled" && affiliate.is_enabled) return false;
      if (!term) return true;

      return [
        affiliate.display_name,
        affiliate.username,
        affiliate.email,
        affiliate.code,
        affiliate.admin_note,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [affiliates, filter, search]);

  const stats = useMemo(() => {
    return affiliates.reduce(
      (acc, affiliate) => {
        acc.all += 1;
        if (affiliate.is_enabled) acc.enabled += 1;
        acc.open += numberValue(affiliate.open_balance_eur);
        acc.reserved += numberValue(affiliate.reserved_balance_eur);
        acc.paid += numberValue(affiliate.paid_eur);
        acc.total += numberValue(affiliate.total_earned_eur);
        acc.paidReferrals += numberValue(affiliate.paid_referrals);
        return acc;
      },
      {
        all: 0,
        enabled: 0,
        open: 0,
        reserved: 0,
        paid: 0,
        total: 0,
        paidReferrals: 0,
      },
    );
  }, [affiliates]);

  const requestedPayouts = useMemo(
    () => payouts.filter((payout) => normalize(payout.status) === "requested"),
    [payouts],
  );

  async function decidePayout(payout: PayoutRow, action: PayoutAction) {
    const label = action === "paid" ? "als ausgezahlt markieren" : "ablehnen";
    const accepted = window.confirm(
      `Auszahlung über ${formatMoney(numberValue(payout.amount_eur))} ${label}?`,
    );
    if (!accepted) return;

    setPayoutBusyId(payout.id);
    setMessage(null);
    setError(null);

    const { error: rpcError } = await supabase.rpc("admin_decide_affiliate_payout", {
      p_payout_id: payout.id,
      p_action: action,
      p_admin_note: "",
    });

    if (rpcError) {
      setError(rpcError.message || "Auszahlung konnte nicht aktualisiert werden.");
      setPayoutBusyId(null);
      return;
    }

    setMessage(
      action === "paid"
        ? "Auszahlung wurde als ausgezahlt markiert."
        : "Auszahlung wurde abgelehnt; die Provisionen sind wieder offen.",
    );
    setPayoutBusyId(null);
    await load();
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Affiliates</h1>
          <p style={subtitleStyle}>
            Partner freischalten, individuelle Provisionen prüfen und Auszahlungen manuell bearbeiten.
          </p>
        </div>
        <button type="button" style={secondaryButtonStyle} onClick={load} disabled={loading}>
          {loading ? "Lade..." : "Neu laden"}
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}
      {message && <div style={successBoxStyle}>{message}</div>}

      <div style={kpiGridStyle}>
        <Kpi title="Partner gesamt" value={String(stats.all)} />
        <Kpi title="Aktive Partner" value={String(stats.enabled)} accent="green" />
        <Kpi title="Paid Referrals" value={formatNumber(stats.paidReferrals)} />
        <Kpi title="Offene Provisionen" value={formatMoney(stats.open)} accent="gold" />
        <Kpi title="Auszahlung angefragt" value={formatMoney(stats.reserved)} accent="gold" />
        <Kpi title="Bereits ausgezahlt" value={formatMoney(stats.paid)} />
        <Kpi title="Gesamt verdient" value={formatMoney(stats.total)} accent="green" />
      </div>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Partner</h2>
            <p style={sectionTextStyle}>
              Neuen Partner aktivierst du direkt in den User Details. Dort setzt du Code, Prozentwert und Verlängerungsregel.
            </p>
          </div>
          <span style={countStyle}>{loading ? "Lade..." : `${visibleAffiliates.length} Partner`}</span>
        </div>

        <div style={filterGridStyle}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, E-Mail, Code oder Notiz suchen"
            style={inputStyle}
          />
          <select value={filter} onChange={(event) => setFilter(event.target.value as FilterMode)} style={inputStyle}>
            <option value="all">Alle Partner</option>
            <option value="enabled">Nur aktiv</option>
            <option value="disabled">Nur deaktiviert</option>
          </select>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Affiliates werden geladen...</p>
        ) : visibleAffiliates.length === 0 ? (
          <p style={emptyTextStyle}>
            Noch keine Affiliates vorhanden. Öffne einen Nutzer unter Users und schalte dort Affiliate-Zugang frei.
          </p>
        ) : (
          <div style={affiliateGridStyle}>
            {visibleAffiliates.map((affiliate) => (
              <AffiliateCard key={affiliate.user_id} affiliate={affiliate} />
            ))}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Offene Auszahlungsanfragen</h2>
            <p style={sectionTextStyle}>
              Bei „Ausgezahlt“ werden die reservierten Provisionen endgültig als bezahlt markiert. Bei „Ablehnen“ werden sie wieder offen.
            </p>
          </div>
          <span style={countStyle}>{requestedPayouts.length} angefragt</span>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Auszahlungen werden geladen...</p>
        ) : requestedPayouts.length === 0 ? (
          <p style={emptyTextStyle}>Aktuell keine offenen Auszahlungsanfragen.</p>
        ) : (
          <div style={payoutListStyle}>
            {requestedPayouts.map((payout) => (
              <div key={payout.id} style={payoutRowStyle}>
                <div>
                  <strong style={payoutNameStyle}>{payout.username || payout.email || "Affiliate"}</strong>
                  <div style={mutedStyle}>
                    Angefragt: {formatDate(payout.requested_at)} · {formatNumber(numberValue(payout.commission_count))} Provisionen
                  </div>
                </div>
                <div style={payoutRightStyle}>
                  <strong style={payoutAmountStyle}>{formatMoney(numberValue(payout.amount_eur))}</strong>
                  <div style={buttonRowStyle}>
                    <button
                      type="button"
                      style={paidButtonStyle}
                      disabled={payoutBusyId === payout.id}
                      onClick={() => decidePayout(payout, "paid")}
                    >
                      Ausgezahlt
                    </button>
                    <button
                      type="button"
                      style={rejectButtonStyle}
                      disabled={payoutBusyId === payout.id}
                      onClick={() => decidePayout(payout, "rejected")}
                    >
                      Ablehnen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Auszahlungsverlauf</h2>
            <p style={sectionTextStyle}>Die letzten manuellen Auszahlungen und Entscheidungen.</p>
          </div>
        </div>

        {payouts.length === 0 ? (
          <p style={emptyTextStyle}>Noch keine Auszahlungshistorie vorhanden.</p>
        ) : (
          <div style={historyListStyle}>
            {payouts.slice(0, 30).map((payout) => (
              <div key={payout.id} style={historyRowStyle}>
                <div>
                  <strong style={payoutNameStyle}>{payout.username || payout.email || "Affiliate"}</strong>
                  <div style={mutedStyle}>{formatDate(payout.requested_at)}</div>
                </div>
                <div style={historyRightStyle}>
                  <StatusBadge status={normalize(payout.status)} />
                  <strong style={payoutAmountStyle}>{formatMoney(numberValue(payout.amount_eur))}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AffiliateCard({ affiliate }: { affiliate: AffiliateRow }) {
  return (
    <div style={affiliateCardStyle}>
      <div style={affiliateCardHeaderStyle}>
        <div>
          <strong style={affiliateNameStyle}>
            {affiliate.display_name || affiliate.username || affiliate.email || "Affiliate"}
          </strong>
          <div style={mutedStyle}>{affiliate.email || affiliate.user_id}</div>
        </div>
        <StatusBadge status={affiliate.is_enabled ? "active" : "disabled"} />
      </div>

      <div style={affiliateCodeStyle}>{affiliate.code || "Kein Code"}</div>

      <div style={miniGridStyle}>
        <MiniMetric label="Provision" value={`${numberValue(affiliate.commission_percent).toFixed(0)} %`} />
        <MiniMetric label="Verlängerungen" value={affiliate.recurring_commission ? "Ja" : "Nein"} />
        <MiniMetric label="Paid Referrals" value={formatNumber(numberValue(affiliate.paid_referrals))} />
        <MiniMetric label="Offen" value={formatMoney(numberValue(affiliate.open_balance_eur))} />
      </div>

      <div style={affiliateCardFooterStyle}>
        <Link href={`/admin/users/${affiliate.user_id}`} style={detailsLinkStyle}>User Details öffnen</Link>
        <span style={mutedStyle}>Gesamt: {formatMoney(numberValue(affiliate.total_earned_eur))}</span>
      </div>
    </div>
  );
}

function Kpi({ title, value, accent = "default" }: { title: string; value: string; accent?: "default" | "green" | "gold" }) {
  const color = accent === "green" ? "#86efac" : accent === "gold" ? "#fde68a" : "#e7f1eb";
  return (
    <div style={kpiStyle}>
      <span style={kpiLabelStyle}>{title}</span>
      <strong style={{ ...kpiValueStyle, color }}>{value}</strong>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniMetricStyle}>
      <span style={miniLabelStyle}>{label}</span>
      <strong style={miniValueStyle}>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normal = normalize(status);
  const style = normal === "active" || normal === "paid"
    ? { background: "#163322", borderColor: "#166534", color: "#bbf7d0" }
    : normal === "requested"
    ? { background: "#3a2b10", borderColor: "#8a6518", color: "#fde68a" }
    : normal === "rejected"
    ? { background: "#331717", borderColor: "#7f1d1d", color: "#fecaca" }
    : { background: "#1b2520", borderColor: "#34443c", color: "#cfe0d6" };

  const label = normal === "active" ? "Aktiv"
    : normal === "disabled" ? "Aus"
    : normal === "requested" ? "Angefragt"
    : normal === "paid" ? "Ausgezahlt"
    : normal === "rejected" ? "Abgelehnt"
    : normal || "—";

  return <span style={{ ...statusBadgeStyle, ...style }}>{label}</span>;
}

function numberValue(value: number | string | null | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

function formatMoney(value: number): string {
  return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("de-DE");
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("de-DE");
}

const pageStyle: CSSProperties = { width: "100%" };
const headerStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "20px" };
const titleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "30px" };
const subtitleStyle: CSSProperties = { margin: "8px 0 0 0", color: "#94a39b", lineHeight: 1.5, maxWidth: "800px" };
const errorBoxStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", color: "#fecaca", borderRadius: "14px", padding: "14px", marginBottom: "16px" };
const successBoxStyle: CSSProperties = { background: "#163322", border: "1px solid #166534", color: "#bbf7d0", borderRadius: "14px", padding: "14px", marginBottom: "16px" };
const secondaryButtonStyle: CSSProperties = { minHeight: "42px", padding: "9px 14px", borderRadius: "12px", border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", fontWeight: 800, cursor: "pointer" };
const kpiGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px", marginBottom: "20px" };
const kpiStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "16px", padding: "17px", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const kpiLabelStyle: CSSProperties = { display: "block", color: "#94a39b", fontSize: "13px", marginBottom: "9px" };
const kpiValueStyle: CSSProperties = { display: "block", fontSize: "24px", wordBreak: "break-word" };
const cardStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: "20px" };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "20px" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const countStyle: CSSProperties = { color: "#cfe0d6", background: "#101714", border: "1px solid #27312d", borderRadius: "999px", padding: "7px 10px", fontSize: "12px", fontWeight: 800 };
const filterGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(180px, 260px)", gap: "12px", marginBottom: "16px" };
const inputStyle: CSSProperties = { width: "100%", minHeight: "44px", boxSizing: "border-box", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", padding: "10px 12px", outline: "none" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5 };
const affiliateGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" };
const affiliateCardStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "16px", padding: "16px" };
const affiliateCardHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" };
const affiliateNameStyle: CSSProperties = { display: "block", color: "#e7f1eb", fontSize: "16px", marginBottom: "5px" };
const mutedStyle: CSSProperties = { color: "#94a39b", fontSize: "12px", lineHeight: 1.4, wordBreak: "break-word" };
const statusBadgeStyle: CSSProperties = { display: "inline-flex", border: "1px solid", borderRadius: "999px", padding: "5px 9px", fontSize: "11px", fontWeight: 900, whiteSpace: "nowrap" };
const affiliateCodeStyle: CSSProperties = { color: "#fde68a", fontWeight: 900, letterSpacing: "0.12em", fontSize: "18px", padding: "12px 0" };
const miniGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" };
const miniMetricStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "12px", padding: "10px" };
const miniLabelStyle: CSSProperties = { display: "block", color: "#94a39b", fontSize: "11px", marginBottom: "5px" };
const miniValueStyle: CSSProperties = { color: "#e7f1eb", fontSize: "14px" };
const affiliateCardFooterStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid #27312d", marginTop: "14px", paddingTop: "12px" };
const detailsLinkStyle: CSSProperties = { color: "#86efac", textDecoration: "none", fontWeight: 800, fontSize: "13px" };
const payoutListStyle: CSSProperties = { display: "grid", gap: "10px" };
const payoutRowStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", background: "#101714", border: "1px solid #27312d", borderRadius: "14px", padding: "14px" };
const payoutNameStyle: CSSProperties = { display: "block", color: "#e7f1eb", marginBottom: "5px" };
const payoutRightStyle: CSSProperties = { display: "grid", justifyItems: "end", gap: "9px" };
const payoutAmountStyle: CSSProperties = { color: "#fde68a", fontSize: "16px" };
const buttonRowStyle: CSSProperties = { display: "flex", gap: "8px", flexWrap: "wrap" };
const paidButtonStyle: CSSProperties = { border: "1px solid #166534", background: "#163322", color: "#bbf7d0", borderRadius: "10px", padding: "8px 10px", fontWeight: 900, cursor: "pointer" };
const rejectButtonStyle: CSSProperties = { border: "1px solid #7f1d1d", background: "#331717", color: "#fecaca", borderRadius: "10px", padding: "8px 10px", fontWeight: 900, cursor: "pointer" };
const historyListStyle: CSSProperties = { display: "grid", gap: "8px" };
const historyRowStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", background: "#101714", border: "1px solid #27312d", borderRadius: "12px", padding: "12px" };
const historyRightStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" };
