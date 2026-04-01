// features/auth/components/RegisterForm.jsx
import { useState } from "react";
import "./Register.css";

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
    <form  className="registerForm" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="registerDiv">
        <input className="registerInput" name="username" placeholder="아이디" onChange={handleChange} />
      </div>
      <div className="registerDiv">
        <input className="registerInput" name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
      </div>
      <div className="registerDiv">
        <input className="registerInput" name="nickname" placeholder="닉네임" onChange={handleChange} />
      </div>
      <div className="registerDiv">
        <input className="registerInput" name="email" placeholder="이메일" onChange={handleChange} />
      </div>
      <div className="registerDiv">
        <button className="registerButton" >회원가입</button>
      </div>
    </form>
  );
};

export default RegisterForm;