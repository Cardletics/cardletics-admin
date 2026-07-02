"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { supabase } from "../../../lib/supabase";

type RevenueKind = "subscription" | "coin_purchase";
type DateFilter = "all" | "today" | "7d" | "30d" | "90d" | "month" | "year";
type NetPeriod = "today" | "month" | "year" | "total";

type RevenueEvent = {
  id: string;
  source_table: string;
  kind: RevenueKind;
  label: string | null;
  user_id: string;
  user_email: string | null;
  username: string | null;
  provider: string | null;
  status: string | null;
  gross_eur: number | string | null;
  vat_estimated_eur: number | string | null;
  store_fee_eur: number | string | null;
  net_before_affiliate_eur: number | string | null;
  affiliate_commission_eur: number | string | null;
  net_after_affiliate_eur: number | string | null;
  affiliate_code: string | null;
  affiliate_username: string | null;
  is_estimate: boolean | null;
  created_at: string;
};

type NetOverview = {
  period: string;
  timezone: string;
  period_start: string | null;
  period_end: string | null;
  gross_eur: number | string | null;
  vat_estimated_eur: number | string | null;
  store_fee_eur: number | string | null;
  affiliate_commission_eur: number | string | null;
  net_profit_eur: number | string | null;
  subscription_net_eur: number | string | null;
  coin_net_eur: number | string | null;
  payment_events: number | string | null;
  subscription_events: number | string | null;
  coin_purchase_events: number | string | null;
  estimated_events: number | string | null;
  daily_net_chart: unknown[] | null;
};

const emptyNetOverview: NetOverview = {
  period: "month",
  timezone: "Europe/Berlin",
  period_start: null,
  period_end: null,
  gross_eur: 0,
  vat_estimated_eur: 0,
  store_fee_eur: 0,
  affiliate_commission_eur: 0,
  net_profit_eur: 0,
  subscription_net_eur: 0,
  coin_net_eur: 0,
  payment_events: 0,
  subscription_events: 0,
  coin_purchase_events: 0,
  estimated_events: 0,
  daily_net_chart: [],
};

const netPeriodOptions: { value: NetPeriod; label: string }[] = [
  { value: "today", label: "Heute" },
  { value: "month", label: "Monat" },
  { value: "year", label: "Jahr" },
  { value: "total", label: "Gesamt" },
];

type FeeRule = {
  id: string;
  provider: "google_play" | "app_store";
  product_kind: "subscription" | "coin_purchase";
  effective_from: string;
  effective_to: string | null;
  store_fee_percent: number | string;
  vat_percent: number | string;
  active: boolean;
  note: string | null;
};

type RuleDraft = {
  provider: "google_play" | "app_store";
  productKind: "subscription" | "coin_purchase";
  effectiveFrom: string;
  effectiveTo: string;
  storeFeePercent: string;
  vatPercent: string;
  active: boolean;
  note: string;
};

const emptyRuleDraft: RuleDraft = {
  provider: "google_play",
  productKind: "subscription",
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveTo: "",
  storeFeePercent: "10",
  vatPercent: "19",
  active: true,
  note: "",
};

