import { useState } from "react";
import { createCommission } from "../api/commissionApi.js";
import { useNavigate } from "react-router-dom";
import "./CommissionCreatePage.css";
import useTiptapEditor from "@/hooks/useTiptapEditor.js";
import useThumbnailUpload from "../hooks/useThumbnailUpload";
import { EditorContent } from "@tiptap/react";
import { uploadCommissionImage } from "../api/commissionApi";

import ThumbnailUploader from "../components/ThumbnailUploader";
import EditorToolbar from "@/components/editor/EditorToolbar";

export default function CommissionCreatePage() {

  const navigate = useNavigate();

  const {
    editor,
    content,
    fontSize,
    setFontSize,
    handleEditorImage,
  } = useTiptapEditor(uploadCommissionImage);

  const {
    files,
    thumbnailIndex,
    setThumbnailIndex,
    handleFileChange,
    handleDelete,
  } = useThumbnailUpload();

  const [form, setForm] = useState({
    title: "",
    price: "",
    estimatedDays: "",
    category: "",
  });

  const categories = [
    { label: "만화", value: "COMIC" },
    { label: "영상", value: "VIDEO" },
    { label: "일러스트", value: "ILLUST" },
    { label: "캐릭터", value: "CHARACTER" },
    { label: "이모티콘", value: "EMOTE" },
    { label: "디자인", value: "DESIGN" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 제출
  const submit = async () => {
    if (!form.category || files.length === 0) {
      alert("카테고리와 대표 이미지를 확인해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", content);
    formData.append("price", Number(form.price));
    formData.append("estimatedDays", Number(form.estimatedDays));
    formData.append("category", form.category);
    formData.append("thumbnailIndex", thumbnailIndex);

    files.forEach((item) => formData.append("files", item.file));

    try {
      await createCommission(formData);
      navigate("/");
    } catch (err) {
      alert("등록 실패");
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">커미션 등록</h2>

      <div className="create-form">

        <label>카테고리</label>
        <select className="input-category" name="category" onChange={handleChange}>
          <option value="">선택</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label>제목</label>
        <input className="input-title" name="title" onChange={handleChange} />

        <ThumbnailUploader
          files={files}
          thumbnailIndex={thumbnailIndex}
          setThumbnailIndex={setThumbnailIndex}
          handleFileChange={handleFileChange}
          handleDelete={handleDelete}
        />

        {/* 에디터 */}
        <label>설명</label>

        {editor && (
          <>
            <EditorToolbar
              editor={editor}
              fontSize={fontSize}
              setFontSize={setFontSize}
              handleEditorImage={handleEditorImage}
            />

            <div className="editor">
              <EditorContent editor={editor} />
            </div>
          </>
        )}

        <div className="row">
          <div className="field">
            <label>가격</label>
            <div className="input-with-unit">
              <input
                name="price"
                type="text"
                value={form.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, price: value });
                }}
              />
              <span>원</span>
            </div>
          </div>

          <div className="field">
            <label>작업일</label>
            <div className="input-with-unit">
              <input
                name="estimatedDays"
                type="text"
                value={form.estimatedDays}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, estimatedDays: value });
                }}
              />
              <span>일</span>
            </div>
          </div>
        </div>

      </div>

      <button className="submit-btn" onClick={submit}>
        등록하기
      </button>
    </div>
  );
}