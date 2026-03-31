import LoginForm from "../features/auth/components/LoginForm";
import { useLogin } from "../features/auth/hooks/useLogin";

const LoginPage = () => {
  const { login } = useLogin();
  return <LoginForm onSubmit={login} />;
};

export default LoginPage;