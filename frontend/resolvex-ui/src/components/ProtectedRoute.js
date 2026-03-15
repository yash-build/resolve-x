import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

const { currentUser, role, loading } = useAuth();

/* Loading state */

if (loading) {
return ( <div className="text-center mt-10">
Checking authentication... </div>
);
}

/* Not logged in */

if (!currentUser) {
return <Navigate to="/login" />;
}

/* Role validation */

if (allowedRoles && !allowedRoles.includes(role)) {
return <Navigate to="/student-dashboard" />;
}

/* Authorized */

return <Outlet />;

};

export default ProtectedRoute;
