/*
======================================================================
ResolveX Role-Based Protected Route System
======================================================================

Purpose:

Protect application routes based on user roles.

Roles Supported:

1. student
2. committee
3. admin

Behavior:

If user is not authenticated
→ redirect to login

If user role does not match
→ redirect to dashboard

======================================================================
*/

import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/*
======================================================================
Protected Route Component
======================================================================
*/

const ProtectedRoute = ({ children, allowedRoles }) => {

  const { currentUser, role, loading } = useAuth();

  /*
  --------------------------------------------------------------
  Loading state
  --------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="text-center mt-10">
        Checking authentication...
      </div>
    );

  }

  /*
  --------------------------------------------------------------
  Not logged in
  --------------------------------------------------------------
  */

  if (!currentUser) {

    return <Navigate to="/login" />;

  }

  /*
  --------------------------------------------------------------
  Role validation
  --------------------------------------------------------------
  */

  if (allowedRoles && !allowedRoles.includes(role)) {

    return <Navigate to="/student-dashboard" />;

  }

  /*
  --------------------------------------------------------------
  Authorized
  --------------------------------------------------------------
  */

  return children;

};

export default ProtectedRoute;