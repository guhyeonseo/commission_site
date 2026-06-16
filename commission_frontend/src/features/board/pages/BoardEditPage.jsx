import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getBoard,
  updateBoard
} from "../api/boardApi";

export default function BoardEditPage() {

  const { boardId } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {

    try {

      const data = await getBoard(boardId);

      setTitle(data.title);
      setContent(data.content);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateBoard(
        boardId,
        {
          title,
          content,
          boardType: "FREE"
        }
      );

      alert("수정되었습니다.");

      navigate(`/boards/${boardId}`);

    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>게시글 수정</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={{ width: "100%" }}
        />

        <br /><br />

        <textarea
          rows={15}
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          style={{ width: "100%" }}
        />

        <br /><br />

        <button type="submit">
          수정하기
        </button>

      </form>
    </div>
  );
}