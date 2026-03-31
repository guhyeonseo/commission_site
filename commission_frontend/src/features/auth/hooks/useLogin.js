// features/auth/hooks/useLogin.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { loginApi } from "../api/authApi";

export const useLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    const res = await loginApi(form);

    login(res.data);     // 상태 저장
    navigate("/");       // 홈 이동
  };

  return { login: handleLogin };
};