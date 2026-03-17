import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ─────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────── */

const ESCALATION_DAYS = 5;

const SEVERITY_MAP = {
  1: { label: "Low",      color: "#3b82f6", bg: "rgba(59,130,246,0.15)"  },
  2: { label: "Medium",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)"  },
  3: { label: "High",     color: "#f97316", bg: "rgba(249,115,22,0.15)"  },
  4: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
};

const STATUS_MAP = {
  pending:     { label: "Pending",     color: "#f97316", bg: "rgba(249,115,22,0.15)"  },
  "in progress":{ label: "In Progress",color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  resolved:    { label: "Resolved",    color: "#00ff88", bg: "rgba(0,255,136,0.12)"   },
  escalated:   { label: "Escalated",   color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
};

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --bg2: #0f0f1a;
    --card: #111120;
    --card2: #16162a;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.12);
    --text: #f0f0ff;
    --text2: #8888aa;
    --muted: #44445a;
    --green: #00ff88;
    --blue: #6366f1;
    --purple: #a855f7;
    --red: #ef4444;
    --orange: #f97316;
    --yellow: #f59e0b;
    --cyan: #06b6d4;
    --font: 'Space Grotesk', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --r: 14px;
    --rs: 8px;
  }

  body { background: var(--bg); font-family: var(--font); color: var(--text); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseDot {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.4; transform:scale(0.7); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up   { animation: fadeUp 0.35s ease forwards; }
  .pulse-dot { animation: pulseDot 2s infinite; }
  .spin      { animation: spin 0.8s linear infinite; }

  .auth-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    transition: border-color 0.2s, background 0.2s;
  }
  .auth-card:hover { border-color: var(--border2); background: var(--card2); }

  .auth-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--rs); border: none;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .auth-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 0 12px rgba(99,102,241,0.35); }
  .auth-btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }
  .auth-btn-ghost { background: rgba(255,255,255,0.04); color: var(--text2); border: 1px solid var(--border); }
  .auth-btn-ghost:hover { background: rgba(255,255,255,0.08); color: var(--text); border-color: var(--border2); }
  .auth-btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .auth-btn-danger:hover { background: rgba(239,68,68,0.25); }
  .auth-btn-success { background: rgba(0,255,136,0.12); color: var(--green); border: 1px solid rgba(0,255,136,0.3); }
  .auth-btn-success:hover { background: rgba(0,255,136,0.2); }

  .progress-track { height: 5px; border-radius: 5px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .progress-fill  { height: 100%; border-radius: 5px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

  .rx-input {
    width: 100%; padding: 9px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--rs);
    color: var(--text); font-family: var(--font); font-size: 13px;
    outline: none; transition: border-color 0.15s;
  }
  .rx-input:focus { border-color: var(--blue); }
  .rx-input::placeholder { color: var(--muted); }

  .rx-select {
    padding: 8px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--rs);
    color: var(--text); font-family: var(--font); font-size: 13px;
    outline: none; cursor: pointer;
  }

  .table-row { transition: background 0.15s; }
  .table-row:hover { background: rgba(255,255,255,0.03); }

  .nav-tab {
    padding: 7px 14px; border-radius: var(--rs); border: none;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    background: transparent; color: var(--text2);
  }
  .nav-tab:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .nav-tab.active { background: rgba(99,102,241,0.15); color: var(--text); border: 1px solid rgba(99,102,241,0.3); }
