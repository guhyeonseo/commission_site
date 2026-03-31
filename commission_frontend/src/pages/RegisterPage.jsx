import RegisterForm from "../features/auth/components/RegisterForm";
import { useRegister } from "../features/auth/hooks/useRegister";

const RegisterPage = () => {
  const { register } = useRegister();
  return <RegisterForm onSubmit={register} />;
};

export default RegisterPage;