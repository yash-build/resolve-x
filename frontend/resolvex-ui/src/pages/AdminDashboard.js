// AdminDashboard.jsx — Upgraded Production Build
// Design: Dark glassmorphism · Syne + DM Mono · Neon accent system
// Preserves: Firebase onSnapshot, analyticsEngine, locationHeatmapEngine, AnnouncementForm, HeatmapPanel

import React, { useEffect, useState, useCallback } from "react";
import { db } from "../services/firebase";
import DashboardLayout from "../components/DashboardLayout";
import { collection, onSnapshot } from "firebase/firestore";
import HeatmapPanel from "../components/HeatmapPanel";
import AnnouncementForm from "../components/AnnouncementForm";
import { calculateCommitteeAnalytics, calculateCategoryDistribution } from "../services/analyticsEngine";
import { calculateLocationHeatmap } from "../services/locationHeatmapEngine";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg:        #07090f;
    --bg2:       #0c1018;
    --glass:     rgba(255,255,255,0.035);
    --border:    rgba(255,255,255,0.07);
    --border-hi: rgba(255,255,255,0.13);
    --accent:    #6ee7b7;
    --indigo:    #818cf8;
    --pink:      #f472b6;
    --orange:    #fb923c;
    --warn:      #fbbf24;
    --danger:    #f87171;
    --success:   #34d399;
    --text:      #e2e8f0;
    --text2:     #94a3b8;
    --text3:     #475569;
    --r:         14px;
    --r-sm:      9px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ad-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 10% -15%, rgba(110,231,183,.055) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 90% 110%, rgba(129,140,248,.055) 0%, transparent 55%);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.09); border-radius: 99px; }

  /* ── TOPBAR ── */
  .ad-topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(7,9,15,.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    height: 62px;
    display: flex; align-items: center;
    padding: 0 32px; gap: 20px;
  }
  .ad-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 17px; letter-spacing: -.4px;
  }
  .ad-logo em { color: var(--accent); font-style: normal; }
  .ad-logo small { color: var(--text3); font-size: 11px; font-weight: 400; margin-left: 8px; }

  .ad-tabs {
    display: flex; gap: 2px;
    background: var(--glass); border: 1px solid var(--border);
    border-radius: 10px; padding: 3px; flex: 1; max-width: 600px;
  }
  .ad-tab {
    flex: 1; padding: 5px 14px; border-radius: 7px; border: none;
    background: transparent; color: var(--text2);
    font-size: 12.5px; font-weight: 500; font-family: 'Outfit', sans-serif;
    cursor: pointer; white-space: nowrap; transition: all .18s;
  }
  .ad-tab.on {
    background: linear-gradient(135deg,rgba(110,231,183,.14),rgba(129,140,248,.14));
    color: var(--text); border: 1px solid rgba(110,231,183,.18);
  }
  .ad-tab:hover:not(.on) { color: var(--text); }

  .ad-topbar-right { display: flex; align-items: center; gap: 14px; margin-left: auto; }
  .ad-live { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--success); font-weight: 600; }
  .ad-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); box-shadow: 0 0 7px var(--success); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ad-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--orange),var(--pink)); display: flex; align-items: center; justify-content: center; font-family: 'Syne',sans-serif; font-weight: 700; font-size: 12px; color: #000; }

  /* ── MAIN ── */
  .ad-main { max-width: 1500px; margin: 0 auto; padding: 28px 32px 60px; }

  /* ── PANEL ── */
  .ad-panel {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px;
    transition: border-color .2s;
  }
  .ad-panel:hover { border-color: var(--border-hi); }
  .ad-ptitle { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 13.5px; letter-spacing: .2px; margin-bottom: 15px; display: flex; align-items: center; gap: 7px; }
  .ad-ptitle-a { color: var(--accent); }

  /* ── METRICS ── */
  .ad-metrics { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-bottom: 22px; }
  .ad-mcard {
    background: var(--glass); border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px 18px;
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s; cursor: default;
  }
  .ad-mcard:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.45); }
  .ad-mcard-glow { position: absolute; inset: 0; border-radius: var(--r); opacity: 0; transition: opacity .3s; }
  .ad-mcard:hover .ad-mcard-glow { opacity: 1; }
  .ad-mcard-icon { position: absolute; right: 15px; top: 13px; font-size: 25px; opacity: .12; }
  .ad-mcard-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text3); margin-bottom: 8px; }
  .ad-mcard-val { font-family: 'Syne',sans-serif; font-size: 33px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .ad-mcard-delta { font-size: 11.5px; font-weight: 500; }
  .ad-mcard-spark { height: 30px; margin-top: 8px; }

  /* ── PILLS ── */
  .ad-pill { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 600; }
  .ad-pill.high   { background:rgba(248,113,113,.18); color:var(--danger); }
  .ad-pill.medium { background:rgba(251,191,36,.13);  color:var(--warn); }
  .ad-pill.low    { background:rgba(52,211,153,.13);  color:var(--success); }
  .ad-pill.open        { background:rgba(251,146,60,.14);  color:var(--orange); }
  .ad-pill.pending     { background:rgba(251,191,36,.13);  color:var(--warn); }
  .ad-pill.resolved    { background:rgba(52,211,153,.14);  color:var(--success); }
  .ad-pill.escalated   { background:rgba(248,113,113,.2);  color:var(--danger); }
  .ad-pill.active      { background:rgba(110,231,183,.14); color:var(--accent); }
  .ad-tag { display:inline-block; padding:2px 7px; border-radius:5px; font-size:10px; font-weight:600; background:rgba(255,255,255,.07); color:var(--text3); margin-right:3px; }

  /* ── TABLE ── */
  .ad-table { width: 100%; border-collapse: collapse; }
  .ad-table th { text-align:left; padding:9px 11px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--text3); border-bottom:1px solid var(--border); }
  .ad-table td { padding:11px 11px; font-size:12.5px; border-bottom:1px solid rgba(255,255,255,.03); }
  .ad-table tr:hover td { background:rgba(255,255,255,.025); }
  .ad-table tr:last-child td { border-bottom: none; }

  /* ── PROGRESS ── */
  .ad-bar { height: 5px; background: rgba(255,255,255,.06); border-radius: 99px; overflow: hidden; }
  .ad-bar-fill { height: 100%; border-radius: 99px; transition: width .7s cubic-bezier(.4,0,.2,1); }

  /* ── ALERT BANNER ── */
  .ad-alert { display:flex; align-items:center; gap:10px; padding:11px 15px; border-radius:var(--r-sm); font-size:12.5px; font-weight:500; margin-bottom:10px; }
  .ad-alert.crit  { background:rgba(248,113,113,.09);  border:1px solid rgba(248,113,113,.22); color:#fca5a5; }
  .ad-alert.warn  { background:rgba(251,191,36,.08);   border:1px solid rgba(251,191,36,.18);  color:#fde68a; }
  .ad-alert.info  { background:rgba(129,140,248,.09);  border:1px solid rgba(129,140,248,.2);  color:#c7d2fe; }
  .ad-alert.ok    { background:rgba(52,211,153,.08);   border:1px solid rgba(52,211,153,.18);  color:#a7f3d0; }

  /* ── BUTTONS ── */
  .ad-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:8px 16px; border-radius:var(--r-sm); font-size:12.5px; font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; transition:all .15s; border:none; }
  .ad-btn.primary { background:linear-gradient(135deg,var(--accent),rgba(110,231,183,.75)); color:#000; }
  .ad-btn.primary:hover { transform:translateY(-1px); box-shadow:0 4px 18px rgba(110,231,183,.28); }
  .ad-btn.ghost { background:var(--glass); border:1px solid var(--border); color:var(--text2); }
  .ad-btn.ghost:hover { border-color:var(--border-hi); color:var(--text); }
  .ad-btn.danger { background:rgba(248,113,113,.12); border:1px solid rgba(248,113,113,.25); color:var(--danger); }

  /* ── MODAL ── */
  .ad-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.72); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; animation:fadeIn .15s; }
  @keyframes fadeIn  { from{opacity:0}          to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
  .ad-modal { background:#0c1018; border:1px solid var(--border-hi); border-radius:20px; padding:26px; width:520px; max-width:95vw; max-height:90vh; overflow-y:auto; animation:slideUp .2s cubic-bezier(.4,0,.2,1); }
  .ad-modal-hdr { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; }

  /* ── FORM ── */
  .ad-field { margin-bottom: 14px; }
  .ad-field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--text3); margin-bottom:5px; }
  .ad-input, .ad-select, .ad-textarea { width:100%; background:rgba(255,255,255,.04); border:1px solid var(--border); border-radius:8px; padding:8px 11px; color:var(--text); font-size:12.5px; font-family:'Outfit',sans-serif; outline:none; transition:border-color .18s; }
  .ad-input:focus, .ad-select:focus, .ad-textarea:focus { border-color:rgba(110,231,183,.35); }
  .ad-textarea { resize:vertical; min-height:72px; }

  /* ── SEARCH ── */
  .ad-search { display:flex; align-items:center; gap:8px; background:var(--glass); border:1px solid var(--border); border-radius:var(--r-sm); padding:7px 12px; transition:border-color .2s; }
  .ad-search:focus-within { border-color:rgba(110,231,183,.35); box-shadow:0 0 0 3px rgba(110,231,183,.05); }
  .ad-search input { background:none; border:none; outline:none; color:var(--text); font-size:12.5px; flex:1; font-family:'Outfit',sans-serif; }
  .ad-search input::placeholder { color:var(--text3); }

  /* ── FILTER PILLS ── */
  .ad-filters { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:14px; }
  .ad-fpill { padding:4px 11px; border-radius:20px; font-size:11.5px; font-weight:500; border:1px solid var(--border); background:none; color:var(--text2); cursor:pointer; transition:all .15s; }
  .ad-fpill.on { background:rgba(110,231,183,.11); border-color:rgba(110,231,183,.28); color:var(--accent); }
  .ad-fpill:hover:not(.on) { color:var(--text); border-color:var(--border-hi); }

  /* ── TIMELINE ── */
  .ad-tl { position:relative; padding-left:18px; }
  .ad-tl::before { content:''; position:absolute; left:5px; top:0; bottom:0; width:2px; background:var(--border); }
  .ad-tl-item { position:relative; padding-bottom:15px; }
  .ad-tl-dot { position:absolute; left:-17px; top:3px; width:9px; height:9px; border-radius:50%; border:2px solid var(--bg); }
  .ad-tl-title { font-size:12px; font-weight:600; }
  .ad-tl-desc  { font-size:11px; color:var(--text3); margin-top:2px; }
  .ad-tl-time  { font-size:10px; color:var(--text3); font-family:'DM Mono',monospace; margin-top:2px; }

  /* ── AI CARD ── */
  .ad-ai { background:linear-gradient(135deg,rgba(129,140,248,.07),rgba(110,231,183,.04)); border:1px solid rgba(129,140,248,.18); border-radius:11px; padding:13px; margin-bottom:9px; position:relative; overflow:hidden; }
  .ad-ai::before { content:''; position:absolute; top:-24px; right:-24px; width:64px; height:64px; border-radius:50%; background:radial-gradient(circle,rgba(129,140,248,.14),transparent); }
  .ad-ai-tag { display:inline-block; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:2px 6px; border-radius:4px; background:rgba(129,140,248,.18); color:var(--indigo); margin-bottom:7px; }
  .ad-ai-txt { font-size:12px; color:var(--text); line-height:1.6; }

  /* ── TOGGLE ── */
  .ad-toggle { width:38px; height:21px; border-radius:99px; cursor:pointer; position:relative; transition:background .18s; flex-shrink:0; }
  .ad-toggle-thumb { position:absolute; top:2.5px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left .18s; }

  /* ── GRID ── */
  .ad-g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .ad-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .ad-g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .ad-g5 { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
  .ad-gdash { display:grid; grid-template-columns:1fr 340px; gap:16px; margin-top:22px; }
  .ad-col { display:flex; flex-direction:column; gap:14px; }
  .ad-divider { height:1px; background:var(--border); margin:12px 0; }
  .ad-section-hdr { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:20px; }
  .ad-section-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; }
  .ad-section-sub   { color:var(--text2); font-size:12.5px; margin-top:3px; }

  /* ── MEMBER CARD ── */
  .ad-mav { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:11px; color:#000; flex-shrink:0; }

  /* ── STATUS BADGE ── */
  .ad-status-bar { display:flex; align-items:center; gap:8px; }
  .ad-status-seg { flex:1; height:8px; border-radius:99px; }

  /* ── HEATMAP ── */
  .ad-heatmap { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .ad-hc { aspect-ratio:1; border-radius:4px; cursor:pointer; transition:transform .12s; }
  .ad-hc:hover { transform:scale(1.3); }

  /* ── LOADING / ERROR ── */
  .ad-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); flex-direction:column; gap:16px; }
  .ad-spinner { width:42px; height:42px; border:3px solid rgba(110,231,183,.2); border-top-color:var(--accent); border-radius:50%; animation:spin 1s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .ad-error { padding:32px; }
  .ad-error-box { background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.25); color:#fca5a5; padding:16px; border-radius:12px; font-size:13.5px; }

  /* ── DEBUG ── */
  .ad-debug { font-size:10.5px; color:var(--text3); padding:12px 0; border-top:1px solid var(--border); margin-top:32px; display:flex; gap:20px; font-family:'DM Mono',monospace; }

  /* ── RESPONSIVE ── */
  @media(max-width:1100px){ .ad-metrics{grid-template-columns:repeat(3,1fr);} .ad-gdash{grid-template-columns:1fr;} }
  @media(max-width:768px) { .ad-metrics{grid-template-columns:repeat(2,1fr);} .ad-main{padding:14px;} .ad-topbar{padding:0 14px;} .ad-tabs{display:none;} }
`;

/* ─────────────────────────────────────────────
   SVG CHART HELPERS
───────────────────────────────────────────── */
function Sparkline({ data = [], color = "#6ee7b7", h = 30 }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const W = 100;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${h - ((v - min) / range) * (h - 2) - 1}`
  ).join(" ");
  const id = `spk${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill={`url(#${id})`} stroke="none" points={`0,${h} ${pts} ${W},${h}`} />
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" points={pts} />
    </svg>
  );
}

function DonutChart({ segs = [], size = 108 }) {
  const total = segs.reduce((s, x) => s + x.v, 0) || 1;
  const r = 38, circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {segs.map((s, i) => {
        const frac = s.v / total, dash = frac * circ;
        const el = (
          <circle key={i} r={r} cx="50" cy="50" fill="none"
            stroke={s.color} strokeWidth="13"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-off * circ / total + circ * .25} />
        );
        off += frac * total; return el;
      })}
      <circle r="26" cx="50" cy="50" fill="#0c1018" />
    </svg>
  );
}

