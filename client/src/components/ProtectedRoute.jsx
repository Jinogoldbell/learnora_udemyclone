import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, instructorOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-loading">Getting things ready…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (instructorOnly && user.role !== "instructor") return <Navigate to="/dashboard" replace />;
  return children;
}
