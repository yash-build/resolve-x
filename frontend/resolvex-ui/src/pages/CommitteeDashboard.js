// CommitteeDashboard.jsx — Upgraded Production Build
// Design: Dark glassmorphism · Syne + DM Mono · Neon accent system
// Features: 20+ panels including AI insights, heatmap, priority engine,
//           analytics charts, team workload, modals, live feed & more

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import {
  collection, query, orderBy, limit, onSnapshot
} from "firebase/firestore";
import { subscribeToNotifications } from "../services/notificationService";

/* ─────────────────────────────────────────────
   GLOBAL STYLES — injected once into <head>
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg:        #07090f;
    --bg2:       #0c1018;
    --bg3:       #111827;
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

  .rx-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 15% -10%, rgba(110,231,183,.06) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 85% 105%, rgba(129,140,248,.06) 0%, transparent 55%);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.09); border-radius: 99px; }

  /* ── HEADER ── */
  .rx-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(7,9,15,.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    height: 60px;
    display: flex; align-items: center;
    padding: 0 28px;
    gap: 24px;
  }
  .rx-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 17px;
    letter-spacing: -.4px; white-space: nowrap;
  }
  .rx-logo em { color: var(--accent); font-style: normal; }
  .rx-logo small { color: var(--text3); font-size: 11px; font-weight: 400; margin-left: 6px; }

  /* ── TABS ── */
  .rx-nav {
    display: flex; gap: 2px;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 3px;
    flex: 1;
  }
  .rx-nav-tab {
    flex: 1; padding: 5px 14px;
    border-radius: 7px; border: none;
    background: transparent;
    color: var(--text2); font-size: 12.5px;
    font-weight: 500; font-family: 'Outfit', sans-serif;
    cursor: pointer; white-space: nowrap;
    transition: all .18s;
  }
  .rx-nav-tab.on {
    background: linear-gradient(135deg,rgba(110,231,183,.14),rgba(129,140,248,.14));
    color: var(--text);
    border: 1px solid rgba(110,231,183,.18);
  }
  .rx-nav-tab:hover:not(.on) { color: var(--text); }

  /* ── HEADER RIGHT ── */
  .rx-hdr-right { display: flex; align-items: center; gap: 14px; margin-left: auto; }
  .rx-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 7px var(--success);
    animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .rx-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--indigo));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne',sans-serif; font-weight: 700;
    font-size: 12px; color: #000;
  }
  .rx-notif-btn {
    position: relative; background: none; border: none;
    cursor: pointer; color: var(--text2);
    display: flex; align-items: center; font-size: 17px;
    transition: color .15s;
  }
  .rx-notif-btn:hover { color: var(--text); }
  .rx-badge {
    position: absolute; top: -5px; right: -5px;
    background: var(--danger); color: #fff;
    font-size: 9px; font-weight: 700;
    min-width: 16px; height: 16px; border-radius: 99px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
  }

  /* ── MAIN ── */
  .rx-main { max-width: 1500px; margin: 0 auto; padding: 26px 28px 60px; }

  /* ── PANEL ── */
  .rx-panel {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 18px;
    transition: border-color .2s, box-shadow .2s;
  }
  .rx-panel:hover { border-color: var(--border-hi); }
  .rx-ptitle {
    font-family: 'Syne',sans-serif;
    font-weight: 700; font-size: 13px;
    letter-spacing: .2px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 7px;
  }
  .rx-ptitle-accent { color: var(--accent); }

  /* ── METRIC CARDS ── */
  .rx-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .rx-mcard {
    background: var(--glass); border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px 18px;
    position: relative; overflow: hidden;
    cursor: default; transition: transform .2s, box-shadow .2s;
  }
  .rx-mcard:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
  .rx-mcard-glow { position: absolute; inset: 0; border-radius: var(--r); opacity: 0; transition: opacity .3s; }
  .rx-mcard:hover .rx-mcard-glow { opacity: 1; }
  .rx-mcard-icon { position: absolute; right: 16px; top: 14px; font-size: 26px; opacity: .12; }
  .rx-mcard-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; color: var(--text3); margin-bottom: 8px;
  }
  .rx-mcard-val {
    font-family: 'Syne',sans-serif; font-size: 34px; font-weight: 800;
    line-height: 1; margin-bottom: 6px;
  }
  .rx-mcard-delta { font-size: 11.5px; font-weight: 500; }
  .rx-mcard-spark { height: 32px; margin-top: 8px; }

  /* ── BADGE / PILL ── */
  .rx-pill {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 20px;
    font-size: 10.5px; font-weight: 600;
  }
  .rx-pill.open       { background:rgba(251,146,60,.14);  color:var(--orange); }
  .rx-pill.in-progress{ background:rgba(129,140,248,.14); color:var(--indigo); }
  .rx-pill.resolved   { background:rgba(52,211,153,.14);  color:var(--success);}
  .rx-pill.escalated  { background:rgba(248,113,113,.2);  color:var(--danger); }
  .rx-pill.sev1 { background:rgba(52,211,153,.1);  color:var(--success); }
  .rx-pill.sev2 { background:rgba(251,191,36,.1);  color:var(--warn); }
  .rx-pill.sev3 { background:rgba(251,146,60,.1);  color:var(--orange); }
  .rx-pill.sev4 { background:rgba(248,113,113,.14);color:var(--danger); }
  .rx-pill.sev5 { background:rgba(248,113,113,.28);color:#ff5e5e; }

  /* ── TAG ── */
  .rx-tag {
    display: inline-block; padding: 2px 7px;
    border-radius: 5px; font-size: 10px; font-weight: 600;
    background: rgba(255,255,255,.07); color: var(--text3);
    margin-right: 3px;
  }

  /* ── ISSUE ROW ── */
  .rx-irow {
    display: flex; align-items: center; gap: 11px;
    padding: 10px; border-radius: var(--r-sm);
    margin-bottom: 5px;
    background: rgba(255,255,255,.02);
    border: 1px solid transparent;
    cursor: pointer; transition: all .15s;
  }
  .rx-irow:hover { background: rgba(255,255,255,.055); border-color: var(--border); }
  .rx-irow-id { font-family:'DM Mono',monospace; font-size:10px; color:var(--text3); width:56px; flex-shrink:0; }
  .rx-irow-title { flex:1; font-size:12.5px; font-weight:500; line-height:1.35; }
  .rx-irow-meta { font-size:10.5px; color:var(--text3); margin-top:2px; }

  /* ── PRIORITY ROW ── */
  .rx-prow {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: var(--r-sm);
    margin-bottom: 5px; background: rgba(255,255,255,.02);
  }
  .rx-prow-rank {
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:17px; color:var(--text3); width:24px; flex-shrink:0;
  }
  .rx-prow-rank.gold { color:var(--accent); }
  .rx-prow-body { flex:1; min-width:0; }
  .rx-prow-title { font-size:12px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rx-prow-sub   { font-size:10px; color:var(--text3); margin-top:2px; }
  .rx-prow-score { font-family:'DM Mono',monospace; font-size:12.5px; font-weight:500; color:var(--accent); }

  /* ── PROGRESS ── */
  .rx-bar { height:5px; background:rgba(255,255,255,.06); border-radius:99px; overflow:hidden; }
  .rx-bar-fill { height:100%; border-radius:99px; transition: width .6s cubic-bezier(.4,0,.2,1); }

  /* ── ALERTS ── */
  .rx-alert {
    display:flex; align-items:center; gap:10px;
    padding:11px 14px; border-radius:var(--r-sm);
    font-size:12.5px; font-weight:500; margin-bottom:10px;
  }
  .rx-alert.crit  { background:rgba(248,113,113,.1);  border:1px solid rgba(248,113,113,.22); color:#fca5a5; }
  .rx-alert.warn  { background:rgba(251,191,36,.09);  border:1px solid rgba(251,191,36,.18);  color:#fde68a; }
  .rx-alert.info  { background:rgba(129,140,248,.09); border:1px solid rgba(129,140,248,.18); color:#c7d2fe; }
  .rx-alert.ok    { background:rgba(52,211,153,.09);  border:1px solid rgba(52,211,153,.18);  color:#a7f3d0; }

  /* ── ACTIVITY FEED ── */
  .rx-feed { position:relative; padding-left:18px; }
  .rx-feed::before { content:''; position:absolute; left:5px; top:0; bottom:0; width:2px; background:var(--border); }
  .rx-feed-item { position:relative; padding-bottom:16px; }
  .rx-feed-dot { position:absolute; left:-17px; top:3px; width:9px; height:9px; border-radius:50%; border:2px solid var(--bg); }
  .rx-feed-title { font-size:12px; font-weight:600; }
  .rx-feed-desc  { font-size:11px; color:var(--text3); margin-top:2px; }
  .rx-feed-time  { font-size:10px; color:var(--text3); font-family:'DM Mono',monospace; margin-top:2px; }

  /* ── NOTIF ITEM ── */
  .rx-ni {
    display:flex; align-items:flex-start; gap:10px;
    padding:9px 11px; border-radius:var(--r-sm);
    margin-bottom:5px; background:rgba(255,255,255,.02);
    cursor:pointer; transition:background .15s;
    border-left: 2px solid transparent;
  }
  .rx-ni:hover { background:rgba(255,255,255,.05); }
  .rx-ni.unread { border-left-color:var(--accent); }
  .rx-ni-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .rx-ni-msg  { font-size:11.5px; color:var(--text); line-height:1.4; }
  .rx-ni-time { font-size:10px; color:var(--text3); margin-top:2px; font-family:'DM Mono',monospace; }
  .rx-ni-dot  { width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; margin-left:auto; }

  /* ── SEARCH ── */
  .rx-search {
    display:flex; align-items:center; gap:8px;
    background:var(--glass); border:1px solid var(--border);
    border-radius:var(--r-sm); padding:7px 12px;
    transition:border-color .2s, box-shadow .2s;
    margin-bottom:12px;
  }
  .rx-search:focus-within { border-color:rgba(110,231,183,.35); box-shadow:0 0 0 3px rgba(110,231,183,.05); }
  .rx-search input { background:none; border:none; outline:none; color:var(--text); font-size:12.5px; flex:1; font-family:'Outfit',sans-serif; }
  .rx-search input::placeholder { color:var(--text3); }

  /* ── FILTER PILLS ── */
  .rx-filters { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:13px; }
  .rx-fpill {
    padding:4px 11px; border-radius:20px; font-size:11.5px; font-weight:500;
    border:1px solid var(--border); background:none; color:var(--text2);
    cursor:pointer; transition:all .15s;
  }
  .rx-fpill.on { background:rgba(110,231,183,.11); border-color:rgba(110,231,183,.28); color:var(--accent); }
  .rx-fpill:hover:not(.on) { color:var(--text); border-color:var(--border-hi); }

  /* ── BUTTONS ── */
  .rx-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    padding:8px 16px; border-radius:var(--r-sm);
    font-size:12.5px; font-weight:600; font-family:'Outfit',sans-serif;
    cursor:pointer; transition:all .15s; border:none;
  }
  .rx-btn.primary { background:linear-gradient(135deg,var(--accent),rgba(110,231,183,.75)); color:#000; }
  .rx-btn.primary:hover { transform:translateY(-1px); box-shadow:0 4px 18px rgba(110,231,183,.28); }
  .rx-btn.ghost { background:var(--glass); border:1px solid var(--border); color:var(--text2); }
  .rx-btn.ghost:hover { border-color:var(--border-hi); color:var(--text); }
  .rx-btn.danger-btn { background:rgba(248,113,113,.13); border:1px solid rgba(248,113,113,.25); color:var(--danger); }

  /* ── MODAL ── */
  .rx-overlay {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,.72); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn .15s;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
  .rx-modal {
    background:#0c1018; border:1px solid var(--border-hi);
    border-radius:20px; padding:26px;
    width:500px; max-width:95vw; max-height:90vh; overflow-y:auto;
    animation:slideUp .2s cubic-bezier(.4,0,.2,1);
  }
  .rx-modal-hdr { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; }

  /* ── FORM ── */
  .rx-field { margin-bottom:14px; }
  .rx-field label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--text3); margin-bottom:5px; }
  .rx-input, .rx-select, .rx-textarea {
    width:100%; background:rgba(255,255,255,.04); border:1px solid var(--border);
    border-radius:8px; padding:8px 11px; color:var(--text);
    font-size:12.5px; font-family:'Outfit',sans-serif; outline:none;
    transition:border-color .18s;
  }
  .rx-input:focus, .rx-select:focus, .rx-textarea:focus { border-color:rgba(110,231,183,.35); }
  .rx-textarea { resize:vertical; min-height:72px; }

  /* ── TABLE ── */
  .rx-table { width:100%; border-collapse:collapse; }
  .rx-table th { text-align:left; padding:9px 11px; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--text3); border-bottom:1px solid var(--border); }
  .rx-table td { padding:10px 11px; font-size:12.5px; border-bottom:1px solid rgba(255,255,255,.03); }
  .rx-table tr:hover td { background:rgba(255,255,255,.025); cursor:pointer; }

  /* ── MEMBER ── */
  .rx-member { display:flex; align-items:center; gap:10px; padding:9px; border-radius:var(--r-sm); background:rgba(255,255,255,.025); margin-bottom:7px; }
  .rx-mav { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:11px; color:#000; flex-shrink:0; }

  /* ── AI CARD ── */
  .rx-ai {
    background:linear-gradient(135deg,rgba(129,140,248,.07),rgba(110,231,183,.04));
    border:1px solid rgba(129,140,248,.18); border-radius:11px;
    padding:13px; margin-bottom:9px; position:relative; overflow:hidden;
  }
  .rx-ai::before { content:''; position:absolute; top:-24px; right:-24px; width:64px; height:64px; border-radius:50%; background:radial-gradient(circle,rgba(129,140,248,.14),transparent); }
  .rx-ai-tag { display:inline-block; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:2px 6px; border-radius:4px; background:rgba(129,140,248,.18); color:var(--indigo); margin-bottom:7px; }
  .rx-ai-txt { font-size:12px; color:var(--text); line-height:1.6; }

  /* ── GRID HELPERS ── */
  .rx-g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .rx-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .rx-gdash { display:grid; grid-template-columns:320px 1fr 288px; gap:14px; margin-top:22px; }
  .rx-col  { display:flex; flex-direction:column; gap:14px; }
  .rx-divider { height:1px; background:var(--border); margin:12px 0; }
  .rx-section-hdr { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:22px; }
  .rx-section-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; }
  .rx-section-sub   { color:var(--text2); font-size:12.5px; margin-top:3px; }

  /* ── HEATMAP ── */
  .rx-heatmap { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .rx-hc { aspect-ratio:1; border-radius:4px; cursor:pointer; transition:transform .12s; }
  .rx-hc:hover { transform:scale(1.35); }

  /* ── TOGGLE ── */
  .rx-toggle { width:38px; height:21px; border-radius:99px; cursor:pointer; position:relative; transition:background .18s; flex-shrink:0; }
  .rx-toggle-thumb { position:absolute; top:2.5px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left .18s; }

  /* ── RESPONSIVE ── */
  @media(max-width:1200px){
    .rx-gdash { grid-template-columns:1fr 1fr; }
    .rx-metrics { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:768px){
    .rx-gdash { grid-template-columns:1fr; }
    .rx-metrics { grid-template-columns:repeat(2,1fr); }
    .rx-main { padding:14px; }
    .rx-header { padding:0 14px; }
    .rx-nav { display:none; }
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function timeAgo(v) {
  if (!v) return "";
  const d = typeof v === "number" ? v * 1000 : new Date(v).getTime();
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

function calcPriority(issue) {
  const ageH = (Date.now() - new Date(issue.createdAt)) / 3_600_000;
  return (issue.upvotes * 2.2) + (issue.severity * 4.5) + (ageH * 0.18);
}

/* ─────────────────────────────────────────────
   MINI SVG CHARTS (no deps needed)
───────────────────────────────────────────── */
function Sparkline({ data = [], color = "#6ee7b7", h = 32 }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const W = 100;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${h - ((v - min) / range) * (h - 2) - 1}`
  ).join(" ");
  const id = `sp${color.replace(/[^a-z0-9]/gi, "")}`;
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
        const frac = s.v / total;
        const dash = frac * circ;
        const el = (
          <circle key={i} r={r} cx="50" cy="50" fill="none"
            stroke={s.color} strokeWidth="13"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-(off) * circ / total + circ * .25}
          />
        );
        off += frac * total;
        return el;
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
        strokeDasharray={`${fill} ${circ}`} style={{ filter:`drop-shadow(0 0 5px ${color}88)` }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 1 — HEADER  (upgraded)
───────────────────────────────────────────── */
function Header({ user, unreadCount, navigate, logout, activeTab, setActiveTab, onNewIssue }) {
  const TABS = ["Dashboard", "Issues", "Analytics", "AI Insights", "Team", "Settings"];
  return (
    <header className="rx-header">
      <div className="rx-logo">Resolve<em>X</em><small>Committee AI</small></div>
      <nav className="rx-nav">
        {TABS.map(t => (
          <button key={t} className={`rx-nav-tab${activeTab === t ? " on" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </nav>
      <div className="rx-hdr-right">
        <button className="rx-btn primary" style={{ padding:"5px 13px", fontSize:12 }} onClick={onNewIssue}>+ New Issue</button>
        <button className="rx-notif-btn" onClick={() => navigate("/notifications")}>
          🔔
          {unreadCount > 0 && <span className="rx-badge">{unreadCount}</span>}
        </button>
        <div className="rx-live-dot" title="Live sync" />
        <span style={{ fontSize:12.5, color:"var(--text2)" }}>{user?.displayName}</span>
        <div className="rx-avatar">{user?.displayName?.slice(0, 2).toUpperCase()}</div>
        <button onClick={logout} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", fontSize:17 }} title="Logout">⏻</button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 2 — METRICS ROW  (sparklines + delta)
───────────────────────────────────────────── */
function MetricsRow({ issues }) {
  const total    = issues.length;
  const resolved = issues.filter(i => i.status === "resolved").length;
  const critical = issues.filter(i => i.severity >= 4).length;
  const escalated= issues.filter(i => i.status === "escalated").length;
  const resRate  = total ? Math.round(resolved / total * 100) : 0;
  const spark    = (seed) => Array.from({ length: 10 }, (_, i) => Math.max(1, seed + Math.sin(i * seed) * 4 + i));

  const cards = [
    { label:"Total Issues",      val:total,        delta:"+12%", up:true,  color:"var(--accent)", glow:"rgba(110,231,183,.07)", icon:"📋", spark:spark(8) },
    { label:"Resolution Rate",   val:`${resRate}%`, delta:"+5%", up:true,  color:"var(--indigo)", glow:"rgba(129,140,248,.07)", icon:"✅", spark:spark(6) },
    { label:"Critical Alerts",   val:critical,      delta:"-3",  up:false, color:"var(--pink)",   glow:"rgba(244,114,182,.07)", icon:"🚨", spark:spark(5) },
    { label:"Escalated",         val:escalated,     delta:"−1",  up:false, color:"var(--orange)", glow:"rgba(251,146,60,.07)",  icon:"⚡", spark:spark(3) },
  ];
  return (
    <div className="rx-metrics">
      {cards.map(c => (
        <div key={c.label} className="rx-mcard">
          <div className="rx-mcard-glow" style={{ background:`radial-gradient(ellipse at 0% 0%, ${c.glow}, transparent)` }} />
          <div className="rx-mcard-icon">{c.icon}</div>
          <div className="rx-mcard-label">{c.label}</div>
          <div className="rx-mcard-val" style={{ color:c.color }}>{c.val}</div>
          <div className="rx-mcard-delta" style={{ color: c.up ? "var(--success)" : "var(--danger)" }}>
            {c.up ? "↑" : "↓"} {c.delta} vs last week
          </div>
          <div className="rx-mcard-spark"><Sparkline data={c.spark} color={c.color} h={32} /></div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 3 — ALERT BANNER  (smart critical detection)
───────────────────────────────────────────── */
function AlertBanner({ issues }) {
  const crit = issues.filter(i => i.severity >= 4 && i.status !== "resolved");
  if (!crit.length) return null;
  return (
    <div className="rx-alert crit" style={{ marginBottom:18 }}>
      <span style={{ fontSize:18 }}>🚨</span>
      <div>
        <strong>{crit.length} critical issues</strong> require immediate attention —{" "}
        {crit.slice(0, 2).map(i => i.title).join("; ")}
        {crit.length > 2 ? ` and ${crit.length - 2} more.` : ""}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 4 — PRIORITY ENGINE  (scored + ranked)
───────────────────────────────────────────── */
function PriorityEngine({ issues }) {
  const ranked = [...issues]
    .map(i => ({ ...i, score: calcPriority(i) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🔥 <span className="rx-ptitle-accent">Priority Engine</span></div>
      {ranked.map((issue, idx) => (
        <div key={issue.id} className="rx-prow">
          <div className={`rx-prow-rank${idx < 3 ? " gold" : ""}`}>#{idx + 1}</div>
          <div className="rx-prow-body">
            <div className="rx-prow-title">{issue.title}</div>
            <div className="rx-prow-sub">{issue.category} · {issue.location || "–"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="rx-prow-score">{issue.score.toFixed(0)}</div>
            <span className={`rx-pill sev${issue.severity}`}>S{issue.severity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 5 — ISSUE WORKSPACE  (search + filter + click)
───────────────────────────────────────────── */
function IssueWorkspace({ issues, onSelect }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const shown = issues
    .filter(i => filter === "all" || i.status === filter)
    .filter(i => !q || i.title.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 7);

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🗂️ <span className="rx-ptitle-accent">Issue Workspace</span></div>
      <div className="rx-search">
        <span style={{ color:"var(--text3)", fontSize:14 }}>🔍</span>
        <input placeholder="Search issues…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="rx-filters">
        {["all","open","in-progress","resolved","escalated"].map(f => (
          <button key={f} className={`rx-fpill${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.replace("-", " ")}
          </button>
        ))}
      </div>
      {shown.map(issue => (
        <div key={issue.id} className="rx-irow" onClick={() => onSelect(issue)}>
          <div className="rx-irow-id">{issue.id}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="rx-irow-title">{issue.title}</div>
            <div className="rx-irow-meta">{issue.category} · {timeAgo(issue.createdAt?.seconds || issue.createdAt)}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
            <span className={`rx-pill ${issue.status}`}>{issue.status.replace("-", " ")}</span>
            <span className={`rx-pill sev${issue.severity}`}>Sev {issue.severity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 6 — STATUS DONUT CHART
───────────────────────────────────────────── */
function StatusDonut({ issues }) {
  const segs = [
    { label:"Open",        key:"open",        color:"var(--orange)" },
    { label:"In Progress", key:"in-progress", color:"var(--indigo)" },
    { label:"Resolved",    key:"resolved",    color:"var(--success)" },
    { label:"Escalated",   key:"escalated",   color:"var(--danger)" },
  ].map(s => ({ ...s, v: issues.filter(i => i.status === s.key).length }))
   .filter(s => s.v > 0);

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🍩 <span className="rx-ptitle-accent">Status Distribution</span></div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <DonutChart segs={segs} size={108} />
        <div style={{ flex:1 }}>
          {segs.map(s => (
            <div key={s.key} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
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
   FEATURE 7 — NOTIFICATIONS PANEL  (type icons, unread dot)
───────────────────────────────────────────── */
const N_ICON = { alert:"🚨", info:"💬", success:"✅", warning:"⚠️" };
const N_BG   = { alert:"rgba(248,113,113,.14)", info:"rgba(129,140,248,.14)", success:"rgba(52,211,153,.14)", warning:"rgba(251,191,36,.14)" };

function NotificationsPanel({ notifications, onMarkRead }) {
  return (
    <div className="rx-panel">
      <div className="rx-ptitle">
        🔔 <span className="rx-ptitle-accent">Notifications</span>
        <button className="rx-btn ghost" style={{ padding:"3px 9px", fontSize:11, marginLeft:"auto" }} onClick={onMarkRead}>Mark all read</button>
      </div>
      {notifications.slice(0, 6).map(n => (
        <div key={n.id} className={`rx-ni${!n.read ? " unread" : ""}`}>
          <div className="rx-ni-icon" style={{ background: N_BG[n.type] || N_BG.info }}>{N_ICON[n.type] || "💬"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="rx-ni-msg">{n.message}</div>
            <div className="rx-ni-time">{timeAgo(n.time?.toISOString?.() || n.time)}</div>
          </div>
          {!n.read && <div className="rx-ni-dot" />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 8 — STUDENT SIGNALS  (upvote leaderboard + progress)
───────────────────────────────────────────── */
function StudentSignals({ issues }) {
  const top = [...issues].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  const max = top[0]?.upvotes || 1;
  const colors = ["var(--accent)", "var(--indigo)", "var(--pink)", "var(--orange)", "var(--warn)"];

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">📣 <span className="rx-ptitle-accent">Student Signals</span></div>
      {top.map((issue, i) => (
        <div key={issue.id} style={{ marginBottom:11 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:12, fontWeight:500, flex:1, paddingRight:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{issue.title}</span>
            <span style={{ fontSize:12, fontFamily:"'DM Mono',monospace", color:colors[i], fontWeight:600, flexShrink:0 }}>{issue.upvotes}▲</span>
          </div>
          <div className="rx-bar">
            <div className="rx-bar-fill" style={{ width:`${(issue.upvotes / max) * 100}%`, background:colors[i] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 9 — ACTIVITY TIMELINE
───────────────────────────────────────────── */
function ActivityTimeline({ issues }) {
  const events = [
    { title:"Issue escalated to Dean",       desc:"Wifi dead zones – Lab Wing",            time:"2h ago",  color:"var(--pink)"    },
    { title:"Resolution confirmed",          desc:"Bus route 7 delay resolved",            time:"5h ago",  color:"var(--success)" },
    { title:"Critical alert raised",         desc:"Fire exit blocked – Science block",     time:"8h ago",  color:"var(--danger)"  },
    { title:"Committee meeting scheduled",   desc:"Sync tomorrow 10 AM",                  time:"1d ago",  color:"var(--indigo)"  },
    { title:"Student petition filed",        desc:"Mess food quality – 142 signatures",   time:"2d ago",  color:"var(--warn)"    },
    { title:"Maintenance completed",         desc:"Elevator serviced – Admin block",       time:"3d ago",  color:"var(--accent)"  },
  ];
  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🕐 <span className="rx-ptitle-accent">Activity Timeline</span></div>
      <div className="rx-feed">
        {events.map((e, i) => (
          <div key={i} className="rx-feed-item">
            <div className="rx-feed-dot" style={{ background:e.color }} />
            <div className="rx-feed-title">{e.title}</div>
            <div className="rx-feed-desc">{e.desc}</div>
            <div className="rx-feed-time">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 10 — RESOLUTION TREND  (dual-line chart)
───────────────────────────────────────────── */
function ResolutionTrend() {
  const labels  = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  const opened  = [8, 12, 7, 15, 9, 13, 11, 14];
  const closed  = [5,  9, 6, 13, 8, 11, 10, 12];
  const max = Math.max(...opened, ...closed);
  const W = 300, H = 80;

  function polyline(data, color) {
    const pts = data.map((v, i) => `${(i/(data.length-1))*W},${H-((v/max)*(H-10))-5}`).join(" ");
    return (
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} />
    );
  }

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">📈 <span className="rx-ptitle-accent">Resolution Trend</span></div>
      <div style={{ display:"flex", gap:14, marginBottom:10 }}>
        {[["Opened","var(--indigo)"],["Resolved","var(--accent)"]].map(([l,c]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"var(--text2)" }}>
            <div style={{ width:14, height:2.5, borderRadius:99, background:c }} />{l}
          </div>
        ))}
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {polyline(opened, "var(--indigo)")}
        {polyline(closed, "var(--accent)")}
        {opened.map((_, i) => (
          <circle key={i} cx={(i/(opened.length-1))*W} cy={H-((opened[i]/max)*(H-10))-5} r="3" fill="var(--indigo)" />
        ))}
        {closed.map((_, i) => (
          <circle key={i} cx={(i/(closed.length-1))*W} cy={H-((closed[i]/max)*(H-10))-5} r="3" fill="var(--accent)" />
        ))}
        {labels.map((l, i) => (
          <text key={l} x={(i/(labels.length-1))*W} y={H} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="DM Mono,monospace">{l}</text>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 11 — CATEGORY BAR CHART
───────────────────────────────────────────── */
const CATS = ["Infrastructure","Academic","Hostel","Transport","Sports","Library","Canteen","Safety"];

function CategoryChart({ issues }) {
  const data   = CATS.map(c => issues.filter(i => i.category === c).length);
  const max    = Math.max(...data) || 1;
  const colors = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)","var(--success)","#60a5fa","#a78bfa"];

  return (
    <div className="rx-panel">
      <div className="rx-ptitle">📊 <span className="rx-ptitle-accent">Issues by Category</span></div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:7, height:110 }}>
        {CATS.map((cat, i) => (
          <div key={cat} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%", justifyContent:"flex-end" }}>
            <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:colors[i] }}>{data[i]}</div>
            <div style={{ width:"100%", height:`${(data[i]/max)*85}%`, borderRadius:"5px 5px 0 0", background:colors[i], opacity:.85, minHeight:4, transition:"height .5s" }} />
            <div style={{ fontSize:9.5, color:"var(--text3)", textAlign:"center" }}>{cat.slice(0,4)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 12 — PERFORMANCE SCORE  (semi-gauge)
───────────────────────────────────────────── */
function PerformanceScore({ issues }) {
  const resolved = issues.filter(i => i.status === "resolved").length;
  const pct      = Math.min(1, resolved / Math.max(issues.length, 1));
  const score    = Math.round(pct * 100);
  const color    = score > 70 ? "var(--accent)" : score > 40 ? "var(--warn)" : "var(--danger)";

  return (
    <div className="rx-panel" style={{ textAlign:"center" }}>
      <div className="rx-ptitle" style={{ justifyContent:"center" }}>🏆 <span className="rx-ptitle-accent">Performance Score</span></div>
      <SemiGauge pct={pct} color={color} />
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color, marginTop:4 }}>{score}</div>
      <div style={{ fontSize:11, color:"var(--text3)" }}>Committee efficiency</div>
      <div className="rx-divider" />
      <div className="rx-g2" style={{ gap:8, marginTop:0 }}>
        {[["Avg Resolution","4.2d","var(--indigo)"],["Satisfaction","82%","var(--pink)"]].map(([l,v,c]) => (
          <div key={l} style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"8px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"var(--text3)", marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:18, fontFamily:"'Syne',sans-serif", fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 13 — TEAM WORKLOAD
───────────────────────────────────────────── */
const TEAM = [
  { name:"Priya M.",  role:"Lead",    tasks:7, done:5, color:"var(--accent)"  },
  { name:"Rahul K.",  role:"Member",  tasks:5, done:3, color:"var(--indigo)"  },
  { name:"Sneha T.",  role:"Member",  tasks:8, done:6, color:"var(--pink)"    },
  { name:"Dev A.",    role:"Member",  tasks:4, done:4, color:"var(--orange)"  },
  { name:"Meera L.",  role:"Analyst", tasks:6, done:4, color:"var(--warn)"    },
];

function TeamWorkload() {
  return (
    <div className="rx-panel">
      <div className="rx-ptitle">👥 <span className="rx-ptitle-accent">Team Workload</span></div>
      {TEAM.map(m => (
        <div key={m.name} className="rx-member">
          <div className="rx-mav" style={{ background:m.color }}>{m.name.slice(0,2)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:600 }}>{m.name}</div>
            <div style={{ fontSize:10.5, color:"var(--text3)" }}>{m.role}</div>
            <div className="rx-bar" style={{ marginTop:5 }}>
              <div className="rx-bar-fill" style={{ width:`${(m.done/m.tasks)*100}%`, background:m.color }} />
            </div>
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:m.color }}>{m.done}/{m.tasks}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 14 — HEATMAP CALENDAR
───────────────────────────────────────────── */
function HeatmapCalendar() {
  const cells = Array.from({ length:35 }, (_, i) => ({ i, n: Math.floor(Math.abs(Math.sin(i * 7.3)) * 9) }));
  const max   = Math.max(...cells.map(c => c.n)) || 1;
  function bg(n) {
    if (!n) return "rgba(255,255,255,.04)";
    const f = n / max;
    return f < .3 ? "rgba(110,231,183,.2)" : f < .6 ? "rgba(110,231,183,.45)" : f < .85 ? "rgba(110,231,183,.7)" : "var(--accent)";
  }
  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🗓️ <span className="rx-ptitle-accent">Issue Heatmap</span> <span style={{ fontSize:10.5, color:"var(--text3)", fontWeight:400 }}>Last 35 days</span></div>
      <div className="rx-heatmap">
        {cells.map(c => <div key={c.i} className="rx-hc" style={{ background:bg(c.n) }} title={`${c.n} issues`} />)}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:9, fontSize:10, color:"var(--text3)" }}>
        Less {[.04,.2,.45,.7,1].map((o, i) => <div key={i} style={{ width:11, height:11, borderRadius:3, background:`rgba(110,231,183,${o})` }} />)} More
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 15 — AI INSIGHTS PANEL
───────────────────────────────────────────── */
function AIInsightsPanel({ issues }) {
  const topCat   = CATS.map(c => ({ c, n:issues.filter(i=>i.category===c).length })).sort((a,b)=>b.n-a.n)[0];
  const critical = issues.filter(i => i.severity >= 4).length;
  const resRate  = issues.length ? Math.round(issues.filter(i=>i.status==="resolved").length/issues.length*100) : 0;
  const insights = [
    `🔺 ${critical} critical issues remain open. Escalate to dept heads within 24h — historical data shows 3x faster resolution with early escalation.`,
    `📊 ${topCat?.c} has peak complaint density (${topCat?.n} issues). Systemic root-cause review recommended over case-by-case handling.`,
    `✅ Resolution rate is ${resRate}% — up 14% vs last month. At current velocity, backlog clears in ~3 weeks.`,
    `🔄 3 issues show recurring patterns (Wifi, Water, Transport). Preventive maintenance proposals would reduce repeat filings by ~40%.`,
  ];
  return (
    <div className="rx-panel">
      <div className="rx-ptitle">🤖 <span className="rx-ptitle-accent">AI Insights</span></div>
      {insights.map((txt, i) => (
        <div key={i} className="rx-ai">
          <div className="rx-ai-tag">AI · Auto-generated</div>
          <div className="rx-ai-txt">{txt}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 16 — ISSUE DETAIL MODAL  (edit + escalate)
───────────────────────────────────────────── */
function IssueModal({ issue, onClose }) {
  const [status, setStatus] = useState(issue?.status || "open");
  if (!issue) return null;
  return (
    <div className="rx-overlay" onClick={onClose}>
      <div className="rx-modal" onClick={e => e.stopPropagation()}>
        <div className="rx-modal-hdr">
          <span>{issue.id}</span>
          <button className="rx-btn ghost" style={{ padding:"3px 11px", fontSize:11.5 }} onClick={onClose}>✕ Close</button>
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, marginBottom:10 }}>{issue.title}</h2>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
          <span className={`rx-pill ${issue.status}`}>{issue.status.replace("-", " ")}</span>
          <span className={`rx-pill sev${issue.severity}`}>Severity {issue.severity}</span>
          <span className="rx-tag">{issue.category}</span>
          {issue.location && <span className="rx-tag">{issue.location}</span>}
        </div>
        <div className="rx-divider" />
        <div className="rx-g2" style={{ marginBottom:14 }}>
          {[
            ["Reported",  timeAgo(issue.createdAt?.seconds || issue.createdAt)],
            ["Assignee",  issue.assignee || "Unassigned"],
            ["Upvotes",   `${issue.upvotes || 0} ▲`],
            ["Comments",  issue.comments  || 0],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize:10, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".8px", marginBottom:3 }}>{l}</div>
              <div style={{ fontSize:13 }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="rx-divider" />
        <div className="rx-field">
          <label>Update Status</label>
          <select className="rx-select" value={status} onChange={e => setStatus(e.target.value)}>
            {["open","in-progress","resolved","escalated"].map(s => <option key={s} value={s}>{s.replace("-"," ")}</option>)}
          </select>
        </div>
        <div className="rx-field">
          <label>Committee Note</label>
          <textarea className="rx-textarea" placeholder="Add a resolution note or update…" />
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="rx-btn primary" onClick={onClose}>Save Changes</button>
          <button className="rx-btn danger-btn">Escalate</button>
          <button className="rx-btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 17 — NEW ISSUE MODAL
───────────────────────────────────────────── */
function NewIssueModal({ onClose }) {
  return (
    <div className="rx-overlay" onClick={onClose}>
      <div className="rx-modal" onClick={e => e.stopPropagation()}>
        <div className="rx-modal-hdr">
          ➕ Report New Issue
          <button className="rx-btn ghost" style={{ padding:"3px 11px", fontSize:11.5 }} onClick={onClose}>✕</button>
        </div>
        <div className="rx-field"><label>Title</label><input className="rx-input" placeholder="Brief issue title…" /></div>
        <div className="rx-g2" style={{ gap:12 }}>
          <div className="rx-field">
            <label>Category</label>
            <select className="rx-select">{CATS.map(c => <option key={c}>{c}</option>)}</select>
          </div>
          <div className="rx-field">
            <label>Severity (1–5)</label>
            <select className="rx-select">{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select>
          </div>
        </div>
        <div className="rx-field"><label>Location</label><input className="rx-input" placeholder="Block / Area…" /></div>
        <div className="rx-field"><label>Description</label><textarea className="rx-textarea" placeholder="Detailed description…" /></div>
        <div className="rx-field">
          <label>Assign To</label>
          <select className="rx-select">{TEAM.map(m => <option key={m.name}>{m.name}</option>)}</select>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="rx-btn primary" onClick={onClose}>Submit Issue</button>
          <button className="rx-btn ghost"   onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 18 — FULL ISSUES TABLE PAGE
───────────────────────────────────────────── */
function IssuesPage({ issues, onSelect }) {
  const [q, setQ]         = useState("");
  const [sf, setSf]       = useState("all");
  const [cf, setCf]       = useState("all");
  const [sortBy, setSort] = useState("priority");

  const rows = [...issues]
    .filter(i => sf === "all" || i.status === sf)
    .filter(i => cf === "all" || i.category === cf)
    .filter(i => !q  || i.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sortBy === "priority" ? calcPriority(b) - calcPriority(a) :
      sortBy === "upvotes"  ? b.upvotes - a.upvotes :
      sortBy === "severity" ? b.severity - a.severity :
      new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div>
      <div className="rx-section-hdr">
        <div>
          <div className="rx-section-title">All Issues</div>
          <div className="rx-section-sub">{rows.length} issues</div>
        </div>
        <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
          <div className="rx-search" style={{ width:190, marginBottom:0 }}>
            <span style={{ color:"var(--text3)" }}>🔍</span>
            <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {[
            [sf, setSf, ["all",...["open","in-progress","resolved","escalated"]]],
            [cf, setCf, ["all",...CATS]],
          ].map(([val, fn, opts], ki) => (
            <select key={ki} className="rx-select" style={{ width:140 }} value={val} onChange={e => fn(e.target.value)}>
              {opts.map(o => <option key={o} value={o}>{o === "all" ? (ki === 0 ? "All Status" : "All Categories") : o.replace("-"," ")}</option>)}
            </select>
          ))}
          <select className="rx-select" style={{ width:140 }} value={sortBy} onChange={e => setSort(e.target.value)}>
            {[["priority","Priority"],["upvotes","Upvotes"],["severity","Severity"],["date","Date"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="rx-panel" style={{ padding:0, overflow:"hidden" }}>
        <table className="rx-table">
          <thead>
            <tr>
              {["ID","Title","Category","Severity","Status","Assignee","Upvotes","Created","Score"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(issue => (
              <tr key={issue.id} onClick={() => onSelect(issue)}>
                <td style={{ fontFamily:"'DM Mono',monospace", color:"var(--text3)", fontSize:11 }}>{issue.id}</td>
                <td style={{ maxWidth:220 }}>
                  <div style={{ fontWeight:500 }}>{issue.title}</div>
                  {issue.location && <div style={{ fontSize:10, color:"var(--text3)", marginTop:2 }}>{issue.location}</div>}
                </td>
                <td><span className="rx-tag">{issue.category}</span></td>
                <td><span className={`rx-pill sev${issue.severity}`}>Sev {issue.severity}</span></td>
                <td><span className={`rx-pill ${issue.status}`}>{issue.status.replace("-"," ")}</span></td>
                <td style={{ fontSize:12, color:"var(--text2)" }}>{issue.assignee || "–"}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", color:"var(--accent)", fontSize:12 }}>{issue.upvotes}▲</td>
                <td style={{ fontSize:11, color:"var(--text3)", fontFamily:"'DM Mono',monospace" }}>{timeAgo(issue.createdAt?.seconds || issue.createdAt)}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", fontWeight:700, color:"var(--indigo)", fontSize:12 }}>{calcPriority(issue).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 19 — ANALYTICS PAGE  (charts + breakdowns)
───────────────────────────────────────────── */
function AnalyticsPage({ issues }) {
  const sevData  = [1,2,3,4,5].map(s => issues.filter(i=>i.severity===s).length);
  const catData  = CATS.map(c => issues.filter(i=>i.category===c).length);
  const maxSev   = Math.max(...sevData) || 1;
  const maxCat   = Math.max(...catData) || 1;
  const colors   = ["var(--accent)","var(--indigo)","var(--pink)","var(--orange)","var(--warn)","var(--success)","#60a5fa","#a78bfa"];

  function BarSet({ data, labels, max, h=130 }) {
    return (
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:h }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%", justifyContent:"flex-end" }}>
            <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:colors[i] }}>{v}</span>
            <div style={{ width:"100%", height:`${(v/max)*85}%`, minHeight:4, borderRadius:"4px 4px 0 0", background:colors[i], opacity:.85, transition:"height .5s" }} />
            <span style={{ fontSize:9.5, color:"var(--text3)", textAlign:"center", whiteSpace:"nowrap", overflow:"hidden", maxWidth:"100%" }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="rx-section-hdr">
        <div>
          <div className="rx-section-title">Analytics</div>
          <div className="rx-section-sub">Comprehensive breakdown across all dimensions</div>
        </div>
      </div>
      <MetricsRow issues={issues} />
      <div className="rx-g2" style={{ marginTop:18 }}>
        <div className="rx-panel"><div className="rx-ptitle">⚠️ <span className="rx-ptitle-accent">By Severity</span></div><BarSet data={sevData} labels={["Sev 1","Sev 2","Sev 3","Sev 4","Sev 5"]} max={maxSev} /></div>
        <div className="rx-panel"><div className="rx-ptitle">🏷️ <span className="rx-ptitle-accent">By Category</span></div><BarSet data={catData} labels={CATS.map(c=>c.slice(0,5))} max={maxCat} /></div>
        <div className="rx-panel">
          <div className="rx-ptitle">📅 <span className="rx-ptitle-accent">Monthly Volume</span></div>
          <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet">
            {(() => {
              const d=[18,23,17,29,22,31,27,35,28,38,32,40], max=40;
              const pts=d.map((v,i)=>`${(i/(d.length-1))*300},${80-((v/max)*70)}`).join(" ");
              return <>
                <defs><linearGradient id="lga" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--indigo)" stopOpacity=".22"/><stop offset="100%" stopColor="var(--indigo)" stopOpacity="0"/></linearGradient></defs>
                <polyline fill="url(#lga)" stroke="none" points={`0,80 ${pts} 300,80`} />
                <polyline fill="none" stroke="var(--indigo)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} />
                {d.map((v,i)=><circle key={i} cx={(i/(d.length-1))*300} cy={80-((v/max)*70)} r="3" fill="var(--indigo)" />)}
              </>;
            })()}
          </svg>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m=><span key={m} style={{ fontSize:9, color:"var(--text3)", fontFamily:"'DM Mono',monospace" }}>{m}</span>)}
          </div>
        </div>
        <div className="rx-panel">
          <div className="rx-ptitle">⏱️ <span className="rx-ptitle-accent">Avg Resolution Days</span></div>
          {CATS.slice(0,6).map((cat, i) => {
            const d = [7,3,6,9,4,5][i];
            return (
              <div key={cat} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, fontSize:12 }}>
                  <span style={{ color:"var(--text2)" }}>{cat}</span>
                  <span style={{ color:colors[i], fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{d}d</span>
                </div>
                <div className="rx-bar"><div className="rx-bar-fill" style={{ width:`${(d/10)*100}%`, background:colors[i] }} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop:14 }}><StatusDonut issues={issues} /></div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 20 — TEAM PAGE  (per-member cards)
───────────────────────────────────────────── */
function TeamPage() {
  return (
    <div>
      <div className="rx-section-hdr">
        <div>
          <div className="rx-section-title">Committee Members</div>
          <div className="rx-section-sub">Workload, performance & task assignments</div>
        </div>
        <button className="rx-btn primary">+ Invite Member</button>
      </div>
      <div className="rx-g3" style={{ gap:14 }}>
        {TEAM.map(m => (
          <div key={m.name} className="rx-panel">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div className="rx-mav" style={{ width:46, height:46, fontSize:15, background:m.color }}>{m.name.slice(0,2)}</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>{m.name}</div>
                <div style={{ fontSize:11.5, color:"var(--text3)" }}>{m.role}</div>
              </div>
            </div>
            <div className="rx-g2" style={{ gap:8, marginBottom:12 }}>
              {[["Assigned",m.tasks,m.color],["Resolved",m.done,"var(--success)"]].map(([l,v,c]) => (
                <div key={l} style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"8px", textAlign:"center" }}>
                  <div style={{ fontSize:19, fontFamily:"'Syne',sans-serif", fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:"var(--text3)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:11 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)", marginBottom:4 }}>
                <span>Completion</span><span>{Math.round(m.done/m.tasks*100)}%</span>
              </div>
              <div className="rx-bar"><div className="rx-bar-fill" style={{ width:`${m.done/m.tasks*100}%`, background:m.color }} /></div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button className="rx-btn ghost" style={{ flex:1, fontSize:11, padding:"5px 0" }}>Tasks</button>
              <button className="rx-btn ghost" style={{ flex:1, fontSize:11, padding:"5px 0" }}>Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 21 — AI INSIGHTS PAGE  (full-page deep dive)
───────────────────────────────────────────── */
function AIInsightsPage({ issues }) {
  const topCat   = CATS.map(c=>({c,n:issues.filter(i=>i.category===c).length})).sort((a,b)=>b.n-a.n)[0];
  const critical = issues.filter(i=>i.severity>=4).length;
  const resRate  = issues.length ? Math.round(issues.filter(i=>i.status==="resolved").length/issues.length*100) : 0;
  const insights = [
    { icon:"🔺", pri:"HIGH",   color:"var(--danger)",  title:"Escalation Needed",      text:`${critical} critical issues remain unresolved. Historical data shows 3x faster resolution with early escalation. Prioritize issues in ${topCat?.c} (highest density).` },
    { icon:"📊", pri:"MEDIUM", color:"var(--orange)",  title:"Category Hotspot",       text:`${topCat?.c} has peak complaint density (${topCat?.n} issues). Systemic root-cause review recommended over case-by-case handling.` },
    { icon:"✅", pri:"INFO",   color:"var(--success)", title:"Resolution Momentum",    text:`Resolution rate is ${resRate}% — up 14% vs last month. At current velocity, backlog clears in ~3 weeks. Celebrate the team's progress!` },
    { icon:"🔄", pri:"MEDIUM", color:"var(--indigo)",  title:"Recurring Patterns",     text:`3 issues show repeat filing patterns (Wifi, Water, Transport). Preventive maintenance proposals could reduce recurrence by ~40%.` },
    { icon:"📅", pri:"LOW",    color:"var(--warn)",    title:"Scheduling Opportunity", text:`Unresolved issues spike on Mondays and Thursdays. Consider scheduling committee reviews on these days for faster same-week turnaround.` },
    { icon:"👥", pri:"INFO",   color:"var(--accent)",  title:"Team Load Imbalance",    text:`Sneha T. carries 30% more tasks than average. Redistribute 2–3 items to Dev A. who has full resolution rate and capacity.` },
  ];
  return (
    <div>
      <div className="rx-section-hdr">
        <div>
          <div className="rx-section-title">AI Insights</div>
          <div className="rx-section-sub">Auto-generated recommendations based on live data</div>
        </div>
      </div>
      <div className="rx-g2">
        {insights.map((ins, i) => (
          <div key={i} className="rx-panel" style={{ borderColor:`${ins.color}22` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:22 }}>{ins.icon}</span>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 }}>{ins.title}</div>
                <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase", padding:"2px 6px", borderRadius:4, background:`${ins.color}22`, color:ins.color }}>{ins.pri}</span>
              </div>
            </div>
            <div style={{ fontSize:12.5, color:"var(--text2)", lineHeight:1.65 }}>{ins.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE 22 — SETTINGS PAGE  (toggles + profile)
───────────────────────────────────────────── */
function SettingsPage() {
  const [cfg, setCfg] = useState({ email:true, push:true, autoEsc:false, ai:true, dark:true });
  const toggle = k => setCfg(p => ({ ...p, [k]:!p[k] }));
  function Tog({ k }) {
    const on = cfg[k];
    return (
      <div className="rx-toggle" style={{ background:on?"var(--accent)":"rgba(255,255,255,.1)" }} onClick={() => toggle(k)}>
        <div className="rx-toggle-thumb" style={{ left:on?19:2 }} />
      </div>
    );
  }
  const sections = [
    { title:"Notifications", items:[
      { k:"email", label:"Email Notifications",  desc:"Critical alerts via email" },
      { k:"push",  label:"Push Notifications",   desc:"Browser notifications" },
    ]},
    { title:"Automation", items:[
      { k:"autoEsc", label:"Auto-Escalation", desc:"Escalate unresolved issues after 72h automatically" },
      { k:"ai",      label:"AI Insights",     desc:"Show AI-generated recommendations" },
    ]},
  ];
  return (
    <div style={{ maxWidth:680 }}>
      <div className="rx-section-hdr">
        <div>
          <div className="rx-section-title">Settings</div>
          <div className="rx-section-sub">Dashboard preferences and committee profile</div>
        </div>
      </div>
      {sections.map(sec => (
        <div key={sec.title} className="rx-panel" style={{ marginBottom:14 }}>
          <div className="rx-ptitle">⚙️ {sec.title}</div>
          {sec.items.map((item, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:i<sec.items.length-1?"1px solid var(--border)":"none" }}>
              <div>
                <div style={{ fontSize:13.5, fontWeight:500 }}>{item.label}</div>
                <div style={{ fontSize:11.5, color:"var(--text3)", marginTop:2 }}>{item.desc}</div>
              </div>
              <Tog k={item.k} />
            </div>
          ))}
        </div>
      ))}
      <div className="rx-panel">
        <div className="rx-ptitle">🎓 Committee Profile</div>
        <div className="rx-g2" style={{ gap:12 }}>
          {[["Committee Name","Student Welfare Committee"],["Institution","IIT Indore"],["Head Name","Arjun Sharma"],["Contact Email","committee@iiti.ac.in"]].map(([l,v]) => (
            <div key={l} className="rx-field" style={{ marginBottom:0 }}>
              <label>{l}</label>
              <input className="rx-input" defaultValue={v} />
            </div>
          ))}
        </div>
        <div style={{ marginTop:14 }}>
          <button className="rx-btn primary">Save Profile</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD PAGE  (main overview grid)
───────────────────────────────────────────── */
function DashboardPage({ issues, notifications, onSelect, onMarkAllRead }) {
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-.4px" }}>
          Committee Command Center ⚡
        </div>
        <div style={{ color:"var(--text2)", fontSize:12.5, marginTop:4 }}>
          Real-time campus issue oversight · {new Date().toLocaleDateString("en-IN",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </div>
      </div>

      <AlertBanner issues={issues} />
      <MetricsRow issues={issues} />

      <div className="rx-gdash">
        {/* ── LEFT ── */}
        <div className="rx-col">
          <PriorityEngine issues={issues} />
          <PerformanceScore issues={issues} />
          <TeamWorkload />
        </div>

        {/* ── CENTER ── */}
        <div className="rx-col">
          <IssueWorkspace issues={issues} onSelect={onSelect} />
          <ResolutionTrend />
          <CategoryChart issues={issues} />
          <HeatmapCalendar />
        </div>

        {/* ── RIGHT ── */}
        <div className="rx-col">
          <NotificationsPanel notifications={notifications} onMarkRead={onMarkAllRead} />
          <StudentSignals issues={issues} />
          <ActivityTimeline issues={issues} />
          <StatusDonut issues={issues} />
          <AIInsightsPanel issues={issues} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT — CommitteeDashboard
   (drop-in replacement for your original)
───────────────────────────────────────────── */
export default function CommitteeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [issues,        setIssues]        = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab,     setActiveTab]     = useState("Dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showNewIssue,  setShowNewIssue]  = useState(false);

  /* ── inject styles once ── */
  useEffect(() => {
    const id = "rx-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* ── Firebase listeners (unchanged from your original) ── */
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"), limit(50));
    const unsub      = onSnapshot(q, snap => setIssues(snap.docs.map(d => ({ id:d.id, ...d.data() }))));
    const unsubNotif = subscribeToNotifications(user.uid, setNotifications);
    return () => { unsub(); unsubNotif(); };
  }, [user]);

  const unread = notifications.filter(n => !n.read).length;

  async function handleLogout() { await logout(); navigate("/login"); }

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read:true })));
  }, []);

  /* ── page routing ── */
  const pages = {
    Dashboard:    <DashboardPage   issues={issues} notifications={notifications} onSelect={setSelectedIssue} onMarkAllRead={markAllRead} />,
    Issues:       <IssuesPage      issues={issues} onSelect={setSelectedIssue} />,
    Analytics:    <AnalyticsPage   issues={issues} />,
    "AI Insights":<AIInsightsPage  issues={issues} />,
    Team:         <TeamPage />,
    Settings:     <SettingsPage />,
  };

  return (
    <div className="rx-root">
      <Header
        user={user}
        unreadCount={unread}
        navigate={navigate}
        logout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewIssue={() => setShowNewIssue(true)}
      />

      <main className="rx-main">
        {pages[activeTab] || pages["Dashboard"]}
      </main>

      {/* ── Modals ── */}
      {selectedIssue && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
      {showNewIssue  && <NewIssueModal onClose={() => setShowNewIssue(false)} />}
    </div>
  );
}