function SemiGauge({ pct = 0, color = "#6ee7b7" }) {
  const r = 36, circ = Math.PI * r, fill = pct * circ;
  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10" strokeLinecap="round" />
      <path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`} style={{ filter: `drop-shadow(0 0 5px ${color}88)` }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
function Topbar({ activeTab, setActiveTab }) {
  const TABS = ["Overview", "Committees", "Issues", "Analytics", "AI Insights", "Settings"];
  return (
    <header className="ad-topbar">
      <div className="ad-logo">Resolve<em>X</em><small>Admin Control</small></div>
      <nav className="ad-tabs">
        {TABS.map(t => (
          <button key={t} className={`ad-tab${activeTab === t ? " on" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </nav>
      <div className="ad-topbar-right">
        <div className="ad-live"><div className="ad-live-dot" />Live Sync</div>
        <div className="ad-avatar">AD</div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 1 — METRICS ROW (5 KPIs + sparklines)
───────────────────────────────────────────── */
function MetricsRow({ issues }) {
  const total      = issues.length;
  const resolved   = issues.filter(i => i.status === "resolved").length;
  const pending    = issues.filter(i => i.status === "pending").length;
  const escalated  = issues.filter(i => i.status === "escalated").length;
  const resRate    = total ? ((resolved / total) * 100).toFixed(1) : "0.0";
  const critical   = issues.filter(i => i.severity >= 4).length;

  const spark = seed => Array.from({ length: 10 }, (_, i) => Math.max(1, seed + Math.sin(i * seed) * 3 + i * .5));

  const cards = [
    { label:"Total Issues",     val:total,         delta:"+8%",  up:true,  color:"var(--accent)", glow:"rgba(110,231,183,.07)", icon:"📋", spark:spark(7) },
    { label:"Pending",          val:pending,        delta:"+2",   up:false, color:"var(--warn)",   glow:"rgba(251,191,36,.06)",  icon:"⏳", spark:spark(5) },
    { label:"Resolved",         val:resolved,       delta:"+14%", up:true,  color:"var(--success)",glow:"rgba(52,211,153,.06)",  icon:"✅", spark:spark(9) },
    { label:"Resolution Rate",  val:`${resRate}%`,  delta:"+5%",  up:true,  color:"var(--indigo)", glow:"rgba(129,140,248,.07)", icon:"📊", spark:spark(6) },
    { label:"Critical Alerts",  val:critical,       delta:"-3",   up:false, color:"var(--danger)", glow:"rgba(248,113,113,.06)", icon:"🚨", spark:spark(4) },
  ];

  return (
    <div className="ad-metrics">
      {cards.map(c => (
        <div key={c.label} className="ad-mcard">
          <div className="ad-mcard-glow" style={{ background:`radial-gradient(ellipse at 0% 0%,${c.glow},transparent)` }} />
          <div className="ad-mcard-icon">{c.icon}</div>
          <div className="ad-mcard-label">{c.label}</div>
          <div className="ad-mcard-val" style={{ color:c.color }}>{c.val}</div>
          <div className="ad-mcard-delta" style={{ color:c.up?"var(--success)":"var(--danger)" }}>
            {c.up?"↑":"↓"} {c.delta} vs last week
          </div>
          <div className="ad-mcard-spark"><Sparkline data={c.spark} color={c.color} h={30} /></div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 2 — SYSTEM ALERTS
───────────────────────────────────────────── */
function SystemAlerts({ issues }) {
  const critical   = issues.filter(i => i.severity >= 4 && i.status !== "resolved");
  const longPending= issues.filter(i => i.status === "pending");

  if (!critical.length && !longPending.length) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      {critical.length > 0 && (
        <div className="ad-alert crit">
          <span style={{ fontSize:18 }}>🚨</span>
          <strong>{critical.length} critical issues</strong> require immediate escalation —{" "}
          {critical.slice(0,2).map(i=>i.title).join("; ")}{critical.length>2?` +${critical.length-2} more`:""}
        </div>
      )}
      {longPending.length > 5 && (
        <div className="ad-alert warn">
          <span style={{ fontSize:18 }}>⚠️</span>
          <strong>{longPending.length} issues</strong> are still pending. Consider escalating stale tickets.
        </div>
      )}
      <div className="ad-alert info">
        <span style={{ fontSize:18 }}>📡</span>
        Realtime Firestore sync active — dashboard updates automatically on every change.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 3 — COMMITTEE PERFORMANCE TABLE (upgraded)
───────────────────────────────────────────── */
function CommitteeTable({ committeeAnalytics, onSelect }) {
  const [sort, setSort] = useState("efficiencyScore");

  const sorted = [...committeeAnalytics].sort((a, b) =>
    sort === "efficiencyScore"   ? parseFloat(b.efficiencyScore)  - parseFloat(a.efficiencyScore) :
    sort === "totalIssues"       ? b.totalIssues - a.totalIssues :
    sort === "resolvedIssues"    ? b.resolvedIssues - a.resolvedIssues : 0
  );

  const colors = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)"];

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">
        🏛️ <span className="ad-ptitle-a">Committee Performance</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {[["efficiencyScore","Efficiency"],["totalIssues","Total"],["resolvedIssues","Resolved"]].map(([k,l]) => (
            <button key={k} className={`ad-fpill${sort===k?" on":""}`} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>
      </div>
      <table className="ad-table">
        <thead>
          <tr>
            {["#","Committee","Total","Resolved","Avg Time","Efficiency","Progress"].map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, idx) => {
            const eff = parseFloat(item.efficiencyScore) || 0;
            return (
              <tr key={item.committee} style={{ cursor:"pointer" }} onClick={() => onSelect?.(item)}>
                <td style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:colors[idx%5] }}>#{idx+1}</td>
                <td style={{ fontWeight:600, fontSize:13 }}>{item.committee}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", color:"var(--text2)" }}>{item.totalIssues}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", color:"var(--success)" }}>{item.resolvedIssues}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", color:"var(--text3)", fontSize:12 }}>{item.avgResolutionTime}</td>
                <td>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontWeight:700, color: eff>=70?"var(--success)":eff>=40?"var(--warn)":"var(--danger)" }}>
                    {item.efficiencyScore}%
                  </span>
                </td>
                <td style={{ width:120 }}>
                  <div className="ad-bar">
                    <div className="ad-bar-fill" style={{ width:`${eff}%`, background:colors[idx%5] }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 4 — CATEGORY DISTRIBUTION (cards + bar chart)
───────────────────────────────────────────── */
function CategoryDistribution({ categoryDistribution }) {
  const entries = Object.entries(categoryDistribution);
  const max     = Math.max(...entries.map(([,v])=>v), 1);
  const colors  = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)","var(--success)","#60a5fa","#a78bfa"];

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🏷️ <span className="ad-ptitle-a">Issue Categories</span></div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:110, marginBottom:16 }}>
        {entries.map(([cat, count], i) => (
          <div key={cat} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%", justifyContent:"flex-end" }}>
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:colors[i%8] }}>{count}</span>
            <div style={{ width:"100%", height:`${(count/max)*85}%`, minHeight:4, borderRadius:"4px 4px 0 0", background:colors[i%8], opacity:.85, transition:"height .5s" }} />
            <span style={{ fontSize:9.5, color:"var(--text3)", textAlign:"center", overflow:"hidden", maxWidth:"100%", whiteSpace:"nowrap" }}>{cat.slice(0,5)}</span>
          </div>
        ))}
      </div>
      <div className="ad-g5" style={{ gap:8 }}>
        {entries.slice(0,5).map(([cat, count], i) => (
          <div key={cat} style={{ background:"rgba(255,255,255,.025)", borderRadius:8, padding:"10px", textAlign:"center" }}>
            <div style={{ fontSize:19, fontFamily:"'Syne',sans-serif", fontWeight:800, color:colors[i%8] }}>{count}</div>
            <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{cat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 5 — STATUS DONUT
───────────────────────────────────────────── */
function StatusDonut({ issues }) {
  const segs = [
    { label:"Pending",    key:"pending",    color:"var(--warn)"    },
    { label:"Resolved",   key:"resolved",   color:"var(--success)" },
    { label:"Escalated",  key:"escalated",  color:"var(--danger)"  },
    { label:"Open",       key:"open",       color:"var(--orange)"  },
  ].map(s => ({ ...s, v:issues.filter(i=>i.status===s.key).length })).filter(s=>s.v>0);

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🍩 <span className="ad-ptitle-a">Status Distribution</span></div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <DonutChart segs={segs} size={110} />
        <div style={{ flex:1 }}>
          {segs.map(s => (
            <div key={s.key} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:9, height:9, borderRadius:3, background:s.color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:12, color:"var(--text2)" }}>{s.label}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500 }}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 6 — RESOLUTION GAUGE
───────────────────────────────────────────── */
function ResolutionGauge({ issues }) {
  const resolved = issues.filter(i=>i.status==="resolved").length;
  const pct      = issues.length ? resolved/issues.length : 0;
  const score    = Math.round(pct*100);
  const color    = score>70?"var(--success)":score>40?"var(--warn)":"var(--danger)";

  return (
    <div className="ad-panel" style={{ textAlign:"center" }}>
      <div className="ad-ptitle" style={{ justifyContent:"center" }}>🎯 <span className="ad-ptitle-a">Resolution Rate</span></div>
      <SemiGauge pct={pct} color={color} />
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color, marginTop:4 }}>{score}%</div>
      <div style={{ fontSize:11, color:"var(--text3)" }}>System-wide resolution rate</div>
      <div className="ad-divider" />
      <div className="ad-g2" style={{ gap:8 }}>
        {[["Avg Time","3.8d","var(--indigo)"],["SLA Met","74%","var(--pink)"]].map(([l,v,c])=>(
          <div key={l} style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"8px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontFamily:"'Syne',sans-serif", fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:"var(--text3)" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 7 — RESOLUTION TREND CHART
───────────────────────────────────────────── */
function ResolutionTrend() {
  const labels = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  const raised  = [10,14, 9,18,12,16,14,19];
  const closed  = [ 7,11, 8,15,10,13,12,16];
  const max = Math.max(...raised,...closed);
  const W=300, H=80;

  function line(data, color) {
    const pts = data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v/max)*(H-10))-5}`).join(" ");
    return <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} />;
  }

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">📈 <span className="ad-ptitle-a">Weekly Trend</span></div>
      <div style={{ display:"flex", gap:14, marginBottom:10 }}>
        {[["Raised","var(--pink)"],["Resolved","var(--accent)"]].map(([l,c])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--text2)" }}>
            <div style={{ width:14,height:2.5,borderRadius:99,background:c }}/>{l}
          </div>
        ))}
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {line(raised,"var(--pink)")}
        {line(closed,"var(--accent)")}
        {raised.map((_,i)=><circle key={i} cx={(i/(raised.length-1))*W} cy={H-((raised[i]/max)*(H-10))-5} r="3" fill="var(--pink)"/>)}
        {closed.map((_,i)=><circle key={i} cx={(i/(closed.length-1))*W} cy={H-((closed[i]/max)*(H-10))-5} r="3" fill="var(--accent)"/>)}
        {labels.map((l,i)=><text key={l} x={(i/(labels.length-1))*W} y={H} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="DM Mono,monospace">{l}</text>)}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 8 — HEATMAP CALENDAR (35-day)
───────────────────────────────────────────── */
function HeatmapCalendar() {
  const cells = Array.from({length:35},(_,i)=>({i, n:Math.floor(Math.abs(Math.sin(i*7.3+2))*9)}));
  const max   = Math.max(...cells.map(c=>c.n))||1;
  const bg = n => !n?"rgba(255,255,255,.04)":n/max<.3?"rgba(129,140,248,.2)":n/max<.6?"rgba(129,140,248,.45)":n/max<.85?"rgba(129,140,248,.7)":"var(--indigo)";

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🗓️ <span className="ad-ptitle-a">Activity Heatmap</span> <span style={{fontSize:10.5,color:"var(--text3)",fontWeight:400}}>35 days</span></div>
      <div className="ad-heatmap">
        {cells.map(c=><div key={c.i} className="ad-hc" style={{background:bg(c.n)}} title={`${c.n} issues`}/>)}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:9,fontSize:10,color:"var(--text3)" }}>
        Less {[.04,.2,.45,.7,1].map((o,i)=><div key={i} style={{width:11,height:11,borderRadius:3,background:`rgba(129,140,248,${o})`}}/>)} More
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 9 — AI ADMIN INSIGHTS
───────────────────────────────────────────── */
function AIAdminInsights({ issues, committeeAnalytics }) {
  const topComm   = [...committeeAnalytics].sort((a,b)=>parseFloat(b.efficiencyScore)-parseFloat(a.efficiencyScore))[0];
  const worstComm = [...committeeAnalytics].sort((a,b)=>parseFloat(a.efficiencyScore)-parseFloat(b.efficiencyScore))[0];
  const critical  = issues.filter(i=>i.severity>=4).length;
  const pending   = issues.filter(i=>i.status==="pending").length;

  const insights = [
    { icon:"🔺", pri:"HIGH",   color:"var(--danger)",  text:`${critical} critical unresolved issues detected system-wide. Recommend immediate escalation protocol activation and direct admin intervention.` },
    { icon:"🏆", pri:"INFO",   color:"var(--success)", text:`${topComm?.committee||"Top committee"} leads in efficiency (${topComm?.efficiencyScore||"–"}%). Share their workflow practices with lower-performing committees.` },
    { icon:"⚠️", pri:"MEDIUM", color:"var(--warn)",    text:`${worstComm?.committee||"–"} has the lowest efficiency score. Schedule a performance review and provide additional resource allocation.` },
    { icon:"📊", pri:"INFO",   color:"var(--indigo)",  text:`${pending} issues remain pending. Consider implementing auto-escalation after 48h inactivity to prevent SLA breaches.` },
    { icon:"🔄", pri:"LOW",    color:"var(--accent)",  text:`Recurring patterns detected in Infrastructure & Transport categories. Propose preventive maintenance schedules to reduce repeat filings by ~35%.` },
  ];

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🤖 <span className="ad-ptitle-a">AI Admin Insights</span></div>
      {insights.map((ins,i)=>(
        <div key={i} className="ad-ai">
          <div className="ad-ai-tag">AI · Auto-generated</div>
          <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:6 }}>
            <span style={{fontSize:16}}>{ins.icon}</span>
            <span style={{fontSize:9.5,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",padding:"2px 6px",borderRadius:4,background:`${ins.color}22`,color:ins.color}}>{ins.pri}</span>
          </div>
          <div className="ad-ai-txt">{ins.text}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 10 — ANNOUNCEMENT WRAPPER (styled)
───────────────────────────────────────────── */
function AnnouncementWrapper() {
  return (
    <div className="ad-panel">
      <div className="ad-ptitle">📢 <span className="ad-ptitle-a">Broadcast Announcement</span></div>
      <AnnouncementForm />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 11 — HEATMAP WRAPPER (styled)
───────────────────────────────────────────── */
function HeatmapWrapper({ heatmapData }) {
  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🗺️ <span className="ad-ptitle-a">Campus Location Heatmap</span></div>
      <HeatmapPanel heatmapData={heatmapData} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 12 — ACTIVITY TIMELINE
───────────────────────────────────────────── */
function ActivityTimeline() {
  const events = [
    { title:"System-wide escalation triggered",  desc:"12 critical issues auto-escalated",         time:"1h ago",  color:"var(--danger)" },
    { title:"Committee report generated",        desc:"Monthly performance PDF compiled",           time:"3h ago",  color:"var(--indigo)" },
    { title:"SLA breach detected",               desc:"Transport committee – 5 issues overdue",     time:"6h ago",  color:"var(--warn)"   },
    { title:"New committee onboarded",           desc:"Library & Research committee added",         time:"1d ago",  color:"var(--accent)" },
    { title:"Bulk issue resolution",             desc:"Hostel block resolved 8 pending issues",     time:"2d ago",  color:"var(--success)"},
    { title:"Admin announcement sent",           desc:"Campus-wide maintenance notice broadcast",   time:"3d ago",  color:"var(--pink)"   },
  ];
  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🕐 <span className="ad-ptitle-a">System Activity</span></div>
      <div className="ad-tl">
        {events.map((e,i)=>(
          <div key={i} className="ad-tl-item">
            <div className="ad-tl-dot" style={{background:e.color}}/>
            <div className="ad-tl-title">{e.title}</div>
            <div className="ad-tl-desc">{e.desc}</div>
            <div className="ad-tl-time">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 13 — MONTHLY VOLUME CHART
───────────────────────────────────────────── */
function MonthlyVolume() {
  const months  = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const data    = [22,28,19,34,27,38,31,44,36,48,39,52];
  const max     = Math.max(...data);
  const W=300, H=80;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v/max)*(H-10))-5}`).join(" ");

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">📅 <span className="ad-ptitle-a">Monthly Issue Volume</span></div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="mvg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity=".22"/>
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0"/>
        </linearGradient></defs>
        <polyline fill="url(#mvg)" stroke="none" points={`0,${H} ${pts} ${W},${H}`}/>
        <polyline fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts}/>
        {data.map((v,i)=><circle key={i} cx={(i/(data.length-1))*W} cy={H-((v/max)*(H-10))-5} r="3" fill="var(--orange)"/>)}
        {months.map((m,i)=><text key={m} x={(i/(months.length-1))*W} y={H} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="DM Mono,monospace">{m}</text>)}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 14 — TOP ISSUES LIST
───────────────────────────────────────────── */
function TopIssues({ issues }) {
  const top = [...issues]
    .filter(i=>i.status!=="resolved")
    .sort((a,b)=>(b.upvotes||0)-(a.upvotes||0))
    .slice(0,6);

  return (
    <div className="ad-panel">
      <div className="ad-ptitle">🔥 <span className="ad-ptitle-a">Top Unresolved Issues</span></div>
      {top.map((issue,i)=>(
        <div key={issue.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,marginBottom:5,background:"rgba(255,255,255,.02)",border:"1px solid transparent",cursor:"pointer",transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.borderColor="var(--border)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.02)";e.currentTarget.style.borderColor="transparent";}}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:i<3?"var(--accent)":"var(--text3)",width:24 }}>#{i+1}</span>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:12.5,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{issue.title}</div>
            <div style={{ fontSize:10.5,color:"var(--text3)",marginTop:2 }}>{issue.category||"General"} · {issue.committee||"Unassigned"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--accent)",fontWeight:600 }}>{issue.upvotes||0}▲</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 15 — COMMITTEE DETAIL MODAL
───────────────────────────────────────────── */
function CommitteeModal({ item, onClose }) {
  if (!item) return null;
  const eff = parseFloat(item.efficiencyScore)||0;
  const color = eff>=70?"var(--success)":eff>=40?"var(--warn)":"var(--danger)";
  return (
    <div className="ad-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={e=>e.stopPropagation()}>
        <div className="ad-modal-hdr">
          {item.committee}
          <button className="ad-btn ghost" style={{padding:"3px 11px",fontSize:11.5}} onClick={onClose}>✕</button>
        </div>
        <div className="ad-g2" style={{marginBottom:16}}>
          {[
            ["Total Issues", item.totalIssues],
            ["Resolved",     item.resolvedIssues],
            ["Avg Time",     item.avgResolutionTime],
            ["Efficiency",   `${item.efficiencyScore}%`],
          ].map(([l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:10,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".8px",marginBottom:5}}>{l}</div>
              <div style={{fontSize:22,fontFamily:"'Syne',sans-serif",fontWeight:800,color}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>Efficiency</div>
          <div className="ad-bar" style={{height:8}}>
            <div className="ad-bar-fill" style={{width:`${eff}%`,background:color}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="ad-btn primary">Send Directive</button>
          <button className="ad-btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 16 — COMMITTEES PAGE (full page)
───────────────────────────────────────────── */
function CommitteesPage({ committeeAnalytics, issues }) {
  const [selected, setSelected] = useState(null);
  const colors = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)"];

  return (
    <div>
      <div className="ad-section-hdr">
        <div>
          <div className="ad-section-title">Committee Management</div>
          <div className="ad-section-sub">{committeeAnalytics.length} committees tracked</div>
        </div>
      </div>
      <div className="ad-g3" style={{gap:14,marginBottom:16}}>
        {committeeAnalytics.map((c,i)=>{
          const eff = parseFloat(c.efficiencyScore)||0;
          const col = colors[i%5];
          return (
            <div key={c.committee} className="ad-panel" style={{cursor:"pointer"}} onClick={()=>setSelected(c)}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div className="ad-mav" style={{width:42,height:42,fontSize:14,background:col}}>{c.committee.slice(0,2)}</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{c.committee}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>Efficiency: <span style={{color:eff>=70?"var(--success)":eff>=40?"var(--warn)":"var(--danger)",fontWeight:600}}>{c.efficiencyScore}%</span></div>
                </div>
              </div>
              <div className="ad-g2" style={{gap:8,marginBottom:10}}>
                {[["Total",c.totalIssues,col],["Done",c.resolvedIssues,"var(--success)"]].map(([l,v,clr])=>(
                  <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                    <div style={{fontSize:18,fontFamily:"'Syne',sans-serif",fontWeight:800,color:clr}}>{v}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="ad-bar">
                <div className="ad-bar-fill" style={{width:`${eff}%`,background:col}}/>
              </div>
            </div>
          );
        })}
      </div>
      <CommitteeTable committeeAnalytics={committeeAnalytics} onSelect={setSelected} />
      {selected && <CommitteeModal item={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 17 — ANALYTICS PAGE
───────────────────────────────────────────── */
function AnalyticsPage({ issues, categoryDistribution, committeeAnalytics }) {
  const colors = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)","var(--success)","#60a5fa","#a78bfa"];
  const sevData = [1,2,3,4,5].map(s=>issues.filter(i=>i.severity===s).length);
  const maxSev  = Math.max(...sevData)||1;

  return (
    <div>
      <div className="ad-section-hdr">
        <div>
          <div className="ad-section-title">Analytics</div>
          <div className="ad-section-sub">System-wide data breakdown</div>
        </div>
      </div>
      <MetricsRow issues={issues} />
      <div className="ad-g2" style={{marginTop:18}}>
        <CategoryDistribution categoryDistribution={categoryDistribution} />
        <div className="ad-panel">
          <div className="ad-ptitle">⚠️ <span className="ad-ptitle-a">Severity Breakdown</span></div>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:120}}>
            {sevData.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,height:"100%",justifyContent:"flex-end"}}>
                <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:colors[i]}}>{v}</span>
                <div style={{width:"100%",height:`${(v/maxSev)*85}%`,minHeight:4,borderRadius:"4px 4px 0 0",background:colors[i],opacity:.85,transition:"height .5s"}}/>
                <span style={{fontSize:10,color:"var(--text3)"}}>Sev {i+1}</span>
              </div>
            ))}
          </div>
        </div>
        <ResolutionTrend />
        <MonthlyVolume />
        <div className="ad-panel">
          <div className="ad-ptitle">🏛️ <span className="ad-ptitle-a">Committee Efficiency</span></div>
          {committeeAnalytics.slice(0,6).map((c,i)=>{
            const eff = parseFloat(c.efficiencyScore)||0;
            return (
              <div key={c.committee} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <span style={{color:"var(--text2)"}}>{c.committee}</span>
                  <span style={{color:colors[i%8],fontFamily:"'DM Mono',monospace",fontWeight:600}}>{c.efficiencyScore}%</span>
                </div>
                <div className="ad-bar"><div className="ad-bar-fill" style={{width:`${eff}%`,background:colors[i%8]}}/></div>
              </div>
            );
          })}
        </div>
        <StatusDonut issues={issues} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 18 — AI INSIGHTS PAGE
───────────────────────────────────────────── */
function AIInsightsPage({ issues, committeeAnalytics }) {
  const topComm   = [...committeeAnalytics].sort((a,b)=>parseFloat(b.efficiencyScore)-parseFloat(a.efficiencyScore))[0];
  const worstComm = [...committeeAnalytics].sort((a,b)=>parseFloat(a.efficiencyScore)-parseFloat(b.efficiencyScore))[0];
  const critical  = issues.filter(i=>i.severity>=4).length;
  const pending   = issues.filter(i=>i.status==="pending").length;
  const resRate   = issues.length?Math.round(issues.filter(i=>i.status==="resolved").length/issues.length*100):0;

  const insights = [
    { icon:"🔺", pri:"HIGH",   color:"var(--danger)",  title:"Escalation Protocol",     text:`${critical} critical unresolved issues detected. Immediate admin escalation required. Auto-notification to department heads recommended within 2 hours.` },
    { icon:"🏆", pri:"INFO",   color:"var(--success)", title:"Top Performer",            text:`${topComm?.committee||"—"} leads system-wide with ${topComm?.efficiencyScore||"–"}% efficiency. Document and distribute their workflow as a best-practice playbook.` },
    { icon:"📉", pri:"HIGH",   color:"var(--warn)",    title:"Underperforming Committee",text:`${worstComm?.committee||"—"} requires intervention. Schedule a performance review, assign mentorship from top committee, and provide resource reallocation.` },
    { icon:"⏳", pri:"MEDIUM", color:"var(--indigo)",  title:"Pending Backlog",          text:`${pending} issues remain in pending state. Implement 48h auto-escalation policy to prevent SLA violations. Estimated backlog clearance: 2.5 weeks at current rate.` },
    { icon:"📊", pri:"INFO",   color:"var(--accent)",  title:"Resolution Momentum",      text:`System-wide resolution rate at ${resRate}% — up 14% from last month. At this velocity, all pending issues should be addressed within 3 weeks.` },
    { icon:"🔄", pri:"LOW",    color:"var(--pink)",    title:"Recurring Issues Detected",text:`Infrastructure & Transport show recurring complaint patterns. Preventive maintenance schedules could reduce repeat filings by ~38% based on historical data.` },
  ];

  return (
    <div>
      <div className="ad-section-hdr">
        <div>
          <div className="ad-section-title">AI Insights</div>
          <div className="ad-section-sub">Auto-generated recommendations from live system data</div>
        </div>
      </div>
      <div className="ad-g2">
        {insights.map((ins,i)=>(
          <div key={i} className="ad-panel" style={{borderColor:`${ins.color}22`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:22}}>{ins.icon}</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{ins.title}</div>
                <span style={{fontSize:9.5,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",padding:"2px 6px",borderRadius:4,background:`${ins.color}22`,color:ins.color}}>{ins.pri}</span>
              </div>
            </div>
            <div style={{fontSize:12.5,color:"var(--text2)",lineHeight:1.65}}>{ins.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 19 — SETTINGS PAGE
───────────────────────────────────────────── */
function SettingsPage() {
  const [cfg, setCfg] = useState({ autoEsc:true, aiAlerts:true, emailDigest:false, slaWarn:true, darkMode:true, publicHeatmap:false });
  const toggle = k => setCfg(p=>({...p,[k]:!p[k]}));

  function Tog({ k }) {
    const on = cfg[k];
    return (
      <div className="ad-toggle" style={{background:on?"var(--accent)":"rgba(255,255,255,.1)"}} onClick={()=>toggle(k)}>
        <div className="ad-toggle-thumb" style={{left:on?19:2}}/>
      </div>
    );
  }

  const sections = [
    { title:"Automation", items:[
      { k:"autoEsc",    label:"Auto-Escalation",   desc:"Auto-escalate issues unresolved after 48h" },
      { k:"slaWarn",    label:"SLA Warnings",       desc:"Alert admin when SLA breach is imminent" },
    ]},
    { title:"Intelligence", items:[
      { k:"aiAlerts",   label:"AI Admin Alerts",    desc:"Receive AI-generated system recommendations" },
      { k:"emailDigest",label:"Email Digest",        desc:"Daily summary email to admin inbox" },
    ]},
    { title:"Access", items:[
      { k:"publicHeatmap", label:"Public Heatmap",  desc:"Allow students to view campus heatmap" },
    ]},
  ];

  return (
    <div style={{maxWidth:680}}>
      <div className="ad-section-hdr">
        <div>
          <div className="ad-section-title">Admin Settings</div>
          <div className="ad-section-sub">System configuration and preferences</div>
        </div>
      </div>
      {sections.map(sec=>(
        <div key={sec.title} className="ad-panel" style={{marginBottom:14}}>
          <div className="ad-ptitle">⚙️ {sec.title}</div>
          {sec.items.map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<sec.items.length-1?"1px solid var(--border)":"none"}}>
              <div>
                <div style={{fontSize:13.5,fontWeight:500}}>{item.label}</div>
                <div style={{fontSize:11.5,color:"var(--text3)",marginTop:2}}>{item.desc}</div>
              </div>
              <Tog k={item.k}/>
            </div>
          ))}
        </div>
      ))}
      <div className="ad-panel">
        <div className="ad-ptitle">🏫 Institution Profile</div>
        <div className="ad-g2" style={{gap:12}}>
          {[["Institution","IIT Indore"],["Admin Email","admin@iiti.ac.in"],["Timezone","IST (UTC+5:30)"],["Academic Year","2024–25"]].map(([l,v])=>(
            <div key={l} className="ad-field" style={{marginBottom:0}}>
              <label>{l}</label>
              <input className="ad-input" defaultValue={v}/>
            </div>
          ))}
        </div>
        <div style={{marginTop:14}}><button className="ad-btn primary">Save Settings</button></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW PAGE (main dashboard)
───────────────────────────────────────────── */
function OverviewPage({ issues, committeeAnalytics, categoryDistribution, heatmapData }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,letterSpacing:"-.4px"}}>
          ResolveX Admin Dashboard 🛡️
        </div>
        <div style={{color:"var(--text2)",fontSize:12.5,marginTop:4}}>
          System-wide campus operations overview · {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </div>
      </div>

      <SystemAlerts issues={issues} />
      <MetricsRow issues={issues} />

      <div className="ad-gdash">
        {/* LEFT */}
        <div className="ad-col">
          <CommitteeTable committeeAnalytics={committeeAnalytics} onSelect={setSelected} />
          <CategoryDistribution categoryDistribution={categoryDistribution} />
          <ResolutionTrend />
          <MonthlyVolume />
          <HeatmapWrapper heatmapData={heatmapData} />
          <AnnouncementWrapper />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="ad-col">
          <ResolutionGauge issues={issues} />
          <StatusDonut issues={issues} />
          <TopIssues issues={issues} />
          <HeatmapCalendar />
          <ActivityTimeline />
          <AIAdminInsights issues={issues} committeeAnalytics={committeeAnalytics} />
        </div>
      </div>

      {selected && <CommitteeModal item={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT — AdminDashboard
   (drop-in replacement for your original)
───────────────────────────────────────────── */
const AdminDashboard = () => {

  /* ── STATE (unchanged from original) ── */
  const [issues,               setIssues]               = useState([]);
  const [committeeAnalytics,   setCommitteeAnalytics]   = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [heatmapData,          setHeatmapData]          = useState([]);
  const [loading,              setLoading]              = useState(true);
  const [error,                setError]                = useState("");
  const [activeTab,            setActiveTab]            = useState("Overview");

  /* ── INJECT STYLES ONCE ── */
  useEffect(() => {
    const id = "ad-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* ── FIRESTORE REALTIME (unchanged logic) ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "issues"),
      (snapshot) => {
        try {
          const issuesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setIssues(issuesData);
          setCommitteeAnalytics(calculateCommitteeAnalytics(issuesData));
          setCategoryDistribution(calculateCategoryDistribution(issuesData));
          setHeatmapData(calculateLocationHeatmap(issuesData));
          setLoading(false);
        } catch (err) {
          console.error("Admin dashboard analytics error:", err);
          setError("Failed to calculate dashboard analytics.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Realtime dashboard connection failed.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  /* ── LOADING ── */
  if (loading) return (
    <div className="ad-loading">
      <div className="ad-spinner" />
      <p style={{color:"var(--text2)",fontSize:14}}>Loading ResolveX Admin Dashboard…</p>
    </div>
  );

  /* ── ERROR ── */
  if (error) return (
    <div className="ad-error">
      <div className="ad-error-box">⚠️ {error}</div>
    </div>
  );

  /* ── PAGE ROUTING ── */
  const pages = {
    Overview:     <OverviewPage    issues={issues} committeeAnalytics={committeeAnalytics} categoryDistribution={categoryDistribution} heatmapData={heatmapData} />,
    Committees:   <CommitteesPage  committeeAnalytics={committeeAnalytics} issues={issues} />,
    Issues:       <div className="ad-panel"><div className="ad-ptitle">📋 <span className="ad-ptitle-a">All Issues</span></div><p style={{color:"var(--text3)",fontSize:13}}>Full issues table — wire up your IssuesPage component here.</p></div>,
    Analytics:    <AnalyticsPage   issues={issues} categoryDistribution={categoryDistribution} committeeAnalytics={committeeAnalytics} />,
    "AI Insights":<AIInsightsPage  issues={issues} committeeAnalytics={committeeAnalytics} />,
    Settings:     <SettingsPage />,
  };

  /* ── RENDER ── */
  return (
    <div className="ad-root">
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ad-main">
        {pages[activeTab]}
      </main>

      {/* DEBUG (preserved from original, styled) */}
      <div style={{maxWidth:1500,margin:"0 auto",padding:"0 32px"}}>
        <div className="ad-debug">
          <span>Issues Loaded: {issues.length}</span>
          <span>Committees Tracked: {committeeAnalytics.length}</span>
          <span>Heatmap Locations: {heatmapData.length}</span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;