import { useState } from "react";
import { updatePasswordApi } from "@/features/user/api/userApi";
import styles from "./PasswordChangeForm.module.css";

export default function PasswordChangeForm({
  onSuccess,
  onCancel,
}) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await updatePasswordApi(form);

      alert("비밀번호 변경 완료");
      onSuccess();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "비밀번호 변경 실패"
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title}>
        비밀번호 변경
      </h2>

      <div className={styles.inputGroup}>
        <label>현재 비밀번호</label>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>새 비밀번호</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>새 비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.saveBtn}
        >
          변경
        </button>

        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}