import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBoards } from "../api/boardApi";

export default function FreeBoardPage() {

  const [boards, setBoards] = useState([]);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await getBoards("FREE");
      setBoards(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>자유게시판</h2>

      <Link to="/boards/write">
        글쓰기
      </Link>

      <hr />

      {boards.map(board => (
        <div key={board.id}>
          <Link to={`/boards/${board.id}`}>
            {board.title}
          </Link>

          <p>{board.writerNickname}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}