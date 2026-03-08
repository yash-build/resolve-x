function IssueCard({ issue }) {

  return (

    <div style={{border:"1px solid gray", padding:"10px", margin:"10px"}}>

      <h3>{issue.location}</h3>

      <p><b>Category:</b> {issue.category}</p>

      <p>{issue.description}</p>

      <p><b>Status:</b> {issue.status}</p>

    </div>

  );

}

export default IssueCard;