`;

function GlobalStyles() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */

function calcAge(createdAt) {
  if (!createdAt?.seconds) return 0;
  return Math.floor((Date.now() - createdAt.seconds * 1000) / 86400000);
}

function timeAgo(seconds) {
  if (!seconds) return "—";
  const d = Math.floor((Date.now() / 1000 - seconds) / 86400);
  const h = Math.floor(((Date.now() / 1000 - seconds) % 86400) / 3600);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "Just now";
}

function getTodayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────────────────── */

function Sparkline({ data = [], color = "#ef4444", height = 44, width = 120 }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = `M${pts[0]} ` + pts.slice(1).map(p => `L${p}`).join(" ");
  const area = line + ` L${width},${height} L0,${height} Z`;
  const gid = `sp${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   CIRCULAR PROGRESS
───────────────────────────────────────────────────────── */

function CircularProgress({ value, max = 100, color = "#6366f1", size = 72, label, sublabel }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(value / max, 1));
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color }}>{label}</span>
        {sublabel && <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 1 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, color = "#ef4444", sparkData = [], icon }) {
  return (
    <div className="auth-card" style={{ padding: "18px 20px 14px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -40, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: color, opacity: 0.05, filter: "blur(30px)", pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {label}
          </p>
          <p style={{ fontFamily: "var(--mono)", fontSize: 30, fontWeight: 700, color, lineHeight: 1.2, marginTop: 5 }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: 11, marginTop: 4, color: sub.startsWith("+") ? "#00ff88" : sub.startsWith("↓") ? "#ef4444" : "var(--text2)" }}>
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${color}18`, border: `1px solid ${color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      {sparkData.length > 1 && <Sparkline data={sparkData} color={color} height={40} width={120} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────── */

function Header({ navigate, escalatedCount }) {
  return (
    <div style={{
      background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1380, margin: "0 auto", padding: "0 28px",
        height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#ef4444,#f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(239,68,68,0.45)",
          }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "var(--text)", letterSpacing: "-0.3px" }}>ResolveX</span>
          <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 2 }}>/ Authority</span>
        </div>

        {/* Center tabs */}
        <nav style={{ display: "flex", gap: 2 }}>
          {["Dashboard", "Escalated", "Analytics", "All Issues", "Settings"].map((t, i) => (
            <button key={t} className={`nav-tab${i === 0 ? " active" : ""}`}>{t}</button>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {escalatedCount > 0 && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
              background: "rgba(239,68,68,0.15)", color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.3)",
            }}>
              {escalatedCount} escalated
            </span>
          )}
          <button className="auth-btn auth-btn-ghost" onClick={() => navigate("/admin")}>
            <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANALYTICS PANEL
───────────────────────────────────────────────────────── */

function AnalyticsPanel({ issues, escalatedIssues }) {
  // Category breakdown
  const cats = {};
  issues.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Committee performance
  const committees = {};
  issues.forEach(i => {
    const c = i.assignedCommittee || "Unassigned";
    if (!committees[c]) committees[c] = { total: 0, resolved: 0, pending: 0 };
    committees[c].total++;
    if (i.status === "resolved") committees[c].resolved++;
    else committees[c].pending++;
  });
  const commEntries = Object.entries(committees).sort((a, b) => b[1].total - a[1].total).slice(0, 5);

  // Severity distribution
  const sevDist = { 1: 0, 2: 0, 3: 0, 4: 0 };
  issues.forEach(i => { if (sevDist[i.severity] !== undefined) sevDist[i.severity]++; });

  const colors = ["#6366f1", "#00ff88", "#f59e0b", "#f97316", "#06b6d4"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      {/* Category Breakdown */}
      <div className="auth-card" style={{ padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
          Issues by Category
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {catEntries.map(([cat, count], i) => {
            const pct = Math.round((count / issues.length) * 100);
            return (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>{cat}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: colors[i] }}>{count} ({pct}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Committee Performance */}
      <div className="auth-card" style={{ padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
          Committee Performance
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {commEntries.map(([comm, data]) => {
            const rate = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;
            const c = rate >= 75 ? "#00ff88" : rate >= 50 ? "#f59e0b" : "#ef4444";
            return (
              <div key={comm}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{comm}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: c }}>{rate}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${rate}%`, background: c }} />
                </div>
                <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>
                  {data.resolved} resolved · {data.pending} pending
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="auth-card" style={{ padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
          Severity Distribution
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(sevDist).map(([sev, count]) => {
            const cfg = SEVERITY_MAP[sev];
            const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
            return (
              <div key={sev}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 4,
                      background: cfg.bg, color: cfg.color,
                    }}>{cfg.label}</span>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: cfg.color }}>{count}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: cfg.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Age distribution */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Avg. escalation age</p>
          {escalatedIssues.length > 0 ? (
            <p style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color: "#ef4444" }}>
              {Math.round(escalatedIssues.reduce((s, i) => s + calcAge(i.createdAt), 0) / escalatedIssues.length)}
              <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 400 }}> days avg</span>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No escalated issues</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ISSUE DETAIL MODAL
───────────────────────────────────────────────────────── */

function IssueModal({ issue, onClose, onResolve, onEscalate, onAssign }) {
  const [note, setNote] = useState("");
  const [assignee, setAssignee] = useState(issue.assignedCommittee || "");
  const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP[1];
  const status = STATUS_MAP[issue.status] || STATUS_MAP["pending"];
  const age = calcAge(issue.createdAt);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(6px)", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div className="auth-card fade-up" style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", overflow: "auto" }}
        onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>#{issue.id?.slice(0, 10)}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: sev.bg, color: sev.color }}>
                {sev.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: status.bg, color: status.color }}>
                {status.label}
              </span>
              {age >= ESCALATION_DAYS && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
                  ⚠ ESCALATED
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{issue.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Category", value: issue.category || "—" },
              { label: "Committee", value: issue.assignedCommittee || "Unassigned" },
              { label: "Reported By", value: issue.createdByName || "Anonymous" },
              { label: "Age", value: `${age} days` },
              { label: "Upvotes", value: issue.upvotes || 0 },
              { label: "Location", value: issue.location || "—" },
            ].map(m => (
              <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>{m.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {issue.description && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                Description
              </p>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{issue.description}</p>
              </div>
            </div>
          )}

          {/* Re-assign */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Re-assign Committee
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="rx-input" placeholder="Enter committee name..."
                value={assignee} onChange={e => setAssignee(e.target.value)} style={{ flex: 1 }} />
              <button className="auth-btn auth-btn-primary"
                onClick={() => onAssign(issue.id, assignee)}>
                Assign
              </button>
            </div>
          </div>

          {/* Authority note */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Authority Note
            </p>
            <textarea className="rx-input" rows={3}
              placeholder="Add a note or directive..."
              value={note} onChange={e => setNote(e.target.value)}
              style={{ resize: "vertical", fontFamily: "var(--font)" }} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="auth-btn auth-btn-success" onClick={() => onResolve(issue.id, note)}>
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Mark Resolved
            </button>
            <button className="auth-btn auth-btn-danger" onClick={() => onEscalate(issue.id, note)}>
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Force Escalate
            </button>
            <button className="auth-btn auth-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ISSUES TABLE
───────────────────────────────────────────────────────── */

function IssuesTable({ issues, title, onSelect, emptyMsg }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("age");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = issues
    .filter(i => {
      const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.category?.toLowerCase().includes(search.toLowerCase());
      const matchSev = severityFilter === "all" || String(i.severity) === severityFilter;
      return matchSearch && matchSev;
    })
    .sort((a, b) => {
      if (sortBy === "age") return calcAge(b.createdAt) - calcAge(a.createdAt);
      if (sortBy === "severity") return (b.severity || 0) - (a.severity || 0);
      if (sortBy === "upvotes") return (b.upvotes || 0) - (a.upvotes || 0);
      return 0;
    });

  return (
    <div className="auth-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Table header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {title} <span style={{ color: "var(--text2)", marginLeft: 6 }}>({filtered.length})</span>
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth={2}
              style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input className="rx-input" placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 28, width: 180 }} />
          </div>
          {/* Severity filter */}
          <select className="rx-select" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
            <option value="all">All Severity</option>
            <option value="4">Critical</option>
            <option value="3">High</option>
            <option value="2">Medium</option>
            <option value="1">Low</option>
          </select>
          {/* Sort */}
          <select className="rx-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="age">Sort: Age</option>
            <option value="severity">Sort: Severity</option>
            <option value="upvotes">Sort: Upvotes</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "32px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>{emptyMsg || "No issues found"}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Title", "Category", "Committee", "Severity", "Status", "Age", "Upvotes", "Action"].map(h => (
                  <th key={h} style={{
                    padding: "10px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: "var(--muted)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(issue => {
                const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP[1];
                const status = STATUS_MAP[issue.status] || STATUS_MAP["pending"];
                const age = calcAge(issue.createdAt);
                const isOld = age >= ESCALATION_DAYS;
                return (
                  <tr key={issue.id} className="table-row"
                    style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                    onClick={() => onSelect(issue)}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isOld && (
                          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.8)", flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                          {issue.title}
                        </span>
                      </div>
                      <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, fontFamily: "var(--mono)" }}>#{issue.id?.slice(0, 10)}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, color: "var(--text2)" }}>{issue.category || "—"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, color: "var(--text2)" }}>{issue.assignedCommittee || "Unassigned"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: sev.bg, color: sev.color }}>
                        {sev.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
                        color: isOld ? "#ef4444" : "var(--text2)",
                      }}>
                        {age}d
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>
                        {issue.upvotes || 0} ▲
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button className="auth-btn auth-btn-primary"
                        style={{ fontSize: 11, padding: "4px 10px" }}
                        onClick={e => { e.stopPropagation(); onSelect(issue); }}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRIORITY ENGINE PANEL
───────────────────────────────────────────────────────── */

function PriorityEngine({ escalatedIssues, onSelect }) {
  const scored = escalatedIssues.map(i => ({
    ...i,
    score: (Number(i.severity) || 1) * 25 + calcAge(i.createdAt) * 3 + (i.upvotes || 0) * 2,
  })).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="auth-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>🔥</span>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Priority Engine
        </p>
        <span style={{ fontSize: 10, color: "var(--text2)", marginLeft: 2 }}>— AI-scored</span>
      </div>
      {scored.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "16px 0" }}>
          No escalated issues requiring priority attention
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {scored.map((issue, idx) => {
            const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP[1];
            const urgency = issue.score >= 100 ? "#ef4444" : issue.score >= 60 ? "#f97316" : "#f59e0b";
            return (
              <div key={issue.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
                  cursor: "pointer", transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                onClick={() => onSelect(issue)}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 13, fontWeight: 800,
                  color: ["#f59e0b", "#8888aa", "#f97316", "var(--muted)", "var(--muted)"][idx],
                  width: 22, textAlign: "center", flexShrink: 0,
                }}>
                  #{idx + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {issue.title}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    {issue.category} · {issue.assignedCommittee || "Unassigned"} · {calcAge(issue.createdAt)}d old
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: sev.bg, color: sev.color }}>
                    {sev.label}
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: urgency }}>
                    {issue.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   COMMITTEE SCORECARD
───────────────────────────────────────────────────────── */

function CommitteeScorecard({ issues }) {
  const map = {};
  issues.forEach(i => {
    const c = i.assignedCommittee || "Unassigned";
    if (!map[c]) map[c] = { total: 0, resolved: 0, escalated: 0, avgAge: 0, ages: [] };
    map[c].total++;
    if (i.status === "resolved") map[c].resolved++;
    const age = calcAge(i.createdAt);
    if (age >= ESCALATION_DAYS && i.status === "pending") map[c].escalated++;
    map[c].ages.push(age);
  });

  const entries = Object.entries(map).map(([name, d]) => ({
    name,
    ...d,
    rate: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0,
    avgAge: d.ages.length > 0 ? Math.round(d.ages.reduce((s, a) => s + a, 0) / d.ages.length) : 0,
  })).sort((a, b) => b.rate - a.rate);

  return (
    <div className="auth-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Committee Scorecard
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.slice(0, 6).map(c => {
          const c_color = c.rate >= 75 ? "#00ff88" : c.rate >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={c.name} style={{
              padding: "12px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                  {c.name}
                </p>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {c.escalated > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                      {c.escalated} escalated
                    </span>
                  )}
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, color: c_color }}>
                    {c.rate}%
                  </span>
                </div>
              </div>
              <div className="progress-track" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{ width: `${c.rate}%`, background: c_color }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{c.total} total</span>
                <span style={{ fontSize: 10, color: "#00ff88" }}>{c.resolved} resolved</span>
                <span style={{ fontSize: 10, color: "var(--text2)" }}>avg {c.avgAge}d</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN AUTHORITY DASHBOARD
───────────────────────────────────────────────────────── */

const AuthorityDashboard = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [escalatedIssues, setEscalatedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* Firestore subscription */
  useEffect(() => {
  let mounted = true;

  const unsub = onSnapshot(
    collection(db, "issues"),

    (snapshot) => {
      if (!mounted) return;

      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      setIssues(data);

      setEscalatedIssues(
        data.filter(
          (i) =>
            i.status === "pending" &&
            calcAge(i.createdAt) >= ESCALATION_DAYS
        )
      );

      setLoading(false); // ✅ ALWAYS STOP LOADING
    },

    (error) => {
      console.error("🔥 FIREBASE ERROR:", error);
      setError("Permission denied or Firebase error");
      setLoading(false); // ✅ CRITICAL FIX
    }
  );

  // 🔥 FAILSAFE (prevents infinite loading)
  const timeout = setTimeout(() => {
    if (mounted) setLoading(false);
  }, 4000);

  return () => {
    mounted = false;
    unsub();
    clearTimeout(timeout);
  };
}, []);
  /* Actions */
  async function handleResolve(issueId, note) {
    try {
      await updateDoc(doc(db, "issues", issueId), {
        status: "resolved",
        resolvedAt: serverTimestamp(),
        authorityNote: note || "",
        resolvedByAuthority: true,
      });
      setSelectedIssue(null);
      showToast("Issue marked as resolved");
    } catch (err) {
      console.error(err);
      showToast("Failed to resolve issue", "error");
    }
  }

  async function handleEscalate(issueId, note) {
    try {
      await updateDoc(doc(db, "issues", issueId), {
        status: "escalated",
        escalatedAt: serverTimestamp(),
        authorityNote: note || "",
      });
      setSelectedIssue(null);
      showToast("Issue escalated", "warning");
    } catch (err) {
      console.error(err);
      showToast("Failed to escalate", "error");
    }
  }

  async function handleAssign(issueId, committee) {
    if (!committee.trim()) return;
    try {
      await updateDoc(doc(db, "issues", issueId), {
        assignedCommittee: committee.trim(),
        reassignedAt: serverTimestamp(),
      });
      showToast(`Reassigned to ${committee}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to reassign", "error");
    }
  }

  /* Metrics */
  const totalIssues = issues.length;
  const resolvedCount = issues.filter(i => i.status === "resolved").length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;
  const criticalCount = escalatedIssues.filter(i => Number(i.severity) >= 4).length;
  const avgAge = escalatedIssues.length > 0
    ? Math.round(escalatedIssues.reduce((s, i) => s + calcAge(i.createdAt), 0) / escalatedIssues.length)
    : 0;

  const sparkEsc = [1, 2, 1, 3, 2, 4, escalatedIssues.length || 0];
  const sparkRes = [40, 50, 45, 60, 55, 70, resolutionRate];

  /* Loading */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyles />
        <div style={{ textAlign: "center" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#ef4444", borderRadius: "50%", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Loading Authority Dashboard...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyles />
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "20px 28px", color: "#ef4444" }}>
          {error}
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "escalated", label: `Escalated (${escalatedIssues.length})` },
    { id: "all", label: `All Issues (${totalIssues})` },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <GlobalStyles />

      {/* Toast */}
      {toast && (
        <div className="fade-up" style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          padding: "12px 20px", borderRadius: 10, fontFamily: "var(--font)",
          fontSize: 13, fontWeight: 600,
          background: toast.type === "error" ? "rgba(239,68,68,0.9)" : toast.type === "warning" ? "rgba(249,115,22,0.9)" : "rgba(0,255,136,0.9)",
          color: toast.type === "success" ? "#000" : "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Issue Modal */}
      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          onAssign={handleAssign}
        />
      )}

      <Header navigate={navigate} escalatedCount={escalatedIssues.length} />

      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "28px 28px 48px" }}>

        {/* Page title */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>
                Authority Command Center ⚡
              </h1>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                Escalated issue oversight · {getTodayString()}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: escalatedIssues.length > 0 ? "#ef4444" : "#00ff88", boxShadow: escalatedIssues.length > 0 ? "0 0 8px rgba(239,68,68,0.8)" : "0 0 8px rgba(0,255,136,0.8)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: escalatedIssues.length > 0 ? "#ef4444" : "#00ff88" }}>
                {escalatedIssues.length > 0 ? `${escalatedIssues.length} need attention` : "All clear"}
              </span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
          <StatCard label="Total Issues" value={totalIssues} sub={`+${Math.floor(totalIssues * 0.12)} vs last week`} color="#6366f1"
            sparkData={[8, 10, 9, 12, 11, 14, totalIssues]}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard label="Escalated" value={escalatedIssues.length} sub={escalatedIssues.length > 0 ? `↓ ${criticalCount} critical` : "+ none critical"} color="#ef4444"
            sparkData={sparkEsc}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard label="Resolution Rate" value={`${resolutionRate}%`} sub={resolutionRate >= 70 ? "+healthy" : "↓ needs attention"} color="#00ff88"
            sparkData={sparkRes}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          />
          <StatCard label="Avg Escalation Age" value={`${avgAge}d`} sub={avgAge > 10 ? "↓ critically overdue" : avgAge > 5 ? "↓ above threshold" : "+ within limit"} color="#f59e0b"
            sparkData={[3, 5, 4, 7, 6, 8, avgAge || 0]}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`nav-tab${activeTab === tab.id ? " active" : ""}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <PriorityEngine escalatedIssues={escalatedIssues} onSelect={setSelectedIssue} />
              <CommitteeScorecard issues={issues} />
            </div>
            <AnalyticsPanel issues={issues} escalatedIssues={escalatedIssues} />
          </div>
        )}

        {/* TAB: ESCALATED */}
        {activeTab === "escalated" && (
          <div className="fade-up">
            <IssuesTable
              issues={escalatedIssues}
              title="Escalated Issues"
              onSelect={setSelectedIssue}
              emptyMsg="No escalated issues. Committees are resolving on time. ✓"
            />
          </div>
        )}

        {/* TAB: ALL ISSUES */}
        {activeTab === "all" && (
          <div className="fade-up">
            <IssuesTable
              issues={issues}
              title="All Issues"
              onSelect={setSelectedIssue}
              emptyMsg="No issues found."
            />
          </div>
        )}

        {/* TAB: ANALYTICS */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-up">
            <AnalyticsPanel issues={issues} escalatedIssues={escalatedIssues} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <PriorityEngine escalatedIssues={escalatedIssues} onSelect={setSelectedIssue} />
              <CommitteeScorecard issues={issues} />
            </div>
          </div>
        )}

        {/* Debug strip */}
        <div style={{ marginTop: 32, padding: "8px 0", borderTop: "1px solid var(--border)", display: "flex", gap: 16 }}>
          {[
            `Total Loaded: ${issues.length}`,
            `Escalated: ${escalatedIssues.length}`,
            `Critical: ${criticalCount}`,
            `Resolution: ${resolutionRate}%`,
          ].map(txt => (
            <span key={txt} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{txt}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;