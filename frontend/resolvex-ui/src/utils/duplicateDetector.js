/*
Duplicate Issue Detector
Simple text similarity matching
*/

export function findSimilarIssues(newTitle, issues) {

  const cleanedTitle = newTitle.toLowerCase();

  return issues.filter((issue) => {

    const existingTitle = issue.title.toLowerCase();

    return (
      existingTitle.includes(cleanedTitle) ||
      cleanedTitle.includes(existingTitle)
    );

  });

}