import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const roles = [
    { name: "Student", path: "/student", color: "#6366f1" },
    { name: "Committee", path: "/committee", color: "#00ff88" },
    { name: "Admin", path: "/admin", color: "#f59e0b" },
    { name: "Authority", path: "/authority", color: "#ef4444" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>ResolveX 🚀</h1>
      <p style={{ color: "#888", marginBottom: 40 }}>
        Campus Governance Operating System
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 200px)",
        gap: 20
      }}>
        {roles.map(role => (
          <div
            key={role.name}
            onClick={() => navigate(role.path)}
            style={{
              padding: 30,
              borderRadius: 12,
              background: "#111",
              border: `1px solid ${role.color}`,
              cursor: "pointer",
              textAlign: "center",
              transition: "0.2s"
            }}
          >
            <h2 style={{ color: role.color }}>{role.name}</h2>
            <p style={{ fontSize: 12, color: "#aaa" }}>
              Open Dashboard
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}