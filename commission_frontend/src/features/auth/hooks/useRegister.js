import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";

export const useRegister = () => {
  const navigate = useNavigate();

  const register = async (form) => {
    await registerApi(form);
    alert("회원가입 성공");
    navigate("/login");
  };

  return { register };
};