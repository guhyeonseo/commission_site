import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../../context/AuthContext";
import { loginApi } from "../api/authApi";

export const useLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const token = await loginApi(form);

      login(token);

      toast.success("로그인되었습니다.");

      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);

      toast.error(
        err.response?.data || "아이디 또는 비밀번호가 올바르지 않습니다."
      );
    }
  };

  return { login: handleLogin };
};