import { useState } from "react";
import IssueCard from "../components/IssueCard";

function IssueFeed({ issues, upvoteIssue }) {

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredIssues = issues
    .filter((issue) => {

      const matchesCategory =
        filter === "All" || issue.category === filter;

      const matchesSearch =
        issue.location.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;

    })
    .sort((a, b) => b.votes - a.votes);

  return (

    <div style={{padding:"20px"}}>

      <h2>Campus Issue Feed</h2>

      {/* Search Bar */}

      <input
        type="text"
        placeholder="Search issues..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{marginBottom:"10px", padding:"5px"}}
      />

      <br/><br/>

      {/* Filter */}

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >

        <option value="All">All</option>
        <option value="Food">Food</option>
        <option value="Hostel">Hostel</option>
        <option value="Hygiene">Hygiene</option>
        <option value="Safety">Safety</option>

      </select>

      <br/><br/>

      {filteredIssues.length === 0 && (
        <p>No issues found.</p>
      )}

      {filteredIssues.map((issue) => (

        <IssueCard
          key={issue.id}
          issue={issue}
          upvoteIssue={upvoteIssue}
        />

      ))}

    </div>

  );

}

export default IssueFeed;