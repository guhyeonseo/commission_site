import { useState } from "react";
import { updateInquiry, deleteInquiry } from "../api/inquiryApi";
import { useAuth } from "@/context/AuthContext";

export default function InquiryItem({ item, onRefresh }) {
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(item.content);

  const { auth } = useAuth();

  console.log("item.writerId:", item.writerId, typeof item.writerId);
  console.log("auth.userId:", auth?.userId, typeof auth?.userId);

  const handleUpdate = async () => {
    try {
      await updateInquiry(item.id, { content });
      setEditMode(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!confirm("문의 내용을 삭제하시겠습니까?")) return;

    try {
      await deleteInquiry(item.id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      padding: "10px",
      borderBottom: "1px solid #eee",
      marginLeft: item.parentId ? "20px" : "0px"
    }}>

      {!item.canView ? (
        <div>🔒 비밀글입니다</div>
      ) : (
        <>
          <div style={{ fontSize: "12px", color: "#888" }}>
            작성자: {item.writerId}
          </div>

          {editMode ? (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button onClick={handleUpdate}>저장</button>
              <button onClick={() => setEditMode(false)}>취소</button>
            </>
          ) : (
            <div>{item.content}</div>
          )}

          {/* 내 글만 수정/삭제 */}
          {item.writerId === auth.userId && !editMode && !editMode && (
            <div>
              <button onClick={() => setEditMode(true)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}