import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const { login } = useLogin();
  return <LoginForm onSubmit={login} />;
};

export default LoginPage;