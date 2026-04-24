import { useState } from "react";
import { updatePasswordApi } from "@/features/user/api/userApi";

export default function PasswordChangeForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await updatePasswordApi(form);
      alert("비밀번호 변경 완료");
      onSuccess();
    } catch (e) {
      alert(e.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>

      <input name="currentPassword" type="password" placeholder="현재 비밀번호" onChange={handleChange} />
      <input name="newPassword" type="password" placeholder="새 비밀번호" onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="확인" onChange={handleChange} />

      <button onClick={handleSubmit}>변경</button>
      <button onClick={onCancel}>취소</button>
    </div>
  );
}