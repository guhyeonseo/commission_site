import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!auth || auth.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}