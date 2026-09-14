"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../../../lib/supabase";

type ReportStatus = "open" | "done" | "rejected";

type ChatReport = {
  id: string;
  reporter_id: string;
  reporter_username: string | null;
  reporter_email: string | null;
  reported_user_id: string;
  reported_username_snapshot: string | null;
  reported_username: string | null;
  reported_email: string | null;
  message_type: "direct" | "group";
  message_id: string;
  group_id: string | null;
  message_snapshot: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
};

const reasonLabel: Record<string, string> = {
  abuse: "Beleidigung",
  harassment: "Belästigung",
  spam: "Spam",
  inappropriate: "Unangemessener Inhalt",
  other: "Sonstiges",
};

const statusLabel: Record<ReportStatus, string> = {
  open: "Offen",
  done: "Erledigt",
  rejected: "Abgelehnt",
};

export default function ModerationPage() {
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [filter, setFilter] = useState<"all" | ReportStatus>("open");
  const [loading, setLoading] = useState(true);
  const [busyReportId, setBusyReportId] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("admin_list_chat_reports", {
      p_status: filter === "all" ? null : filter,
      p_limit: 500,
    });

    if (error) {
      console.error("Moderationsmeldungen konnten nicht geladen werden:", error);
      setReports([]);
      setErrorMessage(
        error.message || "Moderationsmeldungen konnten nicht geladen werden."
      );
    } else {
      setReports((data as ChatReport[]) || []);
    }

    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const counts = useMemo(() => {
    // Bei gefilterter Ansicht kennen wir nur den geladenen Ausschnitt.
    // "Offen" wird trotzdem direkt und prominent angezeigt.
    return {
      loaded: reports.length,
      open: reports.filter((report) => report.status === "open").length,
    };
  }, [reports]);

  async function setStatus(reportId: string, status: ReportStatus) {
    if (busyReportId) return;

    setBusyReportId(reportId);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc(
      "admin_set_chat_report_status",
      {
        p_report_id: reportId,
        p_status: status,
      }
    );

    const payload = (data || {}) as { success?: boolean; code?: string };

    if (error || payload.success !== true) {
      setErrorMessage(
        error?.message ||
          payload.code ||
          "Status der Meldung konnte nicht aktualisiert werden."
      );
      setBusyReportId(null);
      return;
    }

    setMessage(`Meldung als „${statusLabel[status]}“ markiert.`);
    setBusyReportId(null);
    await loadReports();
  }

  async function banReportedUser(report: ChatReport) {
    if (busyUserId) return;

    const label =
      report.reported_username ||
      report.reported_username_snapshot ||
      report.reported_email ||
      report.reported_user_id;

    const accepted = window.confirm(
      `${label}\n\nAnmeldung dieses Nutzers wirklich sperren?\n\nDie Meldung bleibt im Moderationsarchiv erhalten.`
    );
    if (!accepted) return;

    setBusyUserId(report.reported_user_id);
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.functions.invoke(
      "admin-user-management",
      {
        body: {
          action: "ban",
          userId: report.reported_user_id,
        },
      }
    );

    const payload = (data || {}) as { ok?: boolean; error?: string };

    if (error || payload.ok !== true) {
      setErrorMessage(
        error?.message ||
          payload.error ||
          "Nutzer konnte nicht gesperrt werden."
      );
      setBusyUserId(null);
      return;
    }

    setMessage(`${label} wurde gesperrt.`);
    setBusyUserId(null);
  }

  return (
    <main style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <div style={eyebrowStyle}>CARDLETICS ADMIN</div>
          <h1 style={titleStyle}>Moderation</h1>
          <p style={subtitleStyle}>
            Gemeldete Chat-Nachrichten prüfen, abschließen und bei Bedarf
            Nutzer sperren.
          </p>
        </div>

        <div style={headerActionsStyle}>
          <Link href="/admin" style={secondaryButtonStyle}>
            Dashboard
          </Link>
          <button
            type="button"
            onClick={() => void loadReports()}
            disabled={loading}
            style={secondaryButtonStyle}
          >
            {loading ? "Lädt …" : "Aktualisieren"}
          </button>
        </div>
      </div>

      <section style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Geladen</div>
          <div style={statValueStyle}>{counts.loaded}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Offen in dieser Ansicht</div>
          <div style={{ ...statValueStyle, color: "#facc15" }}>
            {counts.open}
          </div>
        </div>
      </section>

      <div style={filterRowStyle}>
        {(["open", "done", "rejected", "all"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            style={filterButtonStyle(filter === value)}
          >
            {value === "all" ? "Alle" : statusLabel[value]}
          </button>
        ))}
      </div>

      {message ? <div style={successStyle}>{message}</div> : null}
      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

      {loading ? (
        <div style={emptyStyle}>Moderationsmeldungen werden geladen …</div>
      ) : reports.length === 0 ? (
        <div style={emptyStyle}>
          Keine Meldungen für den gewählten Filter vorhanden.
        </div>
      ) : (
        <div style={reportListStyle}>
          {reports.map((report) => {
            const reportedLabel =
              report.reported_username ||
              report.reported_username_snapshot ||
              report.reported_email ||
              report.reported_user_id;

            const reporterLabel =
              report.reporter_username ||
              report.reporter_email ||
              report.reporter_id;

            const busy =
              busyReportId === report.id ||
              busyUserId === report.reported_user_id;

            return (
              <article key={report.id} style={reportCardStyle}>
                <div style={reportTopStyle}>
                  <div>
                    <div style={badgesStyle}>
                      <span style={statusBadgeStyle(report.status)}>
                        {statusLabel[report.status]}
                      </span>
                      <span style={neutralBadgeStyle}>
                        {report.message_type === "direct"
                          ? "Direktchat"
                          : "Gruppenchat"}
                      </span>
                      <span style={reasonBadgeStyle}>
                        {reasonLabel[report.reason] || report.reason}
                      </span>
                    </div>

                    <h2 style={reportTitleStyle}>{reportedLabel}</h2>
                    <div style={metaStyle}>
                      Gemeldet von {reporterLabel} ·{" "}
                      {formatDate(report.created_at)}
                    </div>
                  </div>

                  <Link
                    href={`/admin/users/${report.reported_user_id}`}
                    style={smallLinkStyle}
                  >
                    Nutzer öffnen
                  </Link>
                </div>

                <div style={messageBoxStyle}>
                  <div style={messageLabelStyle}>Gemeldete Nachricht</div>
                  <div style={messageTextStyle}>{report.message_snapshot}</div>
                </div>

                {report.details ? (
                  <div style={detailsBoxStyle}>
                    <strong>Zusatzangaben:</strong> {report.details}
                  </div>
                ) : null}

                <div style={idGridStyle}>
                  <div>
                    <span style={idLabelStyle}>Report-ID</span>
                    <code style={codeStyle}>{report.id}</code>
                  </div>
                  <div>
                    <span style={idLabelStyle}>Message-ID</span>
                    <code style={codeStyle}>{report.message_id}</code>
                  </div>
                </div>

                <div style={actionsStyle}>
                  <button
                    type="button"
                    disabled={busy || report.status === "done"}
                    onClick={() => void setStatus(report.id, "done")}
                    style={actionButtonStyle("#166534")}
                  >
                    Erledigt
                  </button>
                  <button
                    type="button"
                    disabled={busy || report.status === "rejected"}
                    onClick={() => void setStatus(report.id, "rejected")}
                    style={actionButtonStyle("#334155")}
                  >
                    Ablehnen
                  </button>
                  {report.status !== "open" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setStatus(report.id, "open")}
                      style={actionButtonStyle("#854d0e")}
                    >
                      Wieder öffnen
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void banReportedUser(report)}
                    style={actionButtonStyle("#b91c1c")}
                  >
                    {busyUserId === report.reported_user_id
                      ? "Sperrt …"
                      : "Nutzer sperren"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "32px",
  background:
    "radial-gradient(circle at top left, rgba(34,197,94,.15), transparent 32%), #07120c",
  color: "#f8fafc",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const eyebrowStyle: CSSProperties = {
  color: "#86efac",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 1.8,
};

const titleStyle: CSSProperties = {
  fontSize: 34,
  lineHeight: 1.05,
  margin: "8px 0 8px",
};

const subtitleStyle: CSSProperties = {
  color: "#94a3b8",
  maxWidth: 720,
  margin: 0,
  lineHeight: 1.5,
};

const headerActionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.055)",
  color: "#f8fafc",
  borderRadius: 12,
  padding: "10px 14px",
  textDecoration: "none",
  fontWeight: 800,
  cursor: "pointer",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 26,
};

const statCardStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 18,
  padding: 16,
  background: "rgba(8,30,19,.78)",
};

const statLabelStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: 800,
};

const statValueStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 950,
  marginTop: 5,
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 22,
  marginBottom: 18,
};

function filterButtonStyle(active: boolean): CSSProperties {
  return {
    border: active
      ? "1px solid rgba(134,239,172,.55)"
      : "1px solid rgba(255,255,255,.1)",
    background: active ? "rgba(22,101,52,.55)" : "rgba(255,255,255,.045)",
    color: active ? "#dcfce7" : "#cbd5e1",
    borderRadius: 999,
    padding: "9px 13px",
    cursor: "pointer",
    fontWeight: 850,
  };
}

const successStyle: CSSProperties = {
  background: "rgba(22,101,52,.3)",
  border: "1px solid rgba(134,239,172,.3)",
  color: "#dcfce7",
  borderRadius: 14,
  padding: 12,
  marginBottom: 14,
};

const errorStyle: CSSProperties = {
  background: "rgba(153,27,27,.28)",
  border: "1px solid rgba(248,113,113,.3)",
  color: "#fecaca",
  borderRadius: 14,
  padding: 12,
  marginBottom: 14,
};

const emptyStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 18,
  padding: 28,
  color: "#94a3b8",
  background: "rgba(8,30,19,.72)",
};

const reportListStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const reportCardStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 20,
  padding: 18,
  background: "rgba(8,30,19,.82)",
  boxShadow: "0 14px 40px rgba(0,0,0,.22)",
};

const reportTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const badgesStyle: CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
};

