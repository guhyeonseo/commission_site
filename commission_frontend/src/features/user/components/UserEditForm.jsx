import { useState } from "react";
import { updateUser } from "@/features/user/api/userApi";

export default function UserEditForm({ user, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nickname: user.nickname || "",
    bio: user.bio || "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || null);

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
      console.log("수정 실패", e);
      alert("수정 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>회원정보 수정</h2>

      {/* 프로필 이미지 */}
      {preview && (
        <img src={preview} alt="프로필" width={100} />
      )}

      <input type="file" onChange={handleFileChange} />

      {/* 닉네임 */}
      <input
        name="nickname"
        value={form.nickname}
        onChange={handleChange}
        placeholder="닉네임"
      />

      {/* 소개 */}
      <input
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="소개"
      />

      <button type="submit">저장</button>

      <button type="button" onClick={onCancel}>
        취소
      </button>
    </form>
  );
}