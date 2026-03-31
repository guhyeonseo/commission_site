// features/auth/components/LoginForm.jsx
import { useState } from "react";
import "./Login.css";

const LoginForm = ({ onSubmit }) => {
    const [form, setForm] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <form className="loginForm" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
            <div className="loginDiv">
                <input className="loginInput" name="username" placeholder="아이디" onChange={handleChange} />
            </div>
            <div className="loginDiv">
                <input className="loginInput" name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
            </div>
            <button className="loginButton">로그인</button>
        </form>
    );
};

export default LoginForm;