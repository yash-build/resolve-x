import React from "react";

function ReportIssue() {
  return (
    <div>
      <h2>Report an Issue</h2>

      <form>
        <input type="text" placeholder="Location" />

        <select>
          <option>Food</option>
          <option>Hostel</option>
          <option>Hygiene</option>
          <option>Safety</option>
        </select>

        <textarea placeholder="Describe the issue"></textarea>

        <button type="submit">Submit Issue</button>
      </form>
    </div>
  );
}

export default ReportIssue;