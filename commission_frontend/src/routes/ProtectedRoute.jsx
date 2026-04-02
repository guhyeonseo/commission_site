import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { auth } = useContext(AuthContext);

  // 로그인 안 됨
  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  // 권한 다름
  if (role && auth.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;