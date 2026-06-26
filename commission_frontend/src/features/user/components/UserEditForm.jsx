import { useState } from "react";
import { updateUser } from "@/features/user/api/userApi";
import styles from "./UserEditForm.module.css";

export default function UserEditForm({ user, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nickname: user.nickname || "",
    bio: user.bio || "",
  });

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(
    user.profileImage
      ? `http://localhost:8484${user.profileImage}`
      : null
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(form)], {
          type: "application/json",
        })
      );

      if (file) {
        formData.append("file", file);
      }

      await updateUser(formData);

      alert("수정 완료");
      onSuccess();
    } catch (e) {
      console.error("수정 실패", e);
      alert("수정 실패");
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title}>
        회원정보 수정
      </h2>

      <div className={styles.profileSection}>
        {preview ? (
          <img
            src={preview}
            alt="프로필"
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.profilePlaceholder}>
            이미지 없음
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>소개</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.saveBtn}
        >
          저장
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