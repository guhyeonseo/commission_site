import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBoard, deleteBoard } from "../api/boardApi";
import { useAuth } from "../../../context/AuthContext";

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
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2>{board.title}</h2>

            <hr />

            <div>
                <strong>작성자</strong> : {board.writerNickname}
            </div>

            <div>
                <strong>게시판</strong> : {board.boardType}
            </div>

            <div>
                <strong>작성일</strong> : {board.createdAt}
            </div>

            <hr />

            <div
                style={{
                    minHeight: "300px",
                    whiteSpace: "pre-wrap"
                }}
            >
                {board.content}
            </div>

            <br />

            {isWriter && (
                <Link to={`/boards/edit/${board.id}`}>
                    수정
                </Link>
            )}

            {canDelete && (
                <button
                    onClick={handleDelete}
                    style={{ marginLeft: "10px" }}
                >
                    삭제
                </button>
            )}
        </div>
    );
}
