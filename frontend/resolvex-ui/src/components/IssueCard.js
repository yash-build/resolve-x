function IssueCard({ issue, upvoteIssue }) {

  const getPriority = () => {

    let score = 0;

    score += issue.votes * 2;

    if (issue.status === "Pending") score += 5;
    if (issue.status === "In Progress") score += 3;

    if (issue.category === "Safety") score += 10;
    if (issue.category === "Hygiene") score += 5;

    if (score > 20) return "High";
    if (score > 10) return "Medium";

    return "Low";
  };

  const priority = getPriority();

  const getStatusColor = () => {
    if (issue.status === "Pending") return "#f39c12";
    if (issue.status === "In Progress") return "#3498db";
    if (issue.status === "Resolved") return "#2ecc71";
    return "#777";
  };

  return (

    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        margin: "15px",
        background: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
      }}
    >

      {/* Location */}
      <h3>📍 {issue.location}</h3>

      {/* Category */}
      <span
        style={{
          background:"#eee",
          padding:"4px 10px",
          borderRadius:"6px",
          fontSize:"12px"
        }}
      >
        {issue.category}
      </span>

      {/* Description */}
      <p style={{marginTop:"10px"}}>
        {issue.description}
      </p>

      {/* Image */}
      {issue.image && (
        <img
          src={issue.image}
          alt="issue"
          style={{
            width:"100%",
            borderRadius:"8px",
            marginTop:"10px"
          }}
        />
      )}

      {/* Status */}
      <p style={{marginTop:"10px"}}>
        Status:
        <span
          style={{
            background:getStatusColor(),
            color:"white",
            padding:"4px 8px",
            borderRadius:"6px",
            marginLeft:"8px",
            fontSize:"12px"
          }}
        >
          {issue.status}
        </span>
      </p>

      {/* Priority */}
      <p>
        ⚡ Priority: <b>{priority}</b>
      </p>

      {/* Votes */}
      <button
        onClick={() => upvoteIssue(issue.id)}
        style={{
          background:"#007bff",
          color:"white",
          border:"none",
          padding:"6px 12px",
          borderRadius:"6px",
          cursor:"pointer"
        }}
      >
        👍 {issue.votes}
      </button>

    </div>

  );

}

export default IssueCard;