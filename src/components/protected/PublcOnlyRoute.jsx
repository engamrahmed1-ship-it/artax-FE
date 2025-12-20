import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/" replace /> : children;
}
