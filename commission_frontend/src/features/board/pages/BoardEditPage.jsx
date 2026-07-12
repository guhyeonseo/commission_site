import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent } from "@tiptap/react";

import {
  getBoard,
  updateBoard,
  uploadBoardImage,
} from "../api/boardApi";

import EditorToolbar from "@/components/editor/EditorToolbar";
import useTiptapEditor from "@/hooks/useTiptapEditor";

import styles from "./BoardEditPage.module.css";

export default function BoardEditPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");

  const {
    editor,
    content,
    fontSize,
    setFontSize,
    handleEditorImage,
  } = useTiptapEditor(uploadBoardImage, initialContent);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const loadBoard = async () => {
    try {
      const data = await getBoard(boardId);
      
      setTitle(data.title);
      setInitialContent(data.content);
    } catch (err) {
      console.error(err);
    }
  };

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
      await updateBoard(boardId, {
        title,
        content,
        boardType: "FREE",
      });

      alert("수정되었습니다.");
      navigate(`/boards/${boardId}`);
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>게시글 수정</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.inputGroup}>
          <label>제목</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            수정하기
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