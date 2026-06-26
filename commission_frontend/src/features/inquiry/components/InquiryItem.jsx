import { useState } from "react";

import {
  updateInquiry,
  deleteInquiry
} from "../api/inquiryApi";

import { useAuth } from "@/context/AuthContext";

import InquiryForm from "./InquiryForm";

import "./InquiryItem.css";

export default function InquiryItem({
  item,
  onRefresh,
  commissionId,
  commissionUserId
}) {

  const [editMode, setEditMode] =
    useState(false);

  const [showReply, setShowReply] =
    useState(false);

  const [content, setContent] =
    useState(item.content);

  const { auth } = useAuth();

  const handleUpdate = async () => {

    try {

      await updateInquiry(
        item.id,
        { content }
      );

      setEditMode(false);

      onRefresh();

    } catch (e) {

      console.error(e);

    }
  };

  const handleDelete = async () => {

    const ok = window.confirm(
      "문의 내용을 삭제하시겠습니까?"
    );

    if (!ok) return;

    try {

      await deleteInquiry(item.id);

      onRefresh();

    } catch (e) {

      console.error(e);

    }
  };

  return (

    <div
      className={
        item.parentId
          ? "inquiry-item reply"
          : "inquiry-item"
      }
    >

      {!item.canView ? (

        <div className="secret-message">
          🔒 비밀글입니다.
        </div>

      ) : (

        <>

          <div className="inquiry-meta">

            <span>
              작성자 : {item.nickname}
            </span>

            <span>
              {item.createdAt}
            </span>

          </div>

          {editMode ? (

            <div className="edit-area">

              <textarea
                className="edit-textarea"
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
              />

              <div className="inquiry-actions">

                <button
                  className="edit-btn"
                  onClick={handleUpdate}
                >
                  저장
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    setEditMode(false)
                  }
                >
                  취소
                </button>

              </div>

            </div>

          ) : (

            <div className="inquiry-row">

              <div className="inquiry-content">

                {item.parentId && (

                  <span className="reply-badge">
                    답변
                  </span>

                )}

                {item.isSecret && (

                  <span className="secret-badge">
                    비밀글
                  </span>

                )}

                {item.content}

              </div>

              <div className="inquiry-actions">

                {(item.writerId === Number(auth.userId) ||
                  commissionUserId === Number(auth.userId)) && (

                    <>

                      {item.writerId === Number(auth.userId) && (

                        <button
                          className="edit-btn"
                          onClick={() =>
                            setEditMode(true)
                          }
                        >
                          수정
                        </button>

                      )}

                      <button
                        className="delete-btn"
                        onClick={handleDelete}
                      >
                        삭제
                      </button>

                    </>

                  )}

                {!item.parentId && (

                  <button
                    className="reply-btn"
                    onClick={() =>
                      setShowReply(
                        !showReply
                      )
                    }
                  >
                    답글
                  </button>

                )}

              </div>

            </div>

          )}

          {showReply && (

            <div className="reply-form">

              <InquiryForm
                commissionId={
                  commissionId
                }
                parentId={item.id}
                onSuccess={() => {

                  setShowReply(false);

                  onRefresh();

                }}
              />

            </div>

          )}

        </>

      )}

    </div>

  );

}