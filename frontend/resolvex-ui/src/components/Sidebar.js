import { NavLink } from "react-router-dom";

function Sidebar() {

const linkClass =
"flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition";

return (

<div className="w-64 bg-indigo-700 text-white flex flex-col p-4">

<h1 className="text-2xl font-bold mb-6">ResolveX</h1>

<nav className="flex flex-col gap-2">

<NavLink to="/student" className={linkClass}>
Dashboard
</NavLink>

<NavLink to="/report" className={linkClass}>
Report Issue
</NavLink>

<NavLink to="/feed" className={linkClass}>
Campus Issues
</NavLink>

<NavLink to="/my-issues" className={linkClass}>
My Issues
</NavLink>

<NavLink to="/notifications" className={linkClass}>
Notifications
</NavLink>

<NavLink to="/leaderboard" className={linkClass}>
Leaderboard
</NavLink>

</nav>

</div>

);

}

export default Sidebar;