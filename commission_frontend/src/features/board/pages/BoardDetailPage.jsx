import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBoard, deleteBoard } from "../api/boardApi";
import { useAuth } from "../../../context/AuthContext";
import styles from "./BoardDetailPage.module.css";

export default function BoardDetailPage() {
    const { auth } = useAuth();

    const navigate = useNavigate();
    const { boardId } = useParams();

    const [board, setBoard] = useState(null);

    useEffect(() => {
        loadBoard();
    }, [boardId]);

    const loadBoard = async () => {
        try {
            const data = await getBoard(boardId);
            setBoard(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {

        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteBoard(boardId);

            alert("삭제되었습니다.");

            navigate(
                board.boardType === "NOTICE"
                    ? "/boards/notice"
                    : "/boards/free"
            );

        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    };

    if (!board) {
        return <div>로딩중...</div>;
    }

    const isWriter =
        Number(auth.userId) === board.writerId;

    const isAdmin =
        auth.role === "ADMIN";

    const canDelete =
        isWriter || isAdmin;

    return (
        <div className={styles.page}>

            <div className={styles.card}>

                <div className={styles.header}>

                    <h2 className={styles.title}>
                        {board.title}
                    </h2>

                    <div className={styles.info}>
                        <span>작성자 : {board.writerNickname}</span>
                        <span>게시판 : 자유 게시판</span>
                        <span>작성일 : {new Date(board.createdAt).toLocaleDateString()}</span>
                    </div>

                </div>

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{
                        __html: board.content,
                    }}
                />

                <div className={styles.footer}>

                    <div className={styles.leftButtons}>

                        <Link
                            to="/boards/free"
                            className={`${styles.btn} ${styles.listBtn}`}
                        >
                            목록
                        </Link>

                    </div>

                    <div className={styles.rightButtons}>

                        {isWriter && (
                            <Link
                                to={`/boards/edit/${board.id}`}
                                className={`${styles.btn} ${styles.editBtn}`}
                            >
                                수정
                            </Link>
                        )}

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                className={`${styles.btn} ${styles.deleteBtn}`}
                            >
                                삭제
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
