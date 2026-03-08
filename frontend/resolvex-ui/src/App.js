import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import IssueFeed from "./pages/IssueFeed";
import AdminPanel from "./pages/AdminPanel";

function App() {

  const [issues, setIssues] = useState([]);

  // Add new issue
  const addIssue = (newIssue) => {
    setIssues([...issues, newIssue]);
  };

  // Upvote issue
  const upvoteIssue = (id) => {

    const updatedIssues = issues.map((issue) => {

      if (issue.id === id) {
        return { ...issue, votes: issue.votes + 1 };
      }

      return issue;

    });

    setIssues(updatedIssues);

  };

  // Update status
  const updateStatus = (id, newStatus) => {

    const updatedIssues = issues.map((issue) => {

      if (issue.id === id) {
        return { ...issue, status: newStatus };
      }

      return issue;

    });

    setIssues(updatedIssues);

  };

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/report"
          element={<ReportIssue addIssue={addIssue} />}
        />

        <Route
          path="/issues"
          element={
            <IssueFeed
              issues={issues}
              upvoteIssue={upvoteIssue}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminPanel
              issues={issues}
              updateStatus={updateStatus}
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;