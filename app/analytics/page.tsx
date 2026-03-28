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
      const key =
        session.user_id ||
        session.presence_ref ||
        `unknown-${index}`;

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
    <div>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Analytics</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Realtime Übersicht über aktuell online Nutzer und Sessions.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <KpiCard title="Realtime Status" value={isConnected ? "Verbunden" : "Nicht verbunden"} />
        <KpiCard title="Online User" value={String(uniqueOnlineUsers.length)} />
        <KpiCard title="Offene Sessions" value={String(onlineSessions.length)} />
        <KpiCard title="Plattformen aktiv" value={String(platformStats.length)} />
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
          <h3 style={{ margin: 0 }}>Sessions nach Plattform</h3>
          <span style={{ color: "#6b7280" }}>
            {platformStats.length} Plattformen
          </span>
        </div>

        {platformStats.length === 0 ? (
          <p>Noch keine aktiven Sessions gefunden.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {platformStats.map((item) => (
              <div key={item.platform} style={miniCardStyle}>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                  {item.platform}
                </p>
                <h3 style={{ margin: "10px 0 0 0", fontSize: "24px" }}>
                  {item.count}
                </h3>
              </div>
            ))}
          </div>
        )}
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
          <h3 style={{ margin: 0 }}>Aktuell online</h3>
          <span style={{ color: "#6b7280" }}>
            {sortedUsers.length} Nutzer
          </span>
        </div>

        {sortedUsers.length === 0 ? (
          <p>
            Gerade ist niemand online oder deine App sendet noch keine Presence-Daten.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "950px",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
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
                    style={{ borderTop: "1px solid #e5e7eb" }}
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
        )}
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
          <h3 style={{ margin: 0 }}>Alle offenen Sessions</h3>
          <span style={{ color: "#6b7280" }}>
            {onlineSessions.length} Sessions
          </span>
        </div>

        {onlineSessions.length === 0 ? (
          <p>Keine offenen Sessions vorhanden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
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
                    style={{ borderTop: "1px solid #e5e7eb" }}
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

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  marginTop: "24px",
};

const miniCardStyle: CSSProperties = {
  background: "#f9fafb",
  borderRadius: "10px",
  padding: "16px",
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

const onlineBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "bold",
  background: "#dcfce7",
  color: "#166534",
};