import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBoards } from "../api/boardApi";
import styles from "./FreeBoardPage.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>자유게시판</h2>

        <Link
          to="/boards/write"
          className={styles.writeBtn}
        >
          글쓰기
        </Link>
      </div>

      {boards.length === 0 ? (
        <div className={styles.empty}>
          등록된 게시글이 없습니다.
        </div>
      ) : (
        boards.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className={styles.card}
          >
            <div className={styles.boardTitle}>
              {board.title}
            </div>

            <div className={styles.footer}>
              <span>{board.writerNickname}</span>
              <span>
                {new Date(board.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}