/*
===========================================================================
ResolveX Main Application Controller
===========================================================================

This file is the central controller of the entire ResolveX frontend.

Responsibilities handled here:

1. Initialize React Router
2. Wrap the application with authentication provider
3. Control global layout (Sidebar + Content)
4. Handle role-based protected routes
5. Register all application pages
6. Provide default redirect logic
7. Handle unknown routes (404 fallback)
8. Inject global components like Chatbot
9. Maintain scalable routing architecture

===========================================================================

Architecture Notes

ResolveX currently supports the following modules:

Authentication System
Issue Reporting System
Committee Management System
Admin Analytics Dashboard
Authority Sensitive Issues System
Notification System
Leaderboard
Campus Assistant Chatbot

===========================================================================

*/

import React from "react";

/*
===========================================================================
React Router Imports
===========================================================================
*/

import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
useLocation
} from "react-router-dom";

/*
===========================================================================
Context Providers
===========================================================================
*/

import { AuthProvider } from "./context/AuthContext";

/*
===========================================================================
Shared Components
===========================================================================
*/

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/*
===========================================================================
Page Imports
===========================================================================
*/

import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";

import CommitteeDashboard from "./pages/CommitteeDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import AuthorityDashboard from "./pages/AuthorityDashboard";

import IssueFeed from "./pages/IssueFeed";

import ReportIssue from "./pages/ReportIssue";

import MyIssues from "./pages/MyIssues";

import Notifications from "./pages/Notifications";

import Leaderboard from "./pages/Leaderboard";

/*
===========================================================================
Chatbot Assistant
===========================================================================
*/

import Chatbot from "./components/Chatbot";

/*
===========================================================================
Application Layout Controller
===========================================================================

This component manages the global page layout.

Responsibilities:

• Show sidebar navigation
• Hide sidebar on login page
• Maintain responsive layout
• Render route content
• Allow chatbot to appear on every page

===========================================================================

*/

function ApplicationLayout() {

const location = useLocation();

/*
---------------------------------------------------------------------------
Determine if the sidebar should be hidden
---------------------------------------------------------------------------

Login page should not show sidebar navigation.

*/

const hideSidebar = location.pathname === "/login";

/*
---------------------------------------------------------------------------
Render layout
---------------------------------------------------------------------------
*/

return (

<div
className="flex flex-col md:flex-row min-h-screen bg-gray-100"
>

{/* Sidebar Navigation */}

{!hideSidebar && (

<div className="w-full md:w-64">

<Navbar />

</div>

)}

{/* Main Content Area */}

<div className="flex-1 p-4 md:p-8">

<Routes>

{/* ================================================================
PUBLIC ROUTES
================================================================ */}

<Route
path="/login"
element={<Login />}
/>

{/* ================================================================
STUDENT ROUTES
================================================================ */}

<Route
path="/student-dashboard"
element={
<ProtectedRoute allowedRoles={["student"]}>
<StudentDashboard />
</ProtectedRoute>
}
/>

<Route
path="/report"
element={
<ProtectedRoute allowedRoles={["student"]}>
<ReportIssue />
</ProtectedRoute>
}
/>

<Route
path="/my-issues"
element={
<ProtectedRoute allowedRoles={["student"]}>
<MyIssues />
</ProtectedRoute>
}
/>

{/* ================================================================
COMMITTEE ROUTES
================================================================ */}

<Route
path="/committee"
element={
<ProtectedRoute allowedRoles={["committee"]}>
<CommitteeDashboard />
</ProtectedRoute>
}
/>

{/* ================================================================
ADMIN ROUTES
================================================================ */}

<Route
path="/admin-dashboard"
element={
<ProtectedRoute allowedRoles={["admin"]}>
<AdminDashboard />
</ProtectedRoute>
}
/>

{/* ================================================================
AUTHORITY ROUTES
================================================================ */}

<Route
path="/authority"
element={
<ProtectedRoute allowedRoles={["admin","authority"]}>
<AuthorityDashboard />
</ProtectedRoute>
}
/>

{/* ================================================================
SHARED ROUTES
================================================================ */}

<Route
path="/feed"
element={
<ProtectedRoute allowedRoles={["student","committee","admin"]}>
<IssueFeed />
</ProtectedRoute>
}
/>

<Route
path="/notifications"
element={
<ProtectedRoute allowedRoles={["student","committee","admin"]}>
<Notifications />
</ProtectedRoute>
}
/>

<Route
path="/leaderboard"
element={
<ProtectedRoute allowedRoles={["student","committee","admin"]}>
<Leaderboard />
</ProtectedRoute>
}
/>

{/* ================================================================
DEFAULT ROUTE
================================================================

If a user visits "/", redirect them to the student dashboard.

Later this can become role-based redirect logic.

================================================================ */}

<Route
path="/"
element={<Navigate to="/student-dashboard" />}
/>

{/* ================================================================
404 FALLBACK ROUTE
================================================================

Handles invalid URLs.

Example:
/randompage
================================================================ */}

<Route
path="*"
element={

<div className="flex flex-col items-center justify-center mt-24">

<h1 className="text-5xl font-bold mb-4">
404
</h1>

<p className="text-gray-500 mb-6">
The page you are looking for does not exist.
</p>

<a
href="/student-dashboard"
className="bg-indigo-600 text-white px-6 py-2 rounded"
>

Return to Dashboard

</a>

</div>

}
/>

</Routes>

</div>

{/* Global Chatbot Assistant */}

<Chatbot />

</div>

);

}

/*
===========================================================================
Main Application Wrapper
===========================================================================

This component initializes the entire ResolveX application.

It wraps the system with:

• Firebase Authentication Context
• React Router
• Global Application Layout

===========================================================================

*/

function App() {

return (

<AuthProvider>

<Router>

<ApplicationLayout />

</Router>

</AuthProvider>

);

}

export default App;