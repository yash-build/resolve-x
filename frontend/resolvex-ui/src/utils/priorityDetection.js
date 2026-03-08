function getPriority(issue) {

  let score = 0;

  // Votes influence
  score += issue.votes * 2;

  // Status influence
  if (issue.status === "Pending") score += 5;
  if (issue.status === "In Progress") score += 3;

  // Category influence
  if (issue.category === "Safety") score += 10;
  if (issue.category === "Hygiene") score += 5;

  if (score > 20) return "High";
  if (score > 10) return "Medium";

  return "Low";
}

export default getPriority;
