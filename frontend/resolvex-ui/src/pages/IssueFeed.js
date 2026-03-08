import IssueCard from "../components/IssueCard";

function IssueFeed() {

  const issues = [
    {
      id: 1,
      location: "Hostel A",
      category: "Food",
      description: "Food quality is poor",
      status: "Pending"
    },
    {
      id: 2,
      location: "Library",
      category: "Facility",
      description: "AC not working",
      status: "In Progress"
    },
    {
      id: 3,
      location: "Washroom Block B",
      category: "Hygiene",
      description: "Needs cleaning",
      status: "Pending"
    }
  ];

  return (
    <div>

      <h2>Reported Issues</h2>

      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}

    </div>
  );
}

export default IssueFeed;