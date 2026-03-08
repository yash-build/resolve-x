function AdminPanel({ issues, updateStatus }) {

  return (

    <div>

      <h2>Admin Panel</h2>

      {issues.length === 0 && (
        <p>No issues available.</p>
      )}

      {issues.map((issue) => (

        <div
          key={issue.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
          }}
        >

          <h3>{issue.location}</h3>

          <p>{issue.description}</p>

          <p>Status: {issue.status}</p>

          <button onClick={() => updateStatus(issue.id, "Pending")}>
            Pending
          </button>

          <button onClick={() => updateStatus(issue.id, "In Progress")}>
            In Progress
          </button>

          <button onClick={() => updateStatus(issue.id, "Resolved")}>
            Resolved
          </button>

        </div>

      ))}

    </div>

  );

}

export default AdminPanel;