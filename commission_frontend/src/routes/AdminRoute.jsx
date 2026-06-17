import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {

  const { auth } = useAuth();

  if (auth.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}