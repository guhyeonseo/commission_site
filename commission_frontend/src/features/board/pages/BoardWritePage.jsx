import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi";

export default function BoardWritePage() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBoard({
        title,
        content,
        boardType: "FREE"
      });

      alert("게시글이 작성되었습니다.");

      navigate("/boards/free");

    } catch (err) {
      console.error(err);
      alert("게시글 작성 실패");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>글쓰기</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <br />

        <div>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            style={{ width: "100%" }}
          />
        </div>

        <br />

        <button type="submit">
          작성
        </button>

      </form>
    </div>
  );
}