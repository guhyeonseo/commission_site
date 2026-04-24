import RegisterForm from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";

const RegisterPage = () => {
  const { register } = useRegister();
  return <RegisterForm onSubmit={register} />;
};

export default RegisterPage;