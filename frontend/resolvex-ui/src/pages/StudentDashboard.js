import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { subscribeToNotifications } from "../services/notificationService";

/* ─────────────────────────────────────────────────────────
   CONSTANTS & DUMMY DATA
───────────────────────────────────────────────────────── */

const DUMMY_ACADEMIC = {
  dept: "Computer Science Engineering",
  year: "3rd Year",
  semester: "6th Semester",
  credits: 142,
  totalCredits: 180,
  attendance: 78,
  feesStatus: "paid",
  feesAmount: "₹85,000",
  upcomingExams: [
    { subject: "Data Structures", date: "Apr 12", time: "10:00 AM", room: "Hall A" },
    { subject: "Computer Networks", date: "Apr 15", time: "02:00 PM", room: "Hall B" },
    { subject: "Operating Systems", date: "Apr 18", time: "10:00 AM", room: "Hall C" },
    { subject: "DBMS", date: "Apr 22", time: "10:00 AM", room: "Hall A" },
  ],
  results: { sgpa: 8.7, cgpa: 8.4, rank: 12, totalStudents: 120 },
  announcements: [
    { id: 1, title: "Mid-semester break from April 5–7", type: "holiday", time: "2h ago" },
    { id: 2, title: "Library extended hours during exams", type: "info", time: "5h ago" },
    { id: 3, title: "Sports day registration open till Mar 25", type: "event", time: "1d ago" },
    { id: 4, title: "Hostel maintenance work Sunday 10–2 PM", type: "maintenance", time: "2d ago" },
  ],
  calendar: [
    { date: "Apr 1", event: "Semester Exams Begin", type: "exam" },
    { date: "Apr 5", event: "Mid-Semester Break", type: "holiday" },
    { date: "Apr 20", event: "Last Date Fee Payment", type: "deadline" },
    { date: "May 1", event: "Result Declaration", type: "result" },
    { date: "May 10", event: "Summer Break Starts", type: "holiday" },
  ],
  subjects: [
    { name: "Data Structures", marks: 88, max: 100, grade: "A+" },
    { name: "Computer Networks", marks: 74, max: 100, grade: "B+" },
    { name: "Operating Systems", marks: 82, max: 100, grade: "A" },
    { name: "DBMS", marks: 91, max: 100, grade: "A+" },
    { name: "Software Engg.", marks: 79, max: 100, grade: "A" },
  ],
  resources: [
    { name: "Course Syllabus", icon: "doc" },
    { name: "Previous Papers", icon: "archive" },
    { name: "Study Material", icon: "book" },
    { name: "Timetable", icon: "calendar" },
  ],
};

