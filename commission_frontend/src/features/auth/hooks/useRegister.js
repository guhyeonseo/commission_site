import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerApi } from "../api/authApi";

export const useRegister = () => {
  const navigate = useNavigate();

  const register = async (form) => {
    try {
      await registerApi(form);

      toast.success("회원가입 성공");

      navigate("/login");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.status);
      console.log(err.response?.data);

      toast.error(
        err.response?.data || "회원가입에 실패했습니다."
      );
    }
  };

  return { register };
};