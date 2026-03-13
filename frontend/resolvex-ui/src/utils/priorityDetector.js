/*
ResolveX Priority Detection

Automatically assigns priority based on keywords
*/

export function detectPriority(title, description) {

  const text = (title + " " + description).toLowerCase();

  if (
    text.includes("gas leak") ||
    text.includes("fire") ||
    text.includes("electric shock") ||
    text.includes("short circuit")
  ) {
    return "critical";
  }

  if (
    text.includes("water leak") ||
    text.includes("ceiling collapse") ||
    text.includes("broken wire")
  ) {
    return "high";
  }

  if (
    text.includes("dirty") ||
    text.includes("hygiene") ||
    text.includes("washroom")
  ) {
    return "medium";
  }

  return "low";

}