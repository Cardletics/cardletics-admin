"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type AnalyticsRow = Record<string, number | string | null>;

type OnlinePresence = {
  presence_ref?: string;
  user_id?: string;
  username?: string | null;
  platform?: string | null;
  last_seen?: string | null;
};

const emptyAnalytics: AnalyticsRow = {
  total_users: 0,
  active_15m: 0,
  active_24h: 0,
  active_7d: 0,
  new_24h: 0,
  new_7d: 0,
  new_30d: 0,
  admin_users: 0,
  users_with_username: 0,
  users_without_username: 0,
  total_coins: 0,
  avg_coins: 0,
  total_card_points: 0,
  total_subscriptions: 0,
  active_subscriptions: 0,
  paid_active_subscriptions: 0,
  trialing_subscriptions: 0,
  cancelled_subscriptions: 0,
  expired_subscriptions: 0,
  variant_free: 0,
  variant_basic: 0,
  variant_pro: 0,
  variant_elite: 0,
  variant_master: 0,
  subscription_revenue_total: 0,
  subscription_revenue_active: 0,
  coin_revenue_total: 0,
  coin_revenue_30d: 0,
  real_money_total: 0,
  real_money_30d: 0,
  coin_purchase_count: 0,
  coin_purchase_count_30d: 0,
  boost_purchase_count: 0,
  boost_purchase_count_30d: 0,
  pending_pack_rewards: 0,
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsRow>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [onlineSessions, setOnlineSessions] = useState<OnlinePresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase.rpc("admin_analytics_overview");

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden der Analytics:", error);
        setAnalytics(emptyAnalytics);
        setLoadError(error.message || "Analytics konnten nicht geladen werden.");
      } else {
        const rows = (data as AnalyticsRow[] | null) || [];
        setAnalytics(rows[0] || emptyAnalytics);
      }

      setLoading(false);
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const channel = supabase.channel("online-users");

    function updatePresence() {
      const state = channel.presenceState<OnlinePresence>();
      const sessions: OnlinePresence[] = [];

      Object.values(state).forEach((entries) => {
        entries.forEach((entry) => {
          sessions.push(entry);
        });
      });

      setOnlineSessions(sessions);
    }

    channel
      .on("presence", { event: "sync" }, updatePresence)
      .on("presence", { event: "join" }, updatePresence)
      .on("presence", { event: "leave" }, updatePresence)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          updatePresence();
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uniqueOnlineUsers = useMemo(() => {
    const map = new Map<string, OnlinePresence>();

    onlineSessions.forEach((session, index) => {
      const key = session.user_id || session.presence_ref || `unknown-${index}`;
      if (!map.has(key)) map.set(key, session);
    });

    return Array.from(map.values());
  }, [onlineSessions]);

  const platformStats = useMemo(() => {
    const counts: Record<string, number> = {};

    onlineSessions.forEach((session) => {
      const platform = session.platform?.trim() || "unknown";
      counts[platform] = (counts[platform] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);
  }, [onlineSessions]);

  const variantData = [
    { label: "Free", value: toNumber(analytics.variant_free) },
    { label: "Basic", value: toNumber(analytics.variant_basic) },
    { label: "Pro", value: toNumber(analytics.variant_pro) },
    { label: "Elite", value: toNumber(analytics.variant_elite) },
    { label: "Master", value: toNumber(analytics.variant_master) },
  ];

  const maxVariantCount = Math.max(1, ...variantData.map((item) => item.value));

  return (
    <div style={pageStyle}>
      <style jsx global>{`
        @media (min-width: 900px) {
          .analytics-users-mobile-list {
            display: none !important;
          }

          .analytics-users-desktop-table {
            display: block !important;
          }
        }
      `}</style>

      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Analytics</h1>
        <p style={pageSubtitleStyle}>
          Echte Admin-Kennzahlen aus Supabase plus optionale Realtime-Presence.
        </p>
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden der Analytics</strong>
          <p style={errorTextStyle}>{loadError}</p>
          <p style={errorHintStyle}>
            Prüfe, ob die RPC <strong>admin_analytics_overview</strong> existiert
            und du als Admin eingeloggt bist.
          </p>
        </div>
      )}

      <SectionTitle title="Nutzer" subtitle="Registrierungen und Aktivität aus profiles.last_seen_at." />
      <div style={kpiGridStyle}>
        <KpiCard title="User gesamt" value={loading ? "..." : formatNumber(analytics.total_users)} />
        <KpiCard title="Aktiv 15 Min." value={loading ? "..." : formatNumber(analytics.active_15m)} accent="green" />
        <KpiCard title="Aktiv 24 Std." value={loading ? "..." : formatNumber(analytics.active_24h)} />
        <KpiCard title="Aktiv 7 Tage" value={loading ? "..." : formatNumber(analytics.active_7d)} />
        <KpiCard title="Neue 24 Std." value={loading ? "..." : formatNumber(analytics.new_24h)} />
        <KpiCard title="Neue 7 Tage" value={loading ? "..." : formatNumber(analytics.new_7d)} />
        <KpiCard title="Neue 30 Tage" value={loading ? "..." : formatNumber(analytics.new_30d)} />
        <KpiCard title="Admins" value={loading ? "..." : formatNumber(analytics.admin_users)} />
      </div>

      <SectionTitle title="Economy" subtitle="Coins und Card Points aus profiles." />
      <div style={kpiGridStyle}>
        <KpiCard title="Coins gesamt" value={loading ? "..." : formatNumber(analytics.total_coins)} />
        <KpiCard title="Ø Coins/User" value={loading ? "..." : formatNumber(analytics.avg_coins)} />
        <KpiCard title="Card Points gesamt" value={loading ? "..." : formatNumber(analytics.total_card_points)} />
        <KpiCard title="Pending Pack Rewards" value={loading ? "..." : formatNumber(analytics.pending_pack_rewards)} accent="orange" />
      </div>

      <SectionTitle title="Subscriptions" subtitle="Abo-Verteilung und Status." />
      <div style={kpiGridStyle}>
        <KpiCard title="Abos gesamt" value={loading ? "..." : formatNumber(analytics.total_subscriptions)} />
        <KpiCard title="Aktive Abos" value={loading ? "..." : formatNumber(analytics.active_subscriptions)} accent="green" />
        <KpiCard title="Aktive bezahlt" value={loading ? "..." : formatNumber(analytics.paid_active_subscriptions)} />
        <KpiCard title="Trialing" value={loading ? "..." : formatNumber(analytics.trialing_subscriptions)} />
        <KpiCard title="Cancelled" value={loading ? "..." : formatNumber(analytics.cancelled_subscriptions)} />
        <KpiCard title="Expired" value={loading ? "..." : formatNumber(analytics.expired_subscriptions)} />
      </div>

      <div style={chartCardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Abo-Verteilung</h3>
            <p style={sectionTextStyle}>Free, Basic, Pro, Elite und Master.</p>
          </div>
        </div>

        <div style={barListStyle}>
          {variantData.map((item) => (
            <div key={item.label} style={barRowStyle}>
              <div style={barLabelStyle}>{item.label}</div>
              <div style={barTrackStyle}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(4, (item.value / maxVariantCount) * 100)}%`,
                    background: "linear-gradient(90deg, #22c55e, #86efac)",
                    borderRadius: "999px",
                  }}
                />
              </div>
              <div style={barValueStyle}>{item.value.toLocaleString("de-DE")}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle title="Revenue" subtitle="Echtgeld aus Abos und Coin-Käufen." />
      <div style={kpiGridStyle}>
        <KpiCard title="Echtgeld gesamt" value={loading ? "..." : formatMoney(analytics.real_money_total)} accent="green" />
        <KpiCard title="Echtgeld 30 Tage" value={loading ? "..." : formatMoney(analytics.real_money_30d)} />
        <KpiCard title="Abo-Umsatz gesamt" value={loading ? "..." : formatMoney(analytics.subscription_revenue_total)} />
        <KpiCard title="Aktiver Abo-Monatswert" value={loading ? "..." : formatMoney(analytics.subscription_revenue_active)} />
        <KpiCard title="Coin-Umsatz gesamt" value={loading ? "..." : formatMoney(analytics.coin_revenue_total)} />
        <KpiCard title="Coin-Umsatz 30 Tage" value={loading ? "..." : formatMoney(analytics.coin_revenue_30d)} />
        <KpiCard title="Coin-Käufe gesamt" value={loading ? "..." : formatNumber(analytics.coin_purchase_count)} />
        <KpiCard title="Boost-Käufe 30 Tage" value={loading ? "..." : formatNumber(analytics.boost_purchase_count_30d)} />
      </div>

      <SectionTitle title="Realtime Presence" subtitle="Live-Sessions aus dem Realtime-Channel online-users." />
      <div style={kpiGridStyle}>
        <KpiCard title="Realtime Status" value={isConnected ? "Verbunden" : "Nicht verbunden"} accent={isConnected ? "green" : "red"} />
        <KpiCard title="Online User live" value={String(uniqueOnlineUsers.length)} />
        <KpiCard title="Offene Sessions live" value={String(onlineSessions.length)} />
        <KpiCard title="Plattformen live" value={String(platformStats.length)} />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Sessions nach Plattform</h3>
          <span style={sectionCountStyle}>{platformStats.length} Plattformen</span>
        </div>

        {platformStats.length === 0 ? (
          <p style={emptyTextStyle}>
            Gerade keine Realtime-Sessions. Für Aktivität sind oben die last_seen_at-Werte zuverlässiger.
          </p>
        ) : (
          <div style={platformGridStyle}>
            {platformStats.map((item) => (
              <div key={item.platform} style={platformCardStyle}>
                <p style={platformLabelStyle}>{item.platform}</p>
                <h3 style={platformValueStyle}>{item.count}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Aktuell online live</h3>
          <span style={sectionCountStyle}>{uniqueOnlineUsers.length} Nutzer</span>
        </div>

        {uniqueOnlineUsers.length === 0 ? (
          <p style={emptyTextStyle}>Gerade ist niemand online oder die App sendet keine Presence-Daten.</p>
        ) : (
          <>
            <div className="analytics-users-mobile-list" style={mobileListStyle}>
              {uniqueOnlineUsers.map((user, index) => (
                <div key={user.user_id || user.presence_ref || index} style={mobileCardStyle}>
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>Username</div>
                      <div style={mobileValueStrongStyle}>{user.username || "Kein Username"}</div>
                    </div>

                    <span style={onlineBadgeStyle}>Online</span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="User ID" value={user.user_id || "—"} />
                    <InfoItem label="Platform" value={user.platform || "—"} />
                    <InfoItem label="Last Seen" value={formatDate(user.last_seen)} />
                    <InfoItem label="Presence Ref" value={user.presence_ref || "—"} />
                  </div>
                </div>
              ))}
            </div>

            <div className="analytics-users-desktop-table" style={desktopTableWrapperStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "950px" }}>
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>User ID</th>
                    <th style={tableHeaderStyle}>Username</th>
                    <th style={tableHeaderStyle}>Platform</th>
                    <th style={tableHeaderStyle}>Last Seen</th>
                    <th style={tableHeaderStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueOnlineUsers.map((user, index) => (
                    <tr key={user.user_id || user.presence_ref || index} style={{ borderTop: "1px solid #27312d" }}>
                      <td style={tableCellStyle}>{user.user_id || "—"}</td>
                      <td style={tableCellStyle}>{user.username || "Kein Username"}</td>
                      <td style={tableCellStyle}>{user.platform || "—"}</td>
                      <td style={tableCellStyle}>{formatDate(user.last_seen)}</td>
                      <td style={tableCellStyle}><span style={onlineBadgeStyle}>Online</span></td>
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

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={sectionTitleBlockStyle}>
      <h2 style={sectionMainTitleStyle}>{title}</h2>
      <p style={sectionMainSubtitleStyle}>{subtitle}</p>
    </div>
  );
}

function KpiCard({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: string;
  accent?: "default" | "green" | "red" | "orange";
}) {
  const valueStyle =
    accent === "green"
      ? connectedValueStyle
      : accent === "red"
      ? disconnectedValueStyle
      : accent === "orange"
      ? orangeValueStyle
      : kpiValueStyle;

  return (
    <div style={kpiCardStyle}>
      <p style={kpiTitleStyle}>{title}</p>
      <h3 style={valueStyle}>{value}</h3>
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

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function formatNumber(value: number | string | null | undefined) {
  return Math.round(toNumber(value)).toLocaleString("de-DE");
}

function formatMoney(value: number | string | null | undefined) {
  return toNumber(value).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("de-DE");
}

const pageStyle: CSSProperties = { width: "100%" };

const pageHeaderStyle: CSSProperties = { marginBottom: "20px" };

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

const sectionTitleBlockStyle: CSSProperties = { margin: "26px 0 12px 0" };

const sectionMainTitleStyle: CSSProperties = {
  margin: 0,
  color: "#e7f1eb",
  fontSize: "22px",
};

const sectionMainSubtitleStyle: CSSProperties = {
  margin: "6px 0 0 0",
  color: "#94a39b",
  lineHeight: 1.5,
};

const kpiGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
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

const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: "14px", color: "#94a39b" };

const kpiValueStyle: CSSProperties = {
  margin: "10px 0 0 0",
  fontSize: "24px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const connectedValueStyle: CSSProperties = { ...kpiValueStyle, color: "#86efac" };
const disconnectedValueStyle: CSSProperties = { ...kpiValueStyle, color: "#fca5a5" };
const orangeValueStyle: CSSProperties = { ...kpiValueStyle, color: "#fdba74" };

const errorCardStyle: CSSProperties = {
  background: "#331717",
  border: "1px solid #7f1d1d",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "20px",
  color: "#fecaca",
};

const errorTextStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fecaca" };

const errorHintStyle: CSSProperties = {
  margin: "8px 0 0 0",
  color: "#fca5a5",
  lineHeight: 1.5,
};

const chartCardStyle: CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginBottom: "20px",
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

const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb" };
const sectionTextStyle: CSSProperties = { margin: "6px 0 0 0", color: "#94a39b", lineHeight: 1.5 };
const sectionCountStyle: CSSProperties = { color: "#94a39b", fontSize: "14px" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", margin: 0, lineHeight: 1.5 };

const barListStyle: CSSProperties = { display: "grid", gap: "14px" };

const barRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "80px 1fr 60px",
  alignItems: "center",
  gap: "12px",
};

const barLabelStyle: CSSProperties = { color: "#cfe0d6", fontWeight: 800 };

const barTrackStyle: CSSProperties = {
  height: "14px",
  background: "#0f1512",
  border: "1px solid #27312d",
  borderRadius: "999px",
  overflow: "hidden",
};

const barValueStyle: CSSProperties = { color: "#e7f1eb", fontWeight: 800, textAlign: "right" };

const platformGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const platformCardStyle: CSSProperties = {
  background: "#101714",
  borderRadius: "14px",
  padding: "16px",
  border: "1px solid #27312d",
};

const platformLabelStyle: CSSProperties = { margin: 0, color: "#94a39b", fontSize: "14px" };
const platformValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: "24px", color: "#e7f1eb" };

const mobileListStyle: CSSProperties = { display: "grid", gap: "14px" };

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

const mobileLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "4px" };
const mobileValueStrongStyle: CSSProperties = { fontSize: "16px", fontWeight: 700, color: "#e7f1eb", wordBreak: "break-word" };

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

const infoLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "6px" };
const infoValueStyle: CSSProperties = { fontSize: "14px", color: "#e7f1eb", wordBreak: "break-word" };

const desktopTableWrapperStyle: CSSProperties = { overflowX: "auto", marginTop: "18px", display: "none" };

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#cfe0d6",
  borderBottom: "1px solid #27312d",
};

const tableCellStyle: CSSProperties = { padding: "12px", fontSize: "14px", color: "#e7f1eb", verticalAlign: "top" };

const onlineBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  background: "#163322",
  color: "#86efac",
  whiteSpace: "nowrap",
};
