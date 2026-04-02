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
      const res = await loginApi(form);

      const token = res.data?.token;

      if (!token) {
        throw new Error("토큰 없음");
      }

      login(token);           // context + localStorage 저장
      navigate("/");          // 홈 이동
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return { login: handleLogin };
};