"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../lib/supabase";

type OnlinePresence = {
  presence_ref?: string;
  user_id?: string;
  username?: string | null;
  platform?: string | null;
  last_seen?: string | null;
};

export default function AnalyticsPage() {
  const [onlineSessions, setOnlineSessions] = useState<OnlinePresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
      .on("presence", { event: "sync" }, () => {
        updatePresence();
      })
      .on("presence", { event: "join" }, () => {
        updatePresence();
      })
      .on("presence", { event: "leave" }, () => {
        updatePresence();
      })
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

      if (!map.has(key)) {
        map.set(key, session);
      }
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

  const sortedUsers = useMemo(() => {
    return [...uniqueOnlineUsers].sort((a, b) => {
      const dateA = a.last_seen ? new Date(a.last_seen).getTime() : 0;
      const dateB = b.last_seen ? new Date(b.last_seen).getTime() : 0;
      return dateB - dateA;
    });
  }, [uniqueOnlineUsers]);

  function formatDate(dateString?: string | null) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("de-DE");
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Analytics</h1>
        <p style={pageSubtitleStyle}>
          Realtime Übersicht über aktuell online Nutzer und Sessions.
        </p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard
          title="Realtime Status"
          value={isConnected ? "Verbunden" : "Nicht verbunden"}
          accent={isConnected ? "green" : "red"}
        />
        <KpiCard title="Online User" value={String(uniqueOnlineUsers.length)} />
        <KpiCard title="Offene Sessions" value={String(onlineSessions.length)} />
        <KpiCard title="Plattformen aktiv" value={String(platformStats.length)} />
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Sessions nach Plattform</h3>
          <span style={sectionCountStyle}>{platformStats.length} Plattformen</span>
        </div>

        {platformStats.length === 0 ? (
          <p style={emptyTextStyle}>Noch keine aktiven Sessions gefunden.</p>
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
          <h3 style={sectionTitleStyle}>Aktuell online</h3>
          <span style={sectionCountStyle}>{sortedUsers.length} Nutzer</span>
        </div>

        {sortedUsers.length === 0 ? (
          <p style={emptyTextStyle}>
            Gerade ist niemand online oder deine App sendet noch keine Presence-Daten.
          </p>
        ) : (
          <>
            <div className="analytics-users-mobile-list" style={mobileListStyle}>
              {sortedUsers.map((user, index) => (
                <div
                  key={user.user_id || user.presence_ref || index}
                  style={mobileCardStyle}
                >
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>Username</div>
                      <div style={mobileValueStrongStyle}>
                        {user.username && user.username.trim() !== ""
                          ? user.username
                          : "Kein Username"}
                      </div>
                    </div>

                    <span style={onlineBadgeStyle}>Online</span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="User ID" value={user.user_id || "—"} />
                    <InfoItem label="Platform" value={user.platform || "—"} />
                    <InfoItem label="Last Seen" value={formatDate(user.last_seen)} />
                    <InfoItem
                      label="Presence Ref"
                      value={user.presence_ref || "—"}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="analytics-users-desktop-table" style={desktopTableWrapperStyle}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "950px",
                }}
              >
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
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={user.user_id || user.presence_ref || index}
                      style={{ borderTop: "1px solid #27312d" }}
                    >
                      <td style={tableCellStyle}>{user.user_id || "—"}</td>
                      <td style={tableCellStyle}>
                        {user.username && user.username.trim() !== ""
                          ? user.username
                          : "Kein Username"}
                      </td>
                      <td style={tableCellStyle}>{user.platform || "—"}</td>
                      <td style={tableCellStyle}>{formatDate(user.last_seen)}</td>
                      <td style={tableCellStyle}>
                        <span style={onlineBadgeStyle}>Online</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Alle offenen Sessions</h3>
          <span style={sectionCountStyle}>{onlineSessions.length} Sessions</span>
        </div>

        {onlineSessions.length === 0 ? (
          <p style={emptyTextStyle}>Keine offenen Sessions vorhanden.</p>
        ) : (
          <>
            <div className="analytics-sessions-mobile-list" style={mobileListStyle}>
              {onlineSessions.map((session, index) => (
                <div
                  key={`${session.presence_ref || "ref"}-${session.user_id || "user"}-${index}`}
                  style={mobileCardStyle}
                >
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>Presence Ref</div>
                      <div style={mobileValueStrongStyle}>
                        {session.presence_ref || "—"}
                      </div>
                    </div>

                    <span style={sessionBadgeStyle}>Session</span>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="User ID" value={session.user_id || "—"} />
                    <InfoItem
                      label="Username"
                      value={
                        session.username && session.username.trim() !== ""
                          ? session.username
                          : "Kein Username"
                      }
                    />
                    <InfoItem label="Platform" value={session.platform || "—"} />
                    <InfoItem label="Last Seen" value={formatDate(session.last_seen)} />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="analytics-sessions-desktop-table"
              style={desktopTableWrapperStyle}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>Presence Ref</th>
                    <th style={tableHeaderStyle}>User ID</th>
                    <th style={tableHeaderStyle}>Username</th>
                    <th style={tableHeaderStyle}>Platform</th>
                    <th style={tableHeaderStyle}>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {onlineSessions.map((session, index) => (
                    <tr
                      key={`${session.presence_ref || "ref"}-${session.user_id || "user"}-${index}`}
                      style={{ borderTop: "1px solid #27312d" }}
                    >
                      <td style={tableCellStyle}>{session.presence_ref || "—"}</td>
                      <td style={tableCellStyle}>{session.user_id || "—"}</td>
                      <td style={tableCellStyle}>
                        {session.username && session.username.trim() !== ""
                          ? session.username
                          : "Kein Username"}
                      </td>
                      <td style={tableCellStyle}>{session.platform || "—"}</td>
                      <td style={tableCellStyle}>{formatDate(session.last_seen)}</td>
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

function KpiCard({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: string;
  accent?: "default" | "green" | "red";
}) {
  const valueStyle =
    accent === "green"
      ? connectedValueStyle
      : accent === "red"
      ? disconnectedValueStyle
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

const connectedValueStyle: CSSProperties = {
  ...kpiValueStyle,
  color: "#86efac",
};

const disconnectedValueStyle: CSSProperties = {
  ...kpiValueStyle,
  color: "#fca5a5",
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
  lineHeight: 1.5,
};

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

const platformLabelStyle: CSSProperties = {
  margin: 0,
  color: "#94a39b",
  fontSize: "14px",
};

const platformValueStyle: CSSProperties = {
  margin: "10px 0 0 0",
  fontSize: "24px",
  color: "#e7f1eb",
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

const sessionBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  background: "#10233a",
  color: "#93c5fd",
  whiteSpace: "nowrap",
};