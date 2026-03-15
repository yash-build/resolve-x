import React, { useEffect, useState } from "react";

import { db } from "../services/firebase";

import {
collection,
onSnapshot
} from "firebase/firestore";

import IssueCard from "../components/IssueCard";

import {
sortIssuesByPriority
} from "../services/priorityEngine";

/*
==========================================================
RESOLVEX CAMPUS ISSUE FEED
==========================================================

Purpose
-------

Displays all campus issues reported by students.

Features
--------

• Smart issue prioritization
• Real-time updates
• Search functionality
• Category filtering
• Status filtering
• Sorting options
• Issue statistics

Architecture
------------

Firestore Issues
        ↓
Priority Engine
        ↓
Filtering / Sorting
        ↓
Issue Feed UI
*/

const IssueFeed = () => {

/*
==========================================================
STATE MANAGEMENT
==========================================================
*/

const [issues, setIssues] = useState([]);

const [filteredIssues, setFilteredIssues] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [searchTerm, setSearchTerm] = useState("");

const [categoryFilter, setCategoryFilter] = useState("all");

const [statusFilter, setStatusFilter] = useState("all");

const [sortMode, setSortMode] = useState("priority");

/*
==========================================================
FETCH ISSUES (REALTIME)
==========================================================
*/

useEffect(() => {

const unsubscribe = onSnapshot(

collection(db, "issues"),

(snapshot) => {

try {

const issuesData = snapshot.docs.map((doc) => ({

id: doc.id,
...doc.data()

}));

setIssues(issuesData);

setLoading(false);

} catch (err) {

console.error("Issue feed error:", err);

setError("Failed to load issues.");

}

}

);

return () => unsubscribe();

}, []);

/*
==========================================================
FILTER + SORT ISSUES
==========================================================
*/

useEffect(() => {

let result = [...issues];

/*
---------------------------------------
SEARCH FILTER
---------------------------------------
*/

if (searchTerm) {

result = result.filter((issue) =>

issue.title
?.toLowerCase()
.includes(searchTerm.toLowerCase()) ||

issue.description
?.toLowerCase()
.includes(searchTerm.toLowerCase())

);

}

/*
---------------------------------------
CATEGORY FILTER
---------------------------------------
*/

if (categoryFilter !== "all") {

result = result.filter(

(issue) => issue.category === categoryFilter

);

}

/*
---------------------------------------
STATUS FILTER
---------------------------------------
*/

if (statusFilter !== "all") {

result = result.filter(

(issue) => issue.status === statusFilter

);

}

/*
---------------------------------------
SORTING
---------------------------------------
*/

if (sortMode === "priority") {

result = sortIssuesByPriority(result);

}

if (sortMode === "newest") {

result.sort((a, b) =>

b.createdAt?.seconds - a.createdAt?.seconds

);

}

if (sortMode === "upvotes") {

result.sort((a, b) =>

(b.upvotes || 0) - (a.upvotes || 0)

);

}

setFilteredIssues(result);

}, [issues, searchTerm, categoryFilter, statusFilter, sortMode]);

/*
==========================================================
ISSUE STATISTICS
==========================================================
*/

const totalIssues = issues.length;

const pendingIssues = issues.filter(
(issue) => issue.status === "pending"
).length;

const resolvedIssues = issues.filter(
(issue) => issue.status === "resolved"
).length;

/*
==========================================================
LOADING STATE
==========================================================
*/

if (loading) {

return (

<div className="p-8">

<h1 className="text-xl font-bold">
Loading Issue Feed...
</h1>

</div>

);

}

/*
==========================================================
ERROR STATE
==========================================================
*/

if (error) {

return (

<div className="p-8">

<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">

{error}

</div>

</div>

);

}

/*
==========================================================
ISSUE FEED UI
==========================================================
*/

return (

<div className="p-8 space-y-8">

{/* PAGE HEADER */}

<div>

<h1 className="text-3xl font-bold">

Campus Issue Feed

</h1>

<p className="text-gray-600">

Issues are automatically ranked based on
priority, upvotes, severity, and age.

</p>

</div>

{/* =====================================================
ISSUE STATISTICS
===================================================== */}

<div className="grid grid-cols-3 gap-6">

<div className="bg-white shadow p-4 rounded">

<h3 className="font-semibold">
Total Issues
</h3>

<p className="text-2xl">
{totalIssues}
</p>

</div>

<div className="bg-white shadow p-4 rounded">

<h3 className="font-semibold">
Pending Issues
</h3>

<p className="text-2xl">
{pendingIssues}
</p>

</div>

<div className="bg-white shadow p-4 rounded">

<h3 className="font-semibold">
Resolved Issues
</h3>

<p className="text-2xl">
{resolvedIssues}
</p>

</div>

</div>

{/* =====================================================
SEARCH + FILTER PANEL
===================================================== */}

<div className="bg-white shadow p-6 rounded space-y-4">

<h2 className="text-xl font-semibold">

Search & Filter Issues

</h2>

{/* SEARCH */}

<input
type="text"
placeholder="Search issues..."
value={searchTerm}
onChange={(e) =>
setSearchTerm(e.target.value)
}
className="w-full border p-2 rounded"
/>

<div className="grid grid-cols-3 gap-4">

{/* CATEGORY FILTER */}

<select
value={categoryFilter}
onChange={(e) =>
setCategoryFilter(e.target.value)
}
className="border p-2 rounded"
>

<option value="all">
All Categories
</option>

<option value="Hostel">
Hostel
</option>

<option value="Food">
Food
</option>

<option value="Infrastructure">
Infrastructure
</option>

<option value="Hygiene">
Hygiene
</option>

<option value="Discipline">
Discipline
</option>

</select>

{/* STATUS FILTER */}

<select
value={statusFilter}
onChange={(e) =>
setStatusFilter(e.target.value)
}
className="border p-2 rounded"
>

<option value="all">
All Status
</option>

<option value="pending">
Pending
</option>

<option value="resolved">
Resolved
</option>

</select>

{/* SORT MODE */}

<select
value={sortMode}
onChange={(e) =>
setSortMode(e.target.value)
}
className="border p-2 rounded"
>

<option value="priority">
Sort by Priority
</option>

<option value="newest">
Newest Issues
</option>

<option value="upvotes">
Most Upvoted
</option>

</select>

</div>

</div>

{/* =====================================================
ISSUE LIST
===================================================== */}

<div className="space-y-4">

{filteredIssues.length === 0 ? (

<div className="bg-gray-100 p-6 rounded">

<p>No issues found.</p>

</div>

) : (

filteredIssues.map((issue) => (

<IssueCard
key={issue.id}
issue={issue}
/>

))

)}

</div>

{/* =====================================================
DEBUG PANEL
===================================================== */}

<div className="text-sm text-gray-500">

<p>Total Loaded Issues: {issues.length}</p>

<p>Filtered Issues: {filteredIssues.length}</p>

</div>

</div>

);

};

export default IssueFeed;