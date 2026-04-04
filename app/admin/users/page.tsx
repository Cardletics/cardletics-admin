"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Profile = {
  id: string;
  created_at: string;
  selected_background_id: string | null;
  username: string | null;
  card_points: number | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, created_at, selected_background_id, username, card_points")
        .limit(100);

      if (error) {
        console.error("Fehler beim Laden der User:", error);
      } else {
        setUsers((data as Profile[]) || []);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();

      result = result.filter((user) => {
        const username = user.username?.toLowerCase() || "";
        const id = user.id.toLowerCase();
        const background = user.selected_background_id?.toLowerCase() || "";

        return (
          username.includes(searchLower) ||
          id.includes(searchLower) ||
          background.includes(searchLower)
        );
      });
    }

    if (usernameFilter === "withUsername") {
      result = result.filter((user) => user.username && user.username.trim() !== "");
    }

    if (usernameFilter === "withoutUsername") {
      result = result.filter((user) => !user.username || user.username.trim() === "");
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      if (sortOrder === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return result;
  }, [users, search, usernameFilter, sortOrder]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("de-DE");
  }

  return (
    <div style={pageStyle}>
      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Users</h1>
        <p style={pageSubtitleStyle}>
          Hier siehst du die ersten Nutzer aus deiner profiles-Tabelle.
        </p>
      </div>

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
              placeholder="Suche nach ID, Username oder Background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Username-Filter</label>
            <select
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">Alle</option>
              <option value="withUsername">Mit Username</option>
              <option value="withoutUsername">Ohne Username</option>
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
                    </div>

                    <Link href={`/admin/users/${user.id}`} style={detailsButtonStyle}>
                      Details
                    </Link>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="User ID" value={user.id} />
                    <InfoItem
                      label="Registriert am"
                      value={formatDate(user.created_at)}
                    />
                    <InfoItem
                      label="Background"
                      value={user.selected_background_id || "—"}
                    />
                    <InfoItem
                      label="Card Points"
                      value={
                        user.card_points !== null ? String(user.card_points) : "0"
                      }
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
                  minWidth: "1050px",
                }}
              >
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>Username</th>
                    <th style={tableHeaderStyle}>User ID</th>
                    <th style={tableHeaderStyle}>Registriert am</th>
                    <th style={tableHeaderStyle}>Background</th>
                    <th style={tableHeaderStyle}>Card Points</th>
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
                      <td style={tableCellStyle}>{user.id}</td>
                      <td style={tableCellStyle}>{formatDate(user.created_at)}</td>
                      <td style={tableCellStyle}>
                        {user.selected_background_id || "—"}
                      </td>
                      <td style={tableCellStyle}>
                        {user.card_points !== null ? user.card_points : 0}
                      </td>
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoItemStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  width: "100%",
};

const pageHeaderStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const pageTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "30px",
  color: "#e7f1eb",
};

const pageSubtitleStyle: React.CSSProperties = {
  marginTop: 0,
  color: "#94a39b",
  lineHeight: 1.5,
};

const filterCardStyle: React.CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
  marginBottom: "20px",
};

const tableCardStyle: React.CSSProperties = {
  background: "#171f1c",
  borderRadius: "16px",
  padding: "18px",
  border: "1px solid #27312d",
  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#e7f1eb",
};

const sectionCountStyle: React.CSSProperties = {
  color: "#94a39b",
  fontSize: "14px",
};

const filterGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#cfe0d6",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #27312d",
  background: "#0f1512",
  color: "#e7f1eb",
  boxSizing: "border-box",
  minHeight: "46px",
};

const emptyTextStyle: React.CSSProperties = {
  color: "#94a39b",
  margin: 0,
};

const mobileListStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const mobileCardStyle: React.CSSProperties = {
  background: "#101714",
  border: "1px solid #27312d",
  borderRadius: "16px",
  padding: "16px",
};

const mobileCardTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const mobileLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "4px",
};

const mobileValueStrongStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const mobileInfoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const infoItemStyle: React.CSSProperties = {
  background: "#171f1c",
  border: "1px solid #27312d",
  borderRadius: "12px",
  padding: "12px",
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a39b",
  marginBottom: "6px",
};

const infoValueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#e7f1eb",
  wordBreak: "break-word",
};

const detailsButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "44px",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "#22c55e",
  color: "#08130c",
  fontWeight: 700,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const desktopTableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  marginTop: "18px",
  display: "none",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#cfe0d6",
  borderBottom: "1px solid #27312d",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  color: "#e7f1eb",
  verticalAlign: "top",
};

const tableButtonStyle: React.CSSProperties = {
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