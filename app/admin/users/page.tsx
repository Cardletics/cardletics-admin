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
  subscription_variant: string | null;
  subscription_raw_variant: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  subscription_price_eur: number | null;
};

type PlanFilter = "all" | "free" | "basic" | "pro" | "elite" | "master";
type SortOrder = "newest" | "coinsHigh" | "pointsHigh" | "lastSeen" | "plan";

const plans: PlanFilter[] = ["free", "basic", "pro", "elite", "master"];

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
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
    const totalCoins = users.reduce((sum, user) => sum + safeNumber(user.coins), 0);
    const totalPoints = users.reduce((sum, user) => sum + safeNumber(user.card_points), 0);
    const paidPlans = users.filter((user) => getPlan(user) !== "free").length;
    const masterPlans = users.filter((user) => getPlan(user) === "master").length;
    const admins = users.filter((user) => user.is_admin === true).length;

    return { total: users.length, paidPlans, masterPlans, admins, totalCoins, totalPoints };
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const text = search.trim().toLowerCase();

    if (text) {
      result = result.filter((user) => {
        return (
          (user.username || "").toLowerCase().includes(text) ||
          (user.email || "").toLowerCase().includes(text) ||
          user.id.toLowerCase().includes(text) ||
          getPlan(user).includes(text) ||
          (user.subscription_raw_variant || "").toLowerCase().includes(text)
        );
      });
    }

    if (planFilter !== "all") {
      result = result.filter((user) => getPlan(user) === planFilter);
    }

    result.sort((a, b) => {
      if (sortOrder === "coinsHigh") return safeNumber(b.coins) - safeNumber(a.coins);
      if (sortOrder === "pointsHigh") return safeNumber(b.card_points) - safeNumber(a.card_points);
      if (sortOrder === "lastSeen") return dateValue(b.last_seen_at) - dateValue(a.last_seen_at);
      if (sortOrder === "plan") return planRank(getPlan(b)) - planRank(getPlan(a));
      return dateValue(b.created_at) - dateValue(a.created_at);
    });

    return result;
  }, [users, search, planFilter, sortOrder]);

  return (
    <div style={pageStyle}>
      <style jsx global>{`
        @media (min-width: 900px) {
          .users-mobile-list { display: none !important; }
          .users-desktop-table { display: block !important; }
        }
      `}</style>

      <div style={pageHeaderStyle}>
        <h1 style={pageTitleStyle}>Users</h1>
        <p style={pageSubtitleStyle}>Nutzer mit Abo Plan, Coins, Card Points und Details.</p>
      </div>

      <div style={kpiGridStyle}>
        <KpiCard title="Total Users" value={loading ? "..." : formatNumber(stats.total)} />
        <KpiCard title="Paid Plans" value={loading ? "..." : formatNumber(stats.paidPlans)} />
        <KpiCard title="Master" value={loading ? "..." : formatNumber(stats.masterPlans)} />
        <KpiCard title="Admins" value={loading ? "..." : formatNumber(stats.admins)} />
        <KpiCard title="Coins gesamt" value={loading ? "..." : formatNumber(stats.totalCoins)} />
        <KpiCard title="Card Points gesamt" value={loading ? "..." : formatNumber(stats.totalPoints)} />
      </div>

      {loadError && (
        <div style={errorCardStyle}>
          <strong>Fehler beim Laden der User</strong>
          <p style={errorTextStyle}>{loadError}</p>
        </div>
      )}

      <div style={filterCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>Filter</h3>
          <span style={sectionCountStyle}>{loading ? "Lade..." : `${filteredUsers.length} Nutzer`}</span>
        </div>

        <div style={filterGridStyle}>
          <div>
            <label style={labelStyle}>Suche</label>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="E-Mail, Username, Abo, ID" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Abo Plan</label>
            <select value={planFilter} onChange={(event) => setPlanFilter(event.target.value as PlanFilter)} style={inputStyle}>
              <option value="all">Alle Pläne</option>
              {plans.map((plan) => <option key={plan} value={plan}>{planLabel(plan)}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Sortierung</label>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} style={inputStyle}>
              <option value="newest">Neueste zuerst</option>
              <option value="plan">Abo Plan</option>
              <option value="coinsHigh">Coins hoch zu niedrig</option>
              <option value="pointsHigh">Card Points hoch zu niedrig</option>
              <option value="lastSeen">Zuletzt aktiv</option>
            </select>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <div style={sectionHeaderStyle}>
          <h3 style={sectionTitleStyle}>User-Liste</h3>
          <span style={sectionCountStyle}>{loading ? "Lade..." : `${filteredUsers.length} Nutzer`}</span>
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
                      <div style={mobileValueStrongStyle}>{user.username || "—"}</div>
                      <div style={mobileEmailStyle}>{user.email || "Keine E-Mail"}</div>
                    </div>
                    <Link href={`/admin/users/${user.id}`} style={detailsButtonStyle}>Details</Link>
                  </div>

                  <div style={mobileInfoGridStyle}>
                    <InfoItem label="Abo" value={planDisplay(user)} />
                    <InfoItem label="Coins" value={formatNumber(user.coins)} />
                    <InfoItem label="Card Points" value={formatNumber(user.card_points)} />
                    <InfoItem label="Admin" value={user.is_admin ? "Ja" : "Nein"} />
                    <InfoItem label="Last Seen" value={formatDate(user.last_seen_at)} />
                    <InfoItem label="Registriert" value={formatDate(user.created_at)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="users-desktop-table" style={desktopTableWrapperStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1050px" }}>
                <thead>
                  <tr style={{ background: "#111814", textAlign: "left" }}>
                    <th style={tableHeaderStyle}>Username</th>
                    <th style={tableHeaderStyle}>E-Mail</th>
                    <th style={tableHeaderStyle}>Abo Plan</th>
                    <th style={tableHeaderStyle}>Coins</th>
                    <th style={tableHeaderStyle}>Card Points</th>
                    <th style={tableHeaderStyle}>Admin</th>
                    <th style={tableHeaderStyle}>Last Seen</th>
                    <th style={tableHeaderStyle}>Registriert am</th>
                    <th style={tableHeaderStyle}>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderTop: "1px solid #27312d" }}>
                      <td style={tableCellStyle}>{user.username || "—"}</td>
                      <td style={tableCellStyle}>{user.email || "—"}</td>
                      <td style={tableCellStyle}>
                        <div style={planCellStyle}>
                          <span style={planBadgeStyle(getPlan(user))}>{planDisplay(user)}</span>
                          {user.subscription_expires_at && <span style={planSublineStyle}>bis {formatDate(user.subscription_expires_at)}</span>}
                        </div>
                      </td>
                      <td style={tableCellStyle}>{formatNumber(user.coins)}</td>
                      <td style={tableCellStyle}>{formatNumber(user.card_points)}</td>
                      <td style={tableCellStyle}>{user.is_admin ? "Admin" : "User"}</td>
                      <td style={tableCellStyle}>{formatDate(user.last_seen_at)}</td>
                      <td style={tableCellStyle}>{formatDate(user.created_at)}</td>
                      <td style={tableCellStyle}><Link href={`/admin/users/${user.id}`} style={tableButtonStyle}>Details</Link></td>
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

function KpiCard({ title, value }: { title: string; value: string }) { return <div style={kpiCardStyle}><p style={kpiTitleStyle}>{title}</p><h3 style={kpiValueStyle}>{value}</h3></div>; }
function InfoItem({ label, value }: { label: string; value: string }) { return <div style={infoItemStyle}><div style={infoLabelStyle}>{label}</div><div style={infoValueStyle}>{value}</div></div>; }
function safeNumber(value: number | null | undefined) { return typeof value === "number" && !Number.isNaN(value) ? value : 0; }
function dateValue(value: string | null | undefined) { if (!value) return 0; const t = new Date(value).getTime(); return Number.isNaN(t) ? 0 : t; }
function formatNumber(value: number | null | undefined) { return safeNumber(value).toLocaleString("de-DE"); }
function formatDate(value: string | null | undefined) { if (!value) return "—"; const d = new Date(value); if (Number.isNaN(d.getTime())) return "—"; return d.toLocaleString("de-DE"); }
function getPlan(user: Profile): PlanFilter { const plan = (user.subscription_variant || "free").toLowerCase().trim(); if (plan === "basic" || plan === "pro" || plan === "elite" || plan === "master") return plan; return "free"; }
function planRank(plan: PlanFilter) { if (plan === "master") return 5; if (plan === "elite") return 4; if (plan === "pro") return 3; if (plan === "basic") return 2; return 1; }
function planLabel(plan: PlanFilter) { return plan.charAt(0).toUpperCase() + plan.slice(1); }
function planDisplay(user: Profile) { const plan = getPlan(user); const raw = (user.subscription_raw_variant || "free").toLowerCase(); const status = (user.subscription_status || "none").toLowerCase(); if (plan === "free" && raw !== "free" && raw !== "" && raw !== "none") return `Free (${raw}/${status})`; return planLabel(plan); }
function planBadgeStyle(plan: PlanFilter): CSSProperties { if (plan === "master") return masterPlanBadgeStyle; if (plan === "elite") return elitePlanBadgeStyle; if (plan === "pro") return proPlanBadgeStyle; if (plan === "basic") return basicPlanBadgeStyle; return freePlanBadgeStyle; }

const pageStyle: CSSProperties = { width: "100%" };
const pageHeaderStyle: CSSProperties = { marginBottom: "20px" };
const pageTitleStyle: CSSProperties = { marginTop: 0, marginBottom: "8px", fontSize: "30px", color: "#e7f1eb" };
const pageSubtitleStyle: CSSProperties = { marginTop: 0, color: "#94a39b", lineHeight: 1.5 };
const kpiGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" };
const kpiCardStyle: CSSProperties = { background: "#171f1c", padding: "16px", borderRadius: "16px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const kpiTitleStyle: CSSProperties = { margin: 0, fontSize: "13px", color: "#94a39b" };
const kpiValueStyle: CSSProperties = { margin: "10px 0 0 0", fontSize: "23px", color: "#e7f1eb", wordBreak: "break-word" };
const errorCardStyle: CSSProperties = { background: "#331717", border: "1px solid #7f1d1d", borderRadius: "16px", padding: "16px", marginBottom: "20px", color: "#fecaca" };
const errorTextStyle: CSSProperties = { margin: "8px 0 0 0", color: "#fecaca" };
const filterCardStyle: CSSProperties = { background: "#171f1c", borderRadius: "16px", padding: "18px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)", marginBottom: "20px" };
const tableCardStyle: CSSProperties = { background: "#171f1c", borderRadius: "16px", padding: "18px", border: "1px solid #27312d", boxShadow: "0 8px 30px rgba(0,0,0,0.16)" };
const sectionHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#e7f1eb" };
const sectionCountStyle: CSSProperties = { color: "#94a39b", fontSize: "14px" };
const filterGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" };
const labelStyle: CSSProperties = { display: "block", marginBottom: "8px", fontWeight: 700, color: "#cfe0d6" };
const inputStyle: CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #27312d", background: "#0f1512", color: "#e7f1eb", boxSizing: "border-box", minHeight: "46px" };
const emptyTextStyle: CSSProperties = { color: "#94a39b", margin: 0 };
const mobileListStyle: CSSProperties = { display: "grid", gap: "14px" };
const mobileCardStyle: CSSProperties = { background: "#101714", border: "1px solid #27312d", borderRadius: "16px", padding: "16px" };
const mobileCardTopStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" };
const mobileLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "4px" };
const mobileValueStrongStyle: CSSProperties = { fontSize: "18px", fontWeight: 700, color: "#e7f1eb", wordBreak: "break-word" };
const mobileEmailStyle: CSSProperties = { marginTop: "4px", fontSize: "12px", color: "#94a39b", wordBreak: "break-word" };
const mobileInfoGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" };
const infoItemStyle: CSSProperties = { background: "#171f1c", border: "1px solid #27312d", borderRadius: "12px", padding: "12px" };
const infoLabelStyle: CSSProperties = { fontSize: "12px", color: "#94a39b", marginBottom: "6px" };
const infoValueStyle: CSSProperties = { fontSize: "14px", color: "#e7f1eb", wordBreak: "break-word" };
const detailsButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "40px", padding: "8px 12px", borderRadius: "12px", background: "#22c55e", color: "#08130c", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" };
const desktopTableWrapperStyle: CSSProperties = { overflowX: "auto", marginTop: "18px", display: "none" };
const tableHeaderStyle: CSSProperties = { padding: "12px", fontSize: "14px", fontWeight: 700, color: "#cfe0d6", borderBottom: "1px solid #27312d", whiteSpace: "nowrap" };
const tableCellStyle: CSSProperties = { padding: "12px", fontSize: "14px", color: "#e7f1eb", verticalAlign: "top", whiteSpace: "nowrap" };
const tableButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "40px", padding: "8px 12px", borderRadius: "10px", background: "#22c55e", color: "#08130c", fontWeight: 700, textDecoration: "none" };
const planCellStyle: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" };
const planSublineStyle: CSSProperties = { color: "#94a39b", fontSize: "11px" };
const freePlanBadgeStyle: CSSProperties = { display: "inline-flex", padding: "6px 10px", borderRadius: "999px", background: "#1f2937", color: "#d1d5db", fontSize: "12px", fontWeight: 900 };
const basicPlanBadgeStyle: CSSProperties = { ...freePlanBadgeStyle, background: "#10233a", color: "#93c5fd" };
const proPlanBadgeStyle: CSSProperties = { ...freePlanBadgeStyle, background: "#163322", color: "#86efac" };
const elitePlanBadgeStyle: CSSProperties = { ...freePlanBadgeStyle, background: "#3b1f4a", color: "#e9d5ff" };
const masterPlanBadgeStyle: CSSProperties = { ...freePlanBadgeStyle, background: "#4a2f10", color: "#fde68a" };