function statusBadgeStyle(status: ReportStatus): CSSProperties {
  const map: Record<ReportStatus, string> = {
    open: "#facc15",
    done: "#86efac",
    rejected: "#94a3b8",
  };
  return {
    color: map[status],
    border: `1px solid ${map[status]}55`,
    background: `${map[status]}14`,
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 900,
  };
}

const neutralBadgeStyle: CSSProperties = {
  color: "#bae6fd",
  border: "1px solid rgba(125,211,252,.28)",
  background: "rgba(14,116,144,.14)",
  borderRadius: 999,
  padding: "4px 8px",
  fontSize: 11,
  fontWeight: 900,
};

const reasonBadgeStyle: CSSProperties = {
  color: "#fdba74",
  border: "1px solid rgba(251,146,60,.28)",
  background: "rgba(154,52,18,.14)",
  borderRadius: 999,
  padding: "4px 8px",
  fontSize: 11,
  fontWeight: 900,
};

const reportTitleStyle: CSSProperties = {
  margin: "10px 0 4px",
  fontSize: 20,
};

const metaStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 12,
};

const smallLinkStyle: CSSProperties = {
  color: "#86efac",
  textDecoration: "none",
  fontWeight: 850,
  fontSize: 13,
};

const messageBoxStyle: CSSProperties = {
  marginTop: 16,
  padding: 15,
  borderRadius: 14,
  background: "rgba(2,6,23,.52)",
  border: "1px solid rgba(255,255,255,.07)",
};

const messageLabelStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const messageTextStyle: CSSProperties = {
  marginTop: 8,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  lineHeight: 1.55,
  color: "#f8fafc",
};

const detailsBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: 12,
  color: "#cbd5e1",
  background: "rgba(255,255,255,.035)",
};

const idGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 10,
  marginTop: 14,
};

const idLabelStyle: CSSProperties = {
  display: "block",
  color: "#64748b",
  fontSize: 10,
  fontWeight: 900,
  marginBottom: 4,
};

const codeStyle: CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  overflowWrap: "anywhere",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 16,
};

function actionButtonStyle(background: string): CSSProperties {
  return {
    border: "1px solid rgba(255,255,255,.1)",
    background,
    color: "#fff",
    borderRadius: 10,
    padding: "9px 12px",
    fontWeight: 850,
    cursor: "pointer",
  };
}
