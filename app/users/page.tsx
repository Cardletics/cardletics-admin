"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

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
    <div>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Users</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Hier siehst du die ersten Nutzer aus deiner profiles-Tabelle.
      </p>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
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
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Suche
            </label>
            <input
              type="text"
              placeholder="Suche nach ID, Username oder Background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Username-Filter
            </label>
            <select
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box",
              }}
            >
              <option value="all">Alle</option>
              <option value="withUsername">Mit Username</option>
              <option value="withoutUsername">Ohne Username</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Sortierung
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxSizing: "border-box",
              }}
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>User-Tabelle</h3>
          <span style={{ color: "#6b7280" }}>
            {loading ? "Lade..." : `${filteredUsers.length} Nutzer`}
          </span>
        </div>

        {loading ? (
          <p>Lade Nutzer...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Keine Nutzer gefunden.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1050px",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
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
                  <tr key={user.id} style={{ borderTop: "1px solid #e5e7eb" }}>
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
                      <a
                        href={`/users/${user.id}`}
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          textDecoration: "none",
                          color: "#111827",
                          fontWeight: "bold",
                        }}
                      >
                        Details
                      </a>
                    </td>
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

const tableHeaderStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px",
  fontSize: "14px",
  color: "#111827",
  verticalAlign: "top",
};