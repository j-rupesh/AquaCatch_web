import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

function AdminRoute({ element }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loading />;

  return isAuthenticated && isAdmin ? element : <Navigate to="/" />;
}

export default AdminRoute;