const SEVERITY_CONFIG = {
  1: { label: "Low", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  2: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  3: { label: "High", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  4: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

const DUMMY_LEADERS = [
  { name: "Arjun Mehta", score: 245, issues: 18, avatar: "A" },
  { name: "Priya Sharma", score: 198, issues: 14, avatar: "P" },
  { name: "Rohan Das", score: 176, issues: 12, avatar: "R" },
  { name: "Sneha Patel", score: 154, issues: 11, avatar: "S" },
  { name: "Karan Joshi", score: 131, issues: 9, avatar: "K" },
];

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Issues", path: "/feed" },
  { label: "My Issues", path: "/my-issues" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Notifications", path: "/notifications" },
];

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #0f0f1a;
    --bg-card: #111120;
    --bg-card-hover: #16162a;
    --border: rgba(255,255,255,0.06);
    --border-bright: rgba(255,255,255,0.12);
    --text-primary: #f0f0ff;
    --text-secondary: #8888aa;
    --text-muted: #44445a;
    --accent-green: #00ff88;
    --accent-blue: #6366f1;
    --accent-purple: #a855f7;
    --accent-pink: #ec4899;
    --accent-orange: #f97316;
    --accent-yellow: #f59e0b;
    --accent-cyan: #06b6d4;
    --font-main: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius: 14px;
    --radius-sm: 8px;
  }

  body { background: var(--bg-primary); font-family: var(--font-main); color: var(--text-primary); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }
  @keyframes borderGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    50%       { box-shadow: 0 0 0 2px rgba(99,102,241,0.4); }
  }

  .fade-up { animation: fadeInUp 0.4s ease forwards; }
  .pulse-dot { animation: pulseDot 2s infinite; }

  .rx-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .rx-card:hover {
    border-color: var(--border-bright);
    background: var(--bg-card-hover);
  }

  .nav-item {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 7px;
    font-size: 13px; font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer; border: none;
    background: transparent;
    transition: all 0.15s;
    font-family: var(--font-main);
  }
  .nav-item:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
  .nav-item.active {
    color: var(--text-primary);
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
  }

  .progress-track {
    height: 5px; border-radius: 5px;
    background: rgba(255,255,255,0.06); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 5px;
    transition: width 0.8s cubic-bezier(.4,0,.2,1);
  }

  .rx-input {
    width: 100%; padding: 9px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-family: var(--font-main);
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
  }
  .rx-input:focus { border-color: var(--accent-blue); }
  .rx-input::placeholder { color: var(--text-muted); }
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

function timeAgo(seconds) {
  if (!seconds) return "";
  const diff = Math.floor(Date.now() / 1000 - seconds);
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────────────────── */

function Sparkline({ data = [], color = "#00ff88", height = 44, width = 130 }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePath = `M${pts[0]} ` + pts.slice(1).map(p => `L${p}`).join(" ");
  const areaPath = linePath + ` L${width},${height} L0,${height} Z`;
  const gradId = `sp${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   CIRCULAR PROGRESS
───────────────────────────────────────────────────────── */

function CircularProgress({ value, max = 100, color = "#6366f1", size = 78, label, sublabel }) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - Math.min(value / max, 1));
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color }}>{label}</span>
        {sublabel && <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────── */

function Header({ user, unreadCount, navigate, logout }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{
      background: "rgba(10,10,15,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1380, margin: "0 auto", padding: "0 28px",
        height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(99,102,241,0.45)",
          }}>
            <svg width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138A3.42 3.42 0 0020.95 9.58a3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138A3.42 3.42 0 003.05 14.02a3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
            ResolveX
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 2 }}>/ Student</span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_ITEMS.map((item, idx) => (
            <button key={item.label}
              className={`nav-item${idx === 0 ? " active" : ""}`}
              onClick={() => navigate(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("/report")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8, border: "none",
              background: "var(--accent-blue)", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-main)",
              boxShadow: "0 0 12px rgba(99,102,241,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#4f46e5"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--accent-blue)"}>
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Issue
          </button>

          <button onClick={() => navigate("/notifications")}
            style={{
              position: "relative", width: 36, height: 36, borderRadius: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0,
            }}>
            <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="pulse-dot" style={{
                position: "absolute", top: 6, right: 6,
                width: 7, height: 7, borderRadius: "50%",
                background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.9)",
              }} />
            )}
          </button>

          {/* User menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "4px 10px 4px 4px", borderRadius: 8,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                cursor: "pointer",
              }}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: "linear-gradient(135deg,#6366f1,#a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, color: "#fff",
                }}>
                  {user?.displayName?.[0]?.toUpperCase() || "S"}
                </div>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                {user?.displayName ? user.displayName.split(" ")[0] : "Student"}
              </span>
            </button>

            {showMenu && (
              <div className="fade-up" style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "var(--bg-card)", border: "1px solid var(--border-bright)",
                borderRadius: 12, padding: 8, minWidth: 170, zIndex: 200,
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              }}>
                <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user?.displayName}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</p>
                </div>
                {[
                  { label: "Profile", path: "/settings" },
                  { label: "My Issues", path: "/my-issues" },
                  { label: "Notifications", path: "/notifications" },
                ].map(item => (
                  <button key={item.label}
                    onClick={() => { navigate(item.path); setShowMenu(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "7px 12px", borderRadius: 6, border: "none",
                      background: "transparent", color: "var(--text-secondary)",
                      fontSize: 13, cursor: "pointer", fontFamily: "var(--font-main)",
                      transition: "all 0.1s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                    {item.label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6 }}>
                  <button onClick={logout}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "7px 12px", borderRadius: 6, border: "none",
                      background: "transparent", color: "#ef4444",
                      fontSize: 13, cursor: "pointer", fontFamily: "var(--font-main)",
                    }}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, color = "#00ff88", sparkData = [], icon }) {
  return (
    <div className="rx-card" style={{ padding: "18px 20px 14px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -40, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: color, opacity: 0.04, filter: "blur(30px)",
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {label}
          </p>
          <p style={{
            fontSize: 32, fontWeight: 700, color,
            fontFamily: "var(--font-mono)", lineHeight: 1.15, marginTop: 4,
          }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: 11, color: sub.startsWith("+") ? "#00ff88" : sub.startsWith("↓") ? "#ef4444" : "var(--text-muted)", marginTop: 4 }}>
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${color}18`, border: `1px solid ${color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      {sparkData.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <Sparkline data={sparkData} color={color} height={40} width={120} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROFILE CARD
───────────────────────────────────────────────────────── */

function ProfileCard({ user }) {
  return (
    <div className="rx-card" style={{
      padding: 20,
      background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.1) 100%)",
      borderColor: "rgba(99,102,241,0.25)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: "rgba(99,102,241,0.15)", filter: "blur(40px)",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" style={{
            width: 54, height: 54, borderRadius: 12,
            border: "2px solid rgba(99,102,241,0.4)", objectFit: "cover",
          }} />
        ) : (
          <div style={{
            width: 54, height: 54, borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}>
            {user?.displayName?.[0]?.toUpperCase() || "S"}
          </div>
        )}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{user?.displayName || "Student"}</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{user?.email}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              background: "rgba(0,255,136,0.15)", color: "#00ff88",
              border: "1px solid rgba(0,255,136,0.25)",
            }}>● Active</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
              background: "rgba(99,102,241,0.15)", color: "var(--accent-blue)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}>Student</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Department", value: DUMMY_ACADEMIC.dept },
          { label: "Year / Semester", value: `${DUMMY_ACADEMIC.year} · ${DUMMY_ACADEMIC.semester}` },
        ].map(item => (
          <div key={item.label} style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 10px",
            border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{item.label}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ACADEMIC CARD
───────────────────────────────────────────────────────── */

function AcademicCard() {
  const { credits, totalCredits, results, subjects } = DUMMY_ACADEMIC;
  const credPct = Math.round((credits / totalCredits) * 100);
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Academic Overview
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "CGPA", value: results.cgpa, color: "#6366f1" },
          { label: "SGPA", value: results.sgpa, color: "#00ff88" },
          { label: `#${results.rank} Rank`, value: `/${results.totalStudents}`, color: "#f59e0b" },
        ].map(item => (
          <div key={item.label} style={{
            background: `${item.color}0f`, border: `1px solid ${item.color}22`,
            borderRadius: 10, padding: "10px 8px", textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</p>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Credits progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Credits Completed</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)" }}>
            {credits}/{totalCredits}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${credPct}%`, background: "linear-gradient(90deg,#6366f1,#a855f7)" }} />
        </div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{credPct}% complete</p>
      </div>

      {/* Subject marks */}
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Subject Scores</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {subjects.map(s => {
          const pct = (s.marks / s.max) * 100;
          const c = pct >= 85 ? "#00ff88" : pct >= 70 ? "#6366f1" : "#f59e0b";
          return (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: c }}>{s.marks} · {s.grade}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: c }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ATTENDANCE + FEES (row)
───────────────────────────────────────────────────────── */

function AttendanceCard() {
  const att = DUMMY_ACADEMIC.attendance;
  const isLow = att < 75;
  const color = isLow ? "#ef4444" : "#00ff88";
  return (
    <div className="rx-card" style={{ padding: 18, borderColor: isLow ? "rgba(239,68,68,0.3)" : "var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Attendance
        </p>
        {isLow && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: "rgba(239,68,68,0.15)", color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)",
          }}>LOW</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CircularProgress value={att} max={100} color={color} size={72}
          label={`${att}%`} sublabel="attend" />
        <div>
          <p style={{ fontSize: 11, color: isLow ? "#ef4444" : "#00ff88", fontWeight: 600, lineHeight: 1.4 }}>
            {isLow ? "Below 75% — detention risk" : "Good standing"}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Min required: 75%</p>
        </div>
      </div>
    </div>
  );
}

function FeesCard() {
  const paid = DUMMY_ACADEMIC.feesStatus === "paid";
  return (
    <div className="rx-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Fees
        </p>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
          background: paid ? "rgba(0,255,136,0.12)" : "rgba(239,68,68,0.15)",
          color: paid ? "#00ff88" : "#ef4444",
          border: `1px solid ${paid ? "rgba(0,255,136,0.3)" : "rgba(239,68,68,0.3)"}`,
        }}>
          {paid ? "PAID" : "DUE"}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
        {DUMMY_ACADEMIC.feesAmount}
      </p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Semester 6 · 2025–26</p>
      {paid ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={10} height={10} fill="none" viewBox="0 0 24 24" stroke="#00ff88" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span style={{ fontSize: 12, color: "#00ff88", fontWeight: 600 }}>Payment confirmed</span>
        </div>
      ) : (
        <button style={{
          width: "100%", padding: "8px", borderRadius: 8, border: "none",
          background: "var(--accent-blue)", color: "#fff", fontWeight: 600, fontSize: 13,
          cursor: "pointer", fontFamily: "var(--font-main)",
        }}>
          Pay Now
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EXAMS CARD
───────────────────────────────────────────────────────── */

function ExamsCard() {
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Upcoming Exams
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DUMMY_ACADEMIC.upcomingExams.map((exam, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
            transition: "border-color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{exam.subject}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {exam.time} · {exam.room}
              </p>
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8,
              background: "rgba(99,102,241,0.15)", color: "var(--accent-blue)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}>
              {exam.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MY ISSUES PANEL
───────────────────────────────────────────────────────── */

function MyIssuesPanel({ issues, navigate }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? issues : issues.filter(i => i.status === filter);

  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          My Issues
        </p>
        <button onClick={() => navigate("/report")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 7, border: "none",
            background: "var(--accent-blue)", color: "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-main)",
          }}>
          + Report
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {["all", "pending", "resolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, fontFamily: "var(--font-main)",
              background: filter === f ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              color: filter === f ? "var(--accent-blue)" : "var(--text-muted)",
              border: filter === f ? "1px solid rgba(99,102,241,0.35)" : "1px solid var(--border)",
              transition: "all 0.15s",
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No issues found</p>
          <button onClick={() => navigate("/report")}
            style={{
              marginTop: 8, background: "none", border: "none",
              color: "var(--accent-blue)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-main)",
            }}>
            Report your first issue →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {filtered.slice(0, 5).map(issue => {
            const sev = SEVERITY_CONFIG[issue.severity] || {};
            return (
              <div key={issue.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {issue.title}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {issue.category} · {timeAgo(issue.createdAt?.seconds)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {sev.label && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                      background: sev.bg, color: sev.color,
                    }}>
                      {sev.label}
                    </span>
                  )}
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6,
                    background: issue.status === "resolved" ? "rgba(0,255,136,0.12)" : "rgba(249,115,22,0.12)",
                    color: issue.status === "resolved" ? "#00ff88" : "#f97316",
                  }}>
                    {issue.status === "resolved" ? "Done" : "Open"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={() => navigate("/my-issues")}
        style={{
          marginTop: 12, width: "100%", background: "none", border: "none",
          color: "var(--accent-blue)", fontSize: 12, cursor: "pointer",
          fontFamily: "var(--font-main)", fontWeight: 600,
        }}>
        View all issues →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CAMPUS FEED PANEL
───────────────────────────────────────────────────────── */

function CampusFeedPanel({ issues, navigate }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = issues.filter(i => {
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Issue Workspace
        </p>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{issues.length} total</span>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={2}
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>
        <input className="rx-input" placeholder="Search issues..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 32 }} />
      </div>

      {/* Status filter chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {["all", "open", "in progress", "resolved", "escalated"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600, fontFamily: "var(--font-main)",
              background: statusFilter === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              color: statusFilter === s ? "var(--accent-blue)" : "var(--text-muted)",
              border: statusFilter === s ? "1px solid rgba(99,102,241,0.35)" : "1px solid var(--border)",
              transition: "all 0.15s",
            }}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>No issues found</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.slice(0, 6).map(issue => (
            <div key={issue.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {issue.title}
                </p>
                <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                  {issue.id?.slice(0, 12)} · {issue.category} · {timeAgo(issue.createdAt?.seconds)}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{issue.upvotes || 0} ▲</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                  background: issue.status === "resolved" ? "rgba(0,255,136,0.12)" : issue.status === "escalated" ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.12)",
                  color: issue.status === "resolved" ? "#00ff88" : issue.status === "escalated" ? "#ef4444" : "#f97316",
                }}>
                  {issue.status || "open"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate("/feed")}
        style={{
          marginTop: 12, width: "100%", background: "none", border: "none",
          color: "var(--accent-blue)", fontSize: 12, cursor: "pointer",
          fontFamily: "var(--font-main)", fontWeight: 600,
        }}>
        View full feed →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATS / IMPACT PANEL
───────────────────────────────────────────────────────── */

function StatsPanel({ myIssues, allIssues }) {
  const resolved = myIssues.filter(i => i.status === "resolved").length;
  const pending = myIssues.filter(i => i.status !== "resolved").length;
  const totalUpvotes = myIssues.reduce((s, i) => s + (i.upvotes || 0), 0);
  const cats = {};
  allIssues.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Reported", value: myIssues.length, color: "#6366f1" },
    { label: "Resolved", value: resolved, color: "#00ff88" },
    { label: "Pending", value: pending, color: "#f97316" },
    { label: "Upvotes", value: totalUpvotes, color: "#a855f7" },
  ];

  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Your Impact
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            padding: "12px 10px", borderRadius: 10, textAlign: "center",
            background: `${s.color}0f`, border: `1px solid ${s.color}22`,
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</p>
          </div>
        ))}
      </div>
      {topCat && (
        <div style={{
          padding: "10px 12px", borderRadius: 10,
          background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Top campus issue category</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
            {topCat[0]} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({topCat[1]} issues)</span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NOTIFICATIONS PANEL
───────────────────────────────────────────────────────── */

function NotificationsPanel({ notifications, navigate }) {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Notifications
        </p>
        {unread > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: "rgba(239,68,68,0.15)", color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)",
          }}>
            {unread} new
          </span>
        )}
      </div>
      {notifications.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>No notifications yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {notifications.slice(0, 5).map(n => (
            <div key={n.id} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: !n.read ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${!n.read ? "rgba(99,102,241,0.2)" : "var(--border)"}`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                background: !n.read ? "var(--accent-blue)" : "var(--text-muted)",
                boxShadow: !n.read ? "0 0 6px rgba(99,102,241,0.7)" : "none",
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.4 }}>{n.message}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{timeAgo(n.createdAt?.seconds)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate("/notifications")}
        style={{
          marginTop: 12, width: "100%", background: "none", border: "none",
          color: "var(--accent-blue)", fontSize: 12, cursor: "pointer",
          fontFamily: "var(--font-main)", fontWeight: 600,
        }}>
        View all notifications →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANNOUNCEMENTS PANEL
───────────────────────────────────────────────────────── */

function AnnouncementsPanel() {
  const typeStyle = {
    holiday: { bg: "rgba(0,255,136,0.12)", color: "#00ff88" },
    info: { bg: "rgba(99,102,241,0.12)", color: "#6366f1" },
    event: { bg: "rgba(168,85,247,0.12)", color: "#a855f7" },
    maintenance: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  };
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Announcements
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {DUMMY_ACADEMIC.announcements.map(a => {
          const s = typeStyle[a.type] || { bg: "rgba(255,255,255,0.06)", color: "var(--text-muted)" };
          return (
            <div key={a.id} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-bright)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                background: s.bg, color: s.color, flexShrink: 0, textTransform: "capitalize",
              }}>
                {a.type}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.4 }}>{a.title}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CALENDAR CARD
───────────────────────────────────────────────────────── */

function CalendarCard() {
  const typeColor = {
    exam: "#ef4444",
    holiday: "#00ff88",
    deadline: "#f59e0b",
    result: "#6366f1",
  };
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
        Academic Calendar
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DUMMY_ACADEMIC.calendar.map((item, i) => {
          const c = typeColor[item.type] || "var(--accent-blue)";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                padding: "3px 8px", borderRadius: 6, flexShrink: 0,
                background: `${c}15`, color: c,
                border: `1px solid ${c}30`,
              }}>
                {item.date}
              </span>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 1, height: 16, background: "var(--border)" }} />
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.event}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LEADERBOARD PANEL
───────────────────────────────────────────────────────── */

function LeaderboardPanel({ navigate }) {
  const medalColors = ["#f59e0b", "#8888aa", "#f97316"];
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Leaderboard
        </p>
        <span style={{ fontSize: 11, color: "var(--accent-yellow)", fontWeight: 600 }}>This Month</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {DUMMY_LEADERS.map((leader, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10,
            background: i === 0 ? "rgba(245,158,11,0.07)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === 0 ? "rgba(245,158,11,0.2)" : "var(--border)"}`,
            transition: "border-color 0.15s",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 800,
              width: 22, textAlign: "center", flexShrink: 0,
              color: medalColors[i] || "var(--text-muted)",
            }}>
              #{i + 1}
            </span>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg,${["#6366f1","#00ff88","#f97316","#a855f7","#06b6d4"][i]},#0a0a0f)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>
              {leader.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{leader.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{leader.issues} issues reported</p>
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
              color: medalColors[i] || "var(--text-secondary)",
            }}>
              {leader.score}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/leaderboard")}
        style={{
          marginTop: 12, width: "100%", background: "none", border: "none",
          color: "var(--accent-blue)", fontSize: 12, cursor: "pointer",
          fontFamily: "var(--font-main)", fontWeight: 600,
        }}>
        View full leaderboard →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   RESOURCES CARD
───────────────────────────────────────────────────────── */

function ResourcesCard() {
  const icons = {
    doc: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    archive: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>,
    book: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    calendar: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  };
  return (
    <div className="rx-card" style={{ padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
        Academic Resources
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {DUMMY_ACADEMIC.resources.map((r, i) => (
          <button key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)", cursor: "pointer",
            color: "var(--text-secondary)", fontFamily: "var(--font-main)",
            fontSize: 12, fontWeight: 500, textAlign: "left", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.color = "var(--accent-blue)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
            {icons[r.icon]}
            <span>{r.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   QUICK ACTIONS BAR
───────────────────────────────────────────────────────── */

function QuickActionsBar({ navigate }) {
  const actions = [
    { label: "Report Issue", color: "var(--accent-blue)", glow: "rgba(99,102,241,0.35)", path: "/report" },
    { label: "Issue Feed", color: "transparent", path: "/feed", ghost: true },
    { label: "My Issues", color: "transparent", path: "/my-issues", ghost: true },
    { label: "Leaderboard", color: "transparent", path: "/leaderboard", ghost: true },
    { label: "Notifications", color: "transparent", path: "/notifications", ghost: true },
  ];
  return (
    <div className="rx-card" style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginRight: 4 }}>Quick:</span>
        {actions.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 600,
              background: a.ghost ? "rgba(255,255,255,0.04)" : a.color,
              color: a.ghost ? "var(--text-secondary)" : "#fff",
              border: a.ghost ? "1px solid var(--border)" : "none",
              boxShadow: a.glow ? `0 0 10px ${a.glow}` : "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (a.ghost) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={e => { if (a.ghost) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────── */

function StudentDashboard() {
  const auth = useAuth() || {};
const user = auth.user || null;
const logout = auth.logout || (() => {});
  const navigate = useNavigate();

  const [myIssues, setMyIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const myQ = query(
      collection(db, "issues"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubMy = onSnapshot(myQ, snap => {
      setMyIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const allQ = query(
      collection(db, "issues"),
      orderBy("upvotes", "desc"),
      limit(20)
    );
    const unsubAll = onSnapshot(allQ, snap => {
      setAllIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const unsubNotif = user?.uid
  ? subscribeToNotifications(user.uid, setNotifications)
  : () => {};

    return () => { unsubMy(); unsubAll(); unsubNotif(); };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const resolvedCount = myIssues.filter(i => i.status === "resolved").length;
  const resolutionRate = myIssues.length > 0
    ? Math.round((resolvedCount / myIssues.length) * 100)
    : 0;

  async function handleLogout() {
  if (logout) await logout();
  navigate("/");
}

  const sparkIssues = [2, 3, 1, 4, 3, 5, myIssues.length || 4];
  const sparkResolved = [1, 2, 1, 3, 2, 4, resolvedCount || 3];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <GlobalStyles />
      <Header
        user={user}
        unreadCount={unreadCount}
        navigate={navigate}
        logout={handleLogout}
      />

      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "28px 28px 48px" }}>

        {/* Welcome */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                {getGreeting()}, {user?.displayName?.split(" ")[0]} ⚡
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                Real-time campus overview · {getTodayString()}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px rgba(0,255,136,0.8)" }} />
              <span style={{ fontSize: 12, color: "#00ff88", fontWeight: 600 }}>Live</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fade-up" style={{ marginBottom: 22 }}>
          <QuickActionsBar navigate={navigate} />
        </div>

        {/* Top stat cards — like committee dashboard */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
          <StatCard
            label="Total Issues"
            value={myIssues.length}
            sub={`+${myIssues.length > 0 ? 1 : 0} this week`}
            color="#00ff88"
            sparkData={sparkIssues}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            label="Resolution Rate"
            value={`${resolutionRate}%`}
            sub={resolutionRate >= 50 ? "+ good progress" : "↓ needs attention"}
            color="#6366f1"
            sparkData={sparkResolved}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          />
          <StatCard
            label="CGPA"
            value={DUMMY_ACADEMIC.results.cgpa}
            sub={`Rank #${DUMMY_ACADEMIC.results.rank} / ${DUMMY_ACADEMIC.results.totalStudents}`}
            color="#a855f7"
            sparkData={[8.1, 8.2, 8.3, 8.2, 8.4, 8.5, 8.4]}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
          />
          <StatCard
            label="Attendance"
            value={`${DUMMY_ACADEMIC.attendance}%`}
            sub={DUMMY_ACADEMIC.attendance < 75 ? "↓ below minimum" : "+ above minimum"}
            color={DUMMY_ACADEMIC.attendance < 75 ? "#ef4444" : "#f59e0b"}
            sparkData={[80, 79, 78, 80, 77, 78, DUMMY_ACADEMIC.attendance]}
            icon={<svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* Main 3-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 340px", gap: 16 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ProfileCard user={user} />
            <AcademicCard />
            <ResourcesCard />
          </div>

          {/* MIDDLE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <AttendanceCard />
              <FeesCard />
            </div>
            <ExamsCard />
            <MyIssuesPanel issues={myIssues} navigate={navigate} />
            <CampusFeedPanel issues={allIssues} navigate={navigate} />
            <StatsPanel myIssues={myIssues} allIssues={allIssues} />
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <NotificationsPanel notifications={notifications} navigate={navigate} />
            <AnnouncementsPanel />
            <CalendarCard />
            <LeaderboardPanel navigate={navigate} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;