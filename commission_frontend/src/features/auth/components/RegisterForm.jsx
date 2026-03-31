// features/auth/components/RegisterForm.jsx
import { useState } from "react";

const RegisterForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    username: "",
    nickname: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <input name="username" onChange={handleChange} />
      <input name="nickname" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <input name="email" onChange={handleChange} />
      <button>회원가입</button>
    </form>
  );
};

export default RegisterForm;