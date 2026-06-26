import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent } from "@tiptap/react";

import { createBoard } from "../api/boardApi";

import EditorToolbar from "@/components/editor/EditorToolbar";
import useTiptapEditor from "@/hooks/useTiptapEditor";

import styles from "./BoardWritePage.module.css";

export default function BoardWritePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const {
    editor,
    content,
    fontSize,
    setFontSize,
    handleEditorImage,
  } = useTiptapEditor();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await createBoard({
        title,
        content,
        boardType: "FREE",
      });

      alert("게시글이 작성되었습니다.");

      navigate("/boards/free");
    } catch (err) {
      console.error(err);
      alert("게시글 작성 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>글쓰기</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.inputGroup}>
          <label>제목</label>

          <input
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className={styles.inputGroup}>
          <label>내용</label>

          {editor && (
            <>
              <EditorToolbar
                editor={editor}
                fontSize={fontSize}
                setFontSize={setFontSize}
                handleEditorImage={handleEditorImage}
              />

              <div className={styles.editor}>
                <EditorContent editor={editor} />
              </div>
            </>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitBtn}
          >
            작성
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}