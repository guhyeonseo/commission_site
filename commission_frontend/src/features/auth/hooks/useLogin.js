// features/auth/hooks/useLogin.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { loginApi } from "../api/authApi";

export const useLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const token = await loginApi(form); // 토큰 받기

      login(token); // AuthContext에 저장

      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return { login: handleLogin };
};