export default function RevenuePage() {
  const [events, setEvents] = useState<RevenueEvent[]>([]);
  const [rules, setRules] = useState<FeeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRule, setSavingRule] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<"all" | RevenueKind>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [ruleDraft, setRuleDraft] = useState<RuleDraft>(emptyRuleDraft);

  const [netPeriod, setNetPeriod] = useState<NetPeriod>("month");
  const [netOverview, setNetOverview] = useState<NetOverview>(emptyNetOverview);
  const [netLoading, setNetLoading] = useState(true);
  const [netError, setNetError] = useState<string | null>(null);
  const [netRefreshToken, setNetRefreshToken] = useState(0);

  async function load() {
    setLoading(true);
    setError(null);

    const [eventsResult, rulesResult] = await Promise.all([
      supabase.rpc("admin_list_revenue_events_v2"),
      supabase.rpc("admin_list_revenue_fee_rules"),
    ]);

    if (eventsResult.error) {
      setEvents([]);
      setError(eventsResult.error.message || "Revenue-Daten konnten nicht geladen werden.");
    } else {
      setEvents((eventsResult.data as RevenueEvent[]) || []);
    }

    if (rulesResult.error) {
      setRules([]);
      setError((current) => current || rulesResult.error?.message || "Gebührenregeln konnten nicht geladen werden.");
    } else {
      setRules((rulesResult.data as FeeRule[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadNetOverview() {
      setNetLoading(true);
      setNetError(null);

      const { data, error } = await supabase.rpc("admin_dashboard_net_overview", {
        p_period: netPeriod,
      });

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden des Nettoertrags:", error);
        setNetOverview(emptyNetOverview);
        setNetError(error.message || "Nettoertrag konnte nicht geladen werden.");
      } else {
        const rows = (data as NetOverview[] | null) || [];
        setNetOverview(rows[0] || emptyNetOverview);
      }

      setNetLoading(false);
    }

    void loadNetOverview();

    return () => {
      cancelled = true;
    };
  }, [netPeriod, netRefreshToken]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return events
      .filter((event) => {
        if (providerFilter !== "all" && normalize(event.provider) !== providerFilter) return false;
        if (kindFilter !== "all" && event.kind !== kindFilter) return false;
        if (dateFilter !== "all" && !isInsideDate(event.created_at, dateFilter)) return false;
        if (!term) return true;

        return [
          event.label,
          event.username,
          event.user_email,
          event.provider,
          event.affiliate_code,
          event.affiliate_username,
          event.status,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      })
      .sort((a, b) => dateValue(b.created_at) - dateValue(a.created_at));
  }, [events, search, providerFilter, kindFilter, dateFilter]);

  const totalStats = useMemo(() => financialStats(filteredEvents), [filteredEvents]);
  const googleStats = useMemo(
    () => financialStats(filteredEvents.filter((event) => normalize(event.provider) === "google_play")),
    [filteredEvents],
  );
  const appleStats = useMemo(
    () => financialStats(filteredEvents.filter((event) => normalize(event.provider) === "app_store")),
    [filteredEvents],
  );

  const chartData = useMemo(() => {
    const byDate = new Map<string, { key: string; label: string; net: number; gross: number }>();

    for (const event of filteredEvents) {
      const date = new Date(event.created_at);
      if (Number.isNaN(date.getTime())) continue;
      const key = berlinDateKey(date);
      const item = byDate.get(key) || {
        key,
        label: date.toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit" }),
        net: 0,
        gross: 0,
      };
      item.net += value(event.net_after_affiliate_eur);
      item.gross += value(event.gross_eur);
      byDate.set(key, item);
    }

    return Array.from(byDate.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-31);
  }, [filteredEvents]);

  const maxChartNet = Math.max(1, ...chartData.map((item) => item.net));

  async function saveRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fee = parseInputNumber(ruleDraft.storeFeePercent);
    const vat = parseInputNumber(ruleDraft.vatPercent);

    if (!Number.isFinite(fee) || fee < 0 || fee > 100 || !Number.isFinite(vat) || vat < 0 || vat > 100) {
      setError("Store-Provision und MwSt. müssen zwischen 0 und 100 % liegen.");
      return;
    }

    if (!ruleDraft.effectiveFrom) {
      setError("Bitte ein Gültig-ab-Datum eintragen.");
      return;
    }

    setSavingRule(true);
    setError(null);
    setMessage(null);

    const { error: rpcError } = await supabase.rpc("admin_upsert_revenue_fee_rule", {
      p_provider: ruleDraft.provider,
      p_product_kind: ruleDraft.productKind,
      p_effective_from: ruleDraft.effectiveFrom,
      p_effective_to: ruleDraft.effectiveTo || null,
      p_store_fee_percent: fee,
      p_vat_percent: vat,
      p_active: ruleDraft.active,
      p_note: ruleDraft.note.trim(),
    });

    if (rpcError) {
      setError(rpcError.message || "Gebührenregel konnte nicht gespeichert werden.");
      setSavingRule(false);
      return;
    }

    setMessage("Gebührenregel gespeichert. Neue Zahlungsereignisse verwenden diese Regel ab dem angegebenen Datum.");
    setSavingRule(false);
    await load();
  }

  function useRule(rule: FeeRule) {
    setRuleDraft({
      provider: rule.provider,
      productKind: rule.product_kind,
      effectiveFrom: rule.effective_from,
      effectiveTo: rule.effective_to || "",
      storeFeePercent: String(value(rule.store_fee_percent)),
      vatPercent: String(value(rule.vat_percent)),
      active: rule.active,
      note: rule.note || "",
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Revenue</h1>
          <p style={subtitleStyle}>
            Dein geschätzter Nettoertrag nach MwSt., Google-/Apple-Gebühren und Affiliate-Provisionen – mit allen Zahlungsereignissen im Detail.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void load();
            setNetRefreshToken((current) => current + 1);
          }}
          style={secondaryButtonStyle}
          disabled={loading || netLoading}
        >
          {loading || netLoading ? "Lade..." : "Neu laden"}
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}
      {message && <div style={successBoxStyle}>{message}</div>}
      {netError && (
        <div style={errorBoxStyle}>
          <strong>Fehler beim Laden des Nettoertrags</strong>
          <div style={{ marginTop: "6px" }}>{netError}</div>
          <div style={{ marginTop: "6px", color: "#fca5a5", fontSize: "12px" }}>
            Führe den SQL-Hotfix für <strong>admin_dashboard_net_overview</strong> aus und lade die Seite neu.
          </div>
        </div>
      )}

      <div style={noteStyle}>
        <strong>Schätzung, nicht Store-Abrechnung:</strong> Die Werte werden pro Zahlung mit der jeweils gültigen Gebührenregel gespeichert. Finale Auszahlungen können später über Apple- und Google-Finanzberichte importiert werden.
      </div>

      <NetProfitOverview
        netOverview={netOverview}
        netPeriod={netPeriod}
        netLoading={netLoading}
        onChangePeriod={setNetPeriod}
      />

      <FinancialOverview title="Gefilterte Ereignisse im Detail" stats={totalStats} />

      <div style={providerGridStyle}>
        <FinancialOverview title="Google Play" stats={googleStats} compact />
        <FinancialOverview title="Apple App Store" stats={appleStats} compact />
      </div>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Filter</h2>
            <p style={sectionTextStyle}>Die Tabelle zeigt einzelne Kaufereignisse mit allen Abzügen.</p>
          </div>
          <span style={countStyle}>{loading ? "Lade..." : `${filteredEvents.length} Ereignisse`}</span>
        </div>

        <div style={filterGridStyle}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="User, Produkt, Provider, Affiliate-Code suchen"
            style={inputStyle}
          />
          <select value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)} style={inputStyle}>
            <option value="all">Google + Apple</option>
            <option value="google_play">Nur Google Play</option>
            <option value="app_store">Nur Apple App Store</option>
          </select>
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value as "all" | RevenueKind)} style={inputStyle}>
            <option value="all">Abos + Coin-Käufe</option>
            <option value="subscription">Nur Abos</option>
            <option value="coin_purchase">Nur Coin-Käufe</option>
          </select>
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} style={inputStyle}>
            <option value="all">Gesamter Zeitraum</option>
            <option value="today">Heute</option>
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzte 30 Tage</option>
            <option value="90d">Letzte 90 Tage</option>
            <option value="month">Dieser Monat · Europe/Berlin</option>
            <option value="year">Dieses Jahr · Europe/Berlin</option>
          </select>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Cardletics-Erlös im Verlauf</h2>
            <p style={sectionTextStyle}>Nach geschätzter MwSt., Store-Provision und Affiliate-Provision.</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <p style={emptyTextStyle}>Keine Daten im gewählten Zeitraum.</p>
        ) : (
          <div style={chartGridStyle}>
            {chartData.map((item) => (
              <div key={item.key} style={chartItemStyle}>
                <div style={chartBarShellStyle}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(4, (item.net / maxChartNet) * 100)}%`,
                      background: "linear-gradient(180deg, #86efac, #16a34a)",
                      borderRadius: "9px 9px 0 0",
                    }}
                  />
                </div>
                <strong style={chartLabelStyle}>{item.label}</strong>
                <span style={chartValueStyle}>{formatMoney(item.net)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Revenue-Ereignisse</h2>
            <p style={sectionTextStyle}>„Nettoertrag“ ist der geschätzte Erlös von Cardletics nach MwSt., Store-Gebühren und Affiliate-Provisionen.</p>
          </div>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Revenue-Daten werden geladen...</p>
        ) : filteredEvents.length === 0 ? (
          <p style={emptyTextStyle}>Keine Revenue-Ereignisse gefunden.</p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRowStyle}>
                  <th style={thStyle}>Datum</th>
                  <th style={thStyle}>User / Produkt</th>
                  <th style={thStyle}>Store</th>
                  <th style={rightThStyle}>Brutto</th>
                  <th style={rightThStyle}>MwSt. geschätzt</th>
                  <th style={rightThStyle}>Store-Provision</th>
                  <th style={rightThStyle}>Affiliate</th>
                  <th style={rightThStyle}>Netto</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={`${event.source_table}-${event.id}`} style={tableRowStyle}>
                    <td style={tdStyle}>{formatDate(event.created_at)}</td>
                    <td style={tdStyle}>
                      <Link href={`/admin/users/${event.user_id}`} style={userLinkStyle}>
                        {event.username || event.user_email || "User"}
                      </Link>
                      <div style={mutedStyle}>{event.label || "—"}</div>
                      {event.affiliate_code && (
                        <div style={affiliateTextStyle}>
                          Affiliate: {event.affiliate_code}{event.affiliate_username ? ` · ${event.affiliate_username}` : ""}
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <StoreBadge provider={normalize(event.provider)} />
                      <div style={mutedStyle}>{event.kind === "subscription" ? "Abo" : "Coin-Kauf"}</div>
                    </td>
                    <td style={rightTdStyle}>{formatMoney(value(event.gross_eur))}</td>
                    <td style={rightTdMutedStyle}>−{formatMoney(value(event.vat_estimated_eur))}</td>
                    <td style={rightTdMutedStyle}>−{formatMoney(value(event.store_fee_eur))}</td>
                    <td style={rightTdMutedStyle}>−{formatMoney(value(event.affiliate_commission_eur))}</td>
                    <td style={rightTdNetStyle}>{formatMoney(value(event.net_after_affiliate_eur))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>Gebührenregeln bearbeiten</h2>
            <p style={sectionTextStyle}>
              Hier hinterlegst du zukünftige Schätzwerte. Bereits gespeicherte Zahlungsereignisse behalten ihren damaligen Snapshot.
            </p>
          </div>
        </div>

        <div style={rulesGridStyle}>
          <div style={rulesListStyle}>
            {rules.map((rule) => (
              <button key={rule.id} type="button" onClick={() => useRule(rule)} style={ruleButtonStyle}>
                <strong>{providerLabel(rule.provider)} · {kindLabel(rule.product_kind)}</strong>
                <span>{formatPercent(value(rule.store_fee_percent))} Store · {formatPercent(value(rule.vat_percent))} MwSt.</span>
                <small>ab {formatDateOnly(rule.effective_from)}{rule.effective_to ? ` bis ${formatDateOnly(rule.effective_to)}` : ""}</small>
              </button>
            ))}
          </div>

          <form onSubmit={saveRule} style={formStyle}>
            <div style={twoColumnFormStyle}>
              <Field label="Store">
                <select value={ruleDraft.provider} onChange={(event) => setRuleDraft((draft) => ({ ...draft, provider: event.target.value as RuleDraft["provider"] }))} style={inputStyle}>
                  <option value="google_play">Google Play</option>
                  <option value="app_store">Apple App Store</option>
                </select>
              </Field>
              <Field label="Produktart">
                <select value={ruleDraft.productKind} onChange={(event) => setRuleDraft((draft) => ({ ...draft, productKind: event.target.value as RuleDraft["productKind"] }))} style={inputStyle}>
                  <option value="subscription">Abo</option>
                  <option value="coin_purchase">Coin-Kauf</option>
                </select>
              </Field>
            </div>
            <div style={twoColumnFormStyle}>
              <Field label="Gültig ab">
                <input type="date" value={ruleDraft.effectiveFrom} onChange={(event) => setRuleDraft((draft) => ({ ...draft, effectiveFrom: event.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Gültig bis (optional)">
                <input type="date" value={ruleDraft.effectiveTo} onChange={(event) => setRuleDraft((draft) => ({ ...draft, effectiveTo: event.target.value }))} style={inputStyle} />
              </Field>
            </div>
            <div style={twoColumnFormStyle}>
              <Field label="Store-Provision in %">
                <input type="number" min="0" max="100" step="0.01" value={ruleDraft.storeFeePercent} onChange={(event) => setRuleDraft((draft) => ({ ...draft, storeFeePercent: event.target.value }))} style={inputStyle} />
              </Field>
              <Field label="MwSt.-Schätzung in %">
                <input type="number" min="0" max="100" step="0.01" value={ruleDraft.vatPercent} onChange={(event) => setRuleDraft((draft) => ({ ...draft, vatPercent: event.target.value }))} style={inputStyle} />
              </Field>
            </div>
            <Field label="Notiz">
              <input type="text" value={ruleDraft.note} onChange={(event) => setRuleDraft((draft) => ({ ...draft, note: event.target.value }))} placeholder="z. B. Regel nach Umsatzschwelle" style={inputStyle} />
            </Field>
            <label style={checkStyle}>
              <input type="checkbox" checked={ruleDraft.active} onChange={(event) => setRuleDraft((draft) => ({ ...draft, active: event.target.checked }))} />
              <span>Regel aktiv</span>
            </label>
            <button type="submit" style={primaryButtonStyle} disabled={savingRule}>
              {savingRule ? "Speichere..." : "Gebührenregel speichern"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function NetProfitOverview({
  netOverview,
  netPeriod,
  netLoading,
  onChangePeriod,
}: {
  netOverview: NetOverview;
  netPeriod: NetPeriod;
  netLoading: boolean;
  onChangePeriod: (period: NetPeriod) => void;
}) {
  const totals = [
    ["Brutto", value(netOverview.gross_eur), "default"],
    ["MwSt. geschätzt", -value(netOverview.vat_estimated_eur), "muted"],
    ["Google / Apple", -value(netOverview.store_fee_eur), "muted"],
    ["Affiliate", -value(netOverview.affiliate_commission_eur), "muted"],
  ] as const;

  return (
    <section style={netHeroStyle}>
      <div style={netHeroHeaderStyle}>
        <div>
          <div style={netHeroLabelStyle}>Geschätzter Nettoertrag</div>
          <div style={netHeroValueStyle}>
            {netLoading ? "..." : formatMoney(value(netOverview.net_profit_eur))}
          </div>
          <p style={netHeroTextStyle}>
            {netPeriodLabel(netPeriod)} · Europe/Berlin · nach MwSt., Store-Gebühren und Affiliate-Provisionen
          </p>
        </div>
        <div style={netPeriodButtonsStyle}>
          {netPeriodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangePeriod(option.value)}
              style={netPeriodButtonStyle(netPeriod === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div style={financialGridStyle}>
        {totals.map(([label, amount, tone]) => (
          <div key={label} style={netMetricStyle}>
            <span style={financialLabelStyle}>{label}</span>
            <strong style={{ ...financialValueStyle, color: tone === "muted" ? "#cfe0d6" : "#e7f1eb" }}>
              {netLoading ? "..." : amount < 0 ? `− ${formatMoney(Math.abs(amount))}` : formatMoney(amount)}
            </strong>
          </div>
        ))}
      </div>

      <div style={netFootnoteStyle}>
        {netLoading
          ? "Berechnung wird geladen..."
          : `${formatNumber(value(netOverview.payment_events))} Zahlungsereignisse · ${formatNumber(value(netOverview.estimated_events))} geschätzte Alt-Ereignisse · Abos netto: ${formatMoney(value(netOverview.subscription_net_eur))} · Coin-Käufe netto: ${formatMoney(value(netOverview.coin_net_eur))}`}
      </div>
    </section>
  );
}

function FinancialOverview({ title, stats, compact = false }: { title: string; stats: FinancialStats; compact?: boolean }) {
  const entries = [
    ["Kundenumsatz brutto", stats.gross, "default"],
    ["MwSt. geschätzt", -stats.vat, "muted"],
    ["Store-Provision", -stats.storeFee, "muted"],
    ["Affiliate-Provisionen", -stats.affiliate, "muted"],
    ["Cardletics-Nettoertrag", stats.net, "green"],
  ] as const;

  return (
    <section style={{ ...cardStyle, marginBottom: compact ? 0 : "20px" }}>
      <div style={sectionHeaderStyle}>
        <div>
          <h2 style={sectionTitleStyle}>{title}</h2>
          <p style={sectionTextStyle}>{formatNumber(stats.events)} Zahlungsereignisse · Werte geschätzt</p>
        </div>
      </div>
      <div style={compact ? financialGridCompactStyle : financialGridStyle}>
        {entries.map(([label, amount, tone]) => (
          <div key={label} style={financialMetricStyle}>
            <span style={financialLabelStyle}>{label}</span>
            <strong style={{ ...financialValueStyle, color: tone === "green" ? "#86efac" : tone === "muted" ? "#cfe0d6" : "#e7f1eb" }}>
              {formatMoney(amount)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoreBadge({ provider }: { provider: string }) {
  const isGoogle = provider === "google_play";
  return (
    <span style={{ ...storeBadgeStyle, ...(isGoogle ? googleBadgeStyle : appleBadgeStyle) }}>
      {isGoogle ? "Google Play" : provider === "app_store" ? "Apple" : provider || "Store"}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={fieldStyle}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  );
}

type FinancialStats = { events: number; gross: number; vat: number; storeFee: number; affiliate: number; net: number };

function financialStats(events: RevenueEvent[]): FinancialStats {
  return events.reduce(
    (stats, event) => {
      stats.events += 1;
      stats.gross += value(event.gross_eur);
      stats.vat += value(event.vat_estimated_eur);
      stats.storeFee += value(event.store_fee_eur);
      stats.affiliate += value(event.affiliate_commission_eur);
      stats.net += value(event.net_after_affiliate_eur);
      return stats;
    },
    { events: 0, gross: 0, vat: 0, storeFee: 0, affiliate: 0, net: 0 },
  );
}

function value(raw: number | string | null | undefined): number {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInputNumber(raw: string): number {
  return Number(raw.replace(",", "."));
}

function normalize(raw: string | null | undefined): string {
  return (raw || "").trim().toLowerCase();
}

function dateValue(raw: string): number {
  const date = new Date(raw).getTime();
  return Number.isNaN(date) ? 0 : date;
}

function berlinDateParts(date: Date): { year: string; month: string; day: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const valueFor = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return { year: valueFor("year"), month: valueFor("month"), day: valueFor("day") };
}

function berlinDateKey(date: Date): string {
  const parts = berlinDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function isInsideDate(raw: string, filter: DateFilter): boolean {
  const timestamp = dateValue(raw);
  if (!timestamp) return false;

  const eventDate = new Date(timestamp);
  const now = new Date();
  const eventParts = berlinDateParts(eventDate);
  const nowParts = berlinDateParts(now);

  if (filter === "today") {
    return berlinDateKey(eventDate) === berlinDateKey(now);
  }

  if (filter === "month") {
    return eventParts.year === nowParts.year && eventParts.month === nowParts.month;
  }

  if (filter === "year") {
    return eventParts.year === nowParts.year;
  }

  const days = filter === "7d" ? 7 : filter === "30d" ? 30 : filter === "90d" ? 90 : 0;
  return days === 0 || timestamp >= now.getTime() - days * 24 * 60 * 60 * 1000;
}

function netPeriodLabel(period: NetPeriod): string {
  if (period === "today") return "Heute";
  if (period === "month") return "Dieser Monat";
  if (period === "year") return "Dieses Jahr";
  return "Gesamt";
}

function formatMoney(amount: number): string {
  return amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

function formatNumber(amount: number): string {
  return Math.round(amount).toLocaleString("de-DE");
}

function formatPercent(amount: number): string {
  return `${amount.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`;
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
}

function formatDateOnly(raw: string | null | undefined): string {
  if (!raw) return "—";
  const date = new Date(`${raw}T12:00:00`);
  return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("de-DE");
}

function providerLabel(provider: FeeRule["provider"]): string {
  return provider === "google_play" ? "Google Play" : "Apple App Store";
}

function kindLabel(kind: FeeRule["product_kind"]): string {
  return kind === "subscription" ? "Abo" : "Coin-Kauf";
}

const pageStyle: CSSProperties = { width: "100%" };
const headerStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "20px" };
const titleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "30px" };
const subtitleStyle: CSSProperties = { margin: "8px 0 0 0", color: "#94a39b", lineHeight: 1.5, maxWidth: "850px" };
const noteStyle: CSSProperties = { marginBottom: "20px", padding: "13px 15px", borderRadius: "14px", background: "#302612", border: "1px solid #71571a", color: "#fde68a", lineHeight: 1.5 };
const netHeroStyle: CSSProperties = { marginBottom: "20px", padding: "20px", borderRadius: "18px", border: "1px solid #365b43", background: "linear-gradient(120deg, #1d4e2d 0%, #17211f 50%, #16213a 100%)", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const netHeroHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "16px" };
const netHeroLabelStyle: CSSProperties = { color: "#d7eadf", fontSize: "14px", fontWeight: 800 };
const netHeroValueStyle: CSSProperties = { color: "#ffffff", fontSize: "38px", lineHeight: 1.12, fontWeight: 900, marginTop: "5px" };
const netHeroTextStyle: CSSProperties = { margin: "8px 0 0", color: "#d7eadf", fontWeight: 700, lineHeight: 1.45 };
const netPeriodButtonsStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "8px" };
function netPeriodButtonStyle(active: boolean): CSSProperties { return { minHeight: "40px", padding: "8px 13px", borderRadius: "999px", border: active ? "1px solid #d8f7dc" : "1px solid #52745d", background: active ? "#edf9ef" : "rgba(5, 16, 10, 0.28)", color: active ? "#12361b" : "#e6f3e8", fontWeight: 900, cursor: "pointer" }; }
const netMetricStyle: CSSProperties = { background: "rgba(8, 18, 13, 0.36)", border: "1px solid rgba(226, 245, 231, 0.16)", borderRadius: "14px", padding: "14px" };
const netFootnoteStyle: CSSProperties = { marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(226, 245, 231, 0.16)", color: "#c9dfcf", fontSize: "12px", lineHeight: 1.5 };
const errorBoxStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", color: "#fecaca", borderRadius: "14px", padding: "14px", marginBottom: "16px" };
const successBoxStyle: CSSProperties = { background: "#163322", border: "1px solid #166534", color: "#bbf7d0", borderRadius: "14px", padding: "14px", marginBottom: "16px" };
const secondaryButtonStyle: CSSProperties = { minHeight: "42px", padding: "9px 14px", borderRadius: "12px", border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", fontWeight: 800, cursor: "pointer" };
const primaryButtonStyle: CSSProperties = { minHeight: "46px", padding: "10px 14px", borderRadius: "12px", border: 0, background: "#22c55e", color: "#08130c", fontWeight: 900, cursor: "pointer" };
const cardStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "16px", padding: "18px", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: "20px" };
const providerGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "20px" };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb", fontSize: "20px" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const countStyle: CSSProperties = { color: "#cfe0d6", background: "#101714", border: "1px solid #27312d", borderRadius: "999px", padding: "7px 10px", fontSize: "12px", fontWeight: 800 };
const financialGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" };
const financialGridCompactStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" };
const financialMetricStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "14px", padding: "14px" };
const financialLabelStyle: CSSProperties = { display: "block", color: "#94a39b", fontSize: "12px", lineHeight: 1.35, minHeight: "32px" };
const financialValueStyle: CSSProperties = { display: "block", marginTop: "7px", fontSize: "19px", fontWeight: 900 };
const filterGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" };
const inputStyle: CSSProperties = { width: "100%", minHeight: "44px", boxSizing: "border-box", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", padding: "10px 12px", outline: "none" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", lineHeight: 1.5 };
const chartGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: "11px", alignItems: "end", minHeight: "220px" };
const chartItemStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "7px", alignItems: "center", minWidth: 0 };
const chartBarShellStyle: CSSProperties = { height: "145px", width: "100%", maxWidth: "45px", background: "#0f1512", border: "1px solid #27312d", borderRadius: "10px", display: "flex", alignItems: "flex-end", overflow: "hidden" };
const chartLabelStyle: CSSProperties = { color: "#cfe0d6", fontSize: "10px" };
const chartValueStyle: CSSProperties = { color: "#94a39b", fontSize: "10px", textAlign: "center" };
const tableWrapperStyle: CSSProperties = { overflowX: "auto", border: "1px solid #27312d", borderRadius: "14px" };
const tableStyle: CSSProperties = { width: "100%", minWidth: "1250px", borderCollapse: "collapse" };
const tableHeaderRowStyle: CSSProperties = { background: "#111814", textAlign: "left" };
const thStyle: CSSProperties = { color: "#94a39b", fontSize: "12px", padding: "12px", borderBottom: "1px solid #27312d", whiteSpace: "nowrap" };
const rightThStyle: CSSProperties = { ...thStyle, textAlign: "right" };
const tableRowStyle: CSSProperties = { borderBottom: "1px solid #27312d" };
const tdStyle: CSSProperties = { color: "#e7f1eb", fontSize: "13px", padding: "12px", verticalAlign: "top" };
const rightTdStyle: CSSProperties = { ...tdStyle, textAlign: "right", whiteSpace: "nowrap", fontWeight: 800 };
const rightTdMutedStyle: CSSProperties = { ...rightTdStyle, color: "#cfe0d6" };
const rightTdNetStyle: CSSProperties = { ...rightTdStyle, color: "#86efac", fontSize: "14px" };
const userLinkStyle: CSSProperties = { color: "#e7f1eb", textDecoration: "none", fontWeight: 900 };
const mutedStyle: CSSProperties = { color: "#94a39b", fontSize: "11px", marginTop: "4px", lineHeight: 1.35 };
const affiliateTextStyle: CSSProperties = { color: "#fde68a", fontSize: "11px", marginTop: "5px", lineHeight: 1.35 };
const storeBadgeStyle: CSSProperties = { display: "inline-flex", padding: "5px 8px", borderRadius: "999px", border: "1px solid", fontWeight: 900, fontSize: "11px", whiteSpace: "nowrap" };
const googleBadgeStyle: CSSProperties = { background: "#15312a", borderColor: "#1f6f57", color: "#9ee7c9" };
const appleBadgeStyle: CSSProperties = { background: "#20242a", borderColor: "#4b5563", color: "#e5e7eb" };
const rulesGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(260px, 0.8fr) minmax(320px, 1.2fr)", gap: "18px" };
const rulesListStyle: CSSProperties = { display: "grid", gap: "9px", alignContent: "start" };
const ruleButtonStyle: CSSProperties = { display: "grid", textAlign: "left", gap: "5px", padding: "12px", borderRadius: "13px", border: "1px solid #27312d", background: "#101714", color: "#e7f1eb", cursor: "pointer" };
const formStyle: CSSProperties = { display: "grid", gap: "12px" };
const twoColumnFormStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" };
const fieldStyle: CSSProperties = { display: "grid", gap: "7px" };
const fieldLabelStyle: CSSProperties = { color: "#cfe0d6", fontSize: "12px", fontWeight: 800 };
const checkStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "8px", color: "#cfe0d6", fontSize: "13px", fontWeight: 700 };
