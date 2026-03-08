import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminPanel() {

  const { role } = useContext(AuthContext);

  if (role !== "admin") {

    return (
      <div style={{ padding: "20px" }}>
        <h2>Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );

  }

  return (

    <div style={{ padding: "20px" }}>

      <h2>Admin Dashboard</h2>

      <p>Welcome Admin 👋</p>

      <div style={{ marginTop: "20px" }}>

        <p>Here you will manage:</p>

        <ul>
          <li>Users</li>
          <li>Issues</li>
          <li>Committees</li>
          <li>Analytics</li>
        </ul>

      </div>

    </div>

  );

}

export default AdminPanel;