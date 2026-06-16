"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  coins: number | null;
  card_points: number | null;
  is_admin: boolean | null;
  selected_background_id: string | null;
  created_at: string;
  last_seen_at: string | null;
};

type UsernameFilter = "all" | "withUsername" | "withoutUsername";
type AdminFilter = "all" | "admins" | "users";
type ActivityFilter = "all" | "online15" | "active24h" | "inactive24h";
type SortOrder =
  | "newest"
  | "oldest"
  | "coinsHigh"
  | "coinsLow"
  | "pointsHigh"
  | "pointsLow"
  | "lastSeen";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState<UsernameFilter>("all");
  const [adminFilter, setAdminFilter] = useState<AdminFilter>("all");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase.rpc("admin_list_users");

      if (cancelled) return;

      if (error) {
        console.error("Fehler beim Laden der User:", error);
        setUsers([]);
        setLoadError(error.message || "User konnten nicht geladen werden.");
      } else {
        setUsers((data as Profile[]) || []);
      }

      setLoading(false);
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();

    const active15 = users.filter((user) => {
      if (!user.last_seen_at) return false;
      const diffMs = now - new Date(user.last_seen_at).getTime();
      return diffMs <= 15 * 60 * 1000;
    }).length;

    const active24h = users.filter((user) => {
      if (!user.last_seen_at) return false;
      const diffMs = now - new Date(user.last_seen_at).getTime();
      return diffMs <= 24 * 60 * 60 * 1000;
    }).length;

    const new24h = users.filter((user) => {
      const diffMs = now - new Date(user.created_at).getTime();
      return diffMs <= 24 * 60 * 60 * 1000;
    }).length;

    const new7d = users.filter((user) => {
      const diffMs = now - new Date(user.created_at).getTime();
      return diffMs <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    const totalCoins = users.reduce((sum, user) => {
      return sum + safeNumber(user.coins);
    }, 0);

    const totalCardPoints = users.reduce((sum, user) => {
      return sum + safeNumber(user.card_points);
    }, 0);

    const admins = users.filter((user) => user.is_admin === true).length;

    return {
      totalUsers: users.length,
      active15,
      active24h,
      new24h,
      new7d,
      totalCoins,
      totalCardPoints,
      admins,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();

      result = result.filter((user) => {
        const username = user.username?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const id = user.id.toLowerCase();
        const background = user.selected_background_id?.toLowerCase() || "";

        return (
          username.includes(searchLower) ||
          email.includes(searchLower) ||
          id.includes(searchLower) ||
          background.includes(searchLower)
        );
      });
    }

    if (usernameFilter === "withUsername") {
      result = result.filter(
        (user) => user.username && user.username.trim() !== ""
      );
    }

    if (usernameFilter === "withoutUsername") {
      result = result.filter(
        (user) => !user.username || user.username.trim() === ""
      );
    }

    if (adminFilter === "admins") {
      result = result.filter((user) => user.is_admin === true);
    }

    if (adminFilter === "users") {
      result = result.filter((user) => user.is_admin !== true);
    }

    if (activityFilter !== "all") {
      const now = Date.now();

      result = result.filter((user) => {
        if (!user.last_seen_at) {
          return activityFilter === "inactive24h";
        }

        const diffMs = now - new Date(user.last_seen_at).getTime();
        const active15 = diffMs <= 15 * 60 * 1000;
        const active24h = diffMs <= 24 * 60 * 60 * 1000;

        if (activityFilter === "online15") return active15;
        if (activityFilter === "active24h") return active24h;
        if (activityFilter === "inactive24h") return !active24h;

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      if (sortOrder === "coinsHigh") {
        return safeNumber(b.coins) - safeNumber(a.coins);
      }

      if (sortOrder === "coinsLow") {
        return safeNumber(a.coins) - safeNumber(b.coins);
      }

      if (sortOrder === "pointsHigh") {
        return safeNumber(b.card_points) - safeNumber(a.card_points);
      }

      if (sortOrder === "pointsLow") {
        return safeNumber(a.card_points) - safeNumber(b.card_points);
      }

      if (sortOrder === "lastSeen") {
        return dateValue(b.last_seen_at) - dateValue(a.last_seen_at);
      }

      return 0;
    });

    return result;
  }, [
    users,
    search,
    usernameFilter,
    adminFilter,
    activityFilter,
    sortOrder,
  ]);

  function formatDate(dateString: string | null) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("de-DE");
  }

  function formatNumber(value: number | null | undefined) {
    return safeNumber(value).toLocaleString("de-DE");
  }

  function activityLabel(user: Profile) {
    if (!user.last_seen_at) return "Nie aktiv";

    const diffMs = Date.now() - new Date(user.last_seen_at).getTime();

    if (diffMs <= 15 * 60 * 1000) return "Aktiv";
    if (diffMs <= 24 * 60 * 60 * 1000) return "Heute";
    return "Inaktiv";
  }

  function activityStyle(user: Profile): CSSProperties {
    const label = activityLabel(user);

    if (label === "Aktiv") {
      return onlineBadgeStyle;
    }

    if (label === "Heute") {
      return todayBadgeStyle;
    }

    return inactiveBadgeStyle;
  }

  return (
    <div style={pageStyle}>
      <style jsx global>{`
        @media (min-width: 900px) {
          .users-mobile-list {
            display: none !important;
          }

          .users-desktop-table {
            display: block !important;
          }
        }
      `}</style>

      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Users</h1>
        <p style={pageSubtitleStyle}>
          Admin-Übersicht über alle Nutzer, Coins, Card Points, Adminstatus und Aktivität.
        </p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard
          title="Total Users"
          value={loading ? "..." : formatNumber(stats.totalUsers)}
        />
        <KpiCard
          title="Aktiv 15 Min."
          value={loading ? "..." : formatNumber(stats.active15)}
        />
        <KpiCard
          title="Aktiv 24 Std."
          value={loading ? "..." : formatNumber(stats.active24h)}
        />
        <KpiCard
          title="Neue 24 Std."
          value={loading ? "..." : formatNumber(stats.new24h)}
        />
        <KpiCard
          title="Neue 7 Tage"
          value={loading ? "..." : formatNumber(stats.new7d)}
        />
        <KpiCard
          title="Admins"
          value={loading ? "..." : formatNumber(stats.admins)}
        />
        <KpiCard
          title="Coins gesamt"
          value={loading ? "..." : formatNumber(stats.totalCoins)}
        />
        <KpiCard
          title="Card Points gesamt"
          value={loading ? "..." : formatNumber(stats.totalCardPoints)}
        />
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden der User</strong>
          <p style={errorTextStyle}>{loadError}</p>
          <p style={errorHintStyle}>
            Prüfe, ob du im Adminbereich mit einem Supabase-Adminaccount eingeloggt bist
            und ob die RPC <strong>admin_list_users</strong> existiert.
          </p>
        </div>
      )}

      <div style={filterCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Filter</h3>
          <span style={sectionCountStyle}>
            {loading ? "Lade..." : `${filteredUsers.length} Nutzer`}
          </span>
        </div>

        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Suche</label>
            <input
              type="text"
              placeholder="Suche nach E-Mail, ID, Username oder Background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <select
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value as UsernameFilter)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="withUsername">Mit Username</option>
              <option value="withoutUsername">Ohne Username</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Adminstatus</label>
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value as AdminFilter)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="admins">Nur Admins</option>
              <option value="users">Nur normale Nutzer</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Aktivität</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as ActivityFilter)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="online15">Aktiv letzte 15 Min.</option>
              <option value="active24h">Aktiv letzte 24 Std.</option>
              <option value="inactive24h">Nicht aktiv 24 Std.</option>
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
              <option value="coinsHigh">Coins hoch zu niedrig</option>
              <option value="coinsLow">Coins niedrig zu hoch</option>
              <option value="pointsHigh">Card Points hoch zu niedrig</option>
              <option value="pointsLow">Card Points niedrig zu hoch</option>
              <option value="lastSeen">Zuletzt aktiv</option>
            </select>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>User-Liste</h3>
          <span style={sectionCountStyle}>
            {loading ? "Lade..." : `${filteredUsers.length} Nutzer`}
          </span>
        </div>

        {loading ? (
          <p style={emptyTextStyle}>Lade Nutzer...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={emptyTextStyle}>Keine Nutzer gefunden.</p>
        ) : (
          <>
            <div className="users-mobile-list" style={mobileListStyle}>
              {filteredUsers.map((user) => (
                <div key={user.id} style={mobileCardStyle}>
                  <div style={mobileCardTopStyle}>
                    <div>
                      <div style={mobileLabelStyle}>Username</div>
                      <div style={mobileValueStrongStyle}>
                        {user.username && user.username.trim() !== ""
                          ? user.username
                          : "—"}
                      </div>
                      <div style={mobileEmailStyle}>{user.email || "Keine E-Mail"}</div>
                    </div>

                    <div style={mobileActionsStyle}>
                      <span style={activityStyle(user)}>{activityLabel(user)}</span>
                      <Link href={`/admin/users/${user.id}`} style={detailsButtonStyle}>
                        Details
                      </Link>
                    </div>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="User ID" value={user.id} />
                    <InfoItem label="Coins" value={formatNumber(user.coins)} />
                    <InfoItem
                      label="Card Points"
                      value={formatNumber(user.card_points)}
                    />
                    <InfoItem
                      label="Admin"
                      value={user.is_admin ? "Ja" : "Nein"}
                    />
                    <InfoItem
                      label="Registriert"
                      value={formatDate(user.created_at)}
                    />
                    <InfoItem
                      label="Last Seen"
                      value={formatDate(user.last_seen_at)}
                    />
                    <InfoItem
                      label="Background"
                      value={user.selected_background_id || "—"}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="users-desktop-table" style={desktopTableWrapperStyle}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1250px",
                }}
              >
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>Username</th>
                    <th style={tableHeaderStyle}>E-Mail</th>
                    <th style={tableHeaderStyle}>Coins</th>
                    <th style={tableHeaderStyle}>Card Points</th>
                    <th style={tableHeaderStyle}>Admin</th>
                    <th style={tableHeaderStyle}>Aktivität</th>
                    <th style={tableHeaderStyle}>Last Seen</th>
                    <th style={tableHeaderStyle}>Registriert am</th>
                    <th style={tableHeaderStyle}>User ID</th>
                    <th style={tableHeaderStyle}>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderTop: "1px solid #27312d" }}>
                      <td style={tableCellStyle}>
                        {user.username && user.username.trim() !== ""
                          ? user.username
                          : "—"}
                      </td>
                      <td style={tableCellStyle}>{user.email || "—"}</td>
                      <td style={tableCellStyle}>{formatNumber(user.coins)}</td>
                      <td style={tableCellStyle}>
                        {formatNumber(user.card_points)}
                      </td>
                      <td style={tableCellStyle}>
                        <span style={user.is_admin ? adminBadgeStyle : userBadgeStyle}>
                          {user.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={activityStyle(user)}>{activityLabel(user)}</span>
                      </td>
                      <td style={tableCellStyle}>{formatDate(user.last_seen_at)}</td>
                      <td style={tableCellStyle}>{formatDate(user.created_at)}</td>
                      <td style={tableCellMutedStyle}>{user.id}</td>
                      <td style={tableCellStyle}>
                        <Link href={`/admin/users/${user.id}`} style={tableButtonStyle}>
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
  fontSize: "23px",
  color: "#e7f1eb",
  wordBreak: "break-word",
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

const filterCardStyle: CSSProperties = {
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

const mobileActionsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "8px",
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

const detailsButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "8px 12px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
  whiteSpace: "nowrap",
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

const tableCellMutedStyle: CSSProperties = {
  ...tableCellStyle,
  color: "#94a39b",
  maxWidth: "260px",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const adminBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f59e0b",
  color: "#111827",
  fontSize: "12px",
  fontWeight: 800,
};

const userBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#1f2937",
  color: "#d1d5db",
  fontSize: "12px",
  fontWeight: 800,
};

const onlineBadgeStyle: CSSProperties = {
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

const todayBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#172554",
  color: "#93c5fd",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const inactiveBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#2f1b1b",
  color: "#fca5a5",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};
