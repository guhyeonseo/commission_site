import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCommissionDetail,
  deleteCommission
} from "../api/commissionApi";

import InquiryForm from "@/features/inquiry/components/InquiryForm";
import InquiryList from "@/features/inquiry/components/InquiryList";
import PaymentButton from "../../payment/components/PaymentButton";

import { getReviews } from "@/features/review/api/reviewApi";
import { createChatRoom } from "@/features/chat/api/chatApi";

import { useAuth } from "@/context/AuthContext";

import "./CommissionDetailPage.css";

export default function CommissionDetailPage() {

  const { auth } = useAuth();

  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false);

  const { id } = useParams();

  const [data, setData] = useState(null);

  const [showInquiryForm, setShowInquiryForm] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [reviews, setReviews] =
    useState([]);

  const handleChat = async () => {

    try {

      const room =
        await createChatRoom(
          data.id
        );

      navigate(
        `/chat/${room.roomId}`
      );

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {

    getCommissionDetail(id)
      .then((res) => {

        console.log(
          "응답 데이터",
          res.data
        );

        setData(res.data);

      });

  }, [id]);

  useEffect(() => {

    getReviews(id)
      .then((res) => {

        console.log(
          "리뷰 응답",
          res.data
        );

        setReviews(res.data);

      })
      .catch((err) => {

        console.log(
          "리뷰 에러",
          err
        );

      });

  }, [id]);

  if (!data) {
    return <div>로딩...</div>;
  }

  const canDelete =
    auth &&
    (
      Number(auth.userId) === data.userId ||
      auth.role === "ADMIN"
    );

  const fixedDescription =
    data.description
      ?.replace(
        /src="(?!http)(\/?uploads\/)/g,
        'src="http://localhost:8484/$1'
      )
      ?.replace(
        /src="blob:[^"]*"/g,
        ""
      );

  return (

    <div className="detail-container">

      <h2 className="title">
        {data.title}
      </h2>

      <div className="detail-top">

        <div className="detail-left">

          <div
            className="slider"
            onClick={(e) => {
              const { left, width } =
                e.currentTarget.getBoundingClientRect();

              const clickX = e.clientX - left;

              if (clickX < width / 2) {

                setCurrentIndex(prev =>
                  prev === 0
                    ? data.images.length - 1
                    : prev - 1
                );

              } else {

                setCurrentIndex(prev =>
                  prev === data.images.length - 1
                    ? 0
                    : prev + 1
                );

              }
            }}
          >
            <img
              src={data.images[currentIndex]}
              className="main-image"
              alt=""
            />
          </div>

          <div className="thumbnail-list">

            {data.images.map((img, index) => (

              <img
                key={index}
                src={data.images[currentIndex]}
                className={
                  index === currentIndex
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrentIndex(index)
                }
                alt=""
              />

            ))}

          </div>

        </div>

        <div className="detail-right">

          <div className="info-box">

            <div className="info-item">
              ⭐ {data.avgRating?.toFixed(2)}
              ({data.reviewCount}개)
            </div>

            <div className="info-item">
              💰 {data.price?.toLocaleString()}원~
            </div>

            <div className="info-item">
              ⏱ 작업일 {data.estimatedDays}일
            </div>

            <div className="info-item">
              👁 조회수 {data.viewCount}
            </div>

            <button
              className="primary-btn"
              onClick={() =>
                navigate(`/users/${data.userId}`)
              }
            >
              작가 프로필
            </button>

            <button
              className="primary-btn"
              onClick={handleChat}
            >
              채팅하기
            </button>

            <PaymentButton
              commissionId={data.id}
            />

            {canDelete && (

              <button
                className="commission-delete-btn"
                onClick={async () => {

                  const ok =
                    window.confirm(
                      "커미션을 삭제하시겠습니까?"
                    );

                  if (!ok) return;

                  try {

                    await deleteCommission(
                      data.id
                    );

                    alert("삭제되었습니다.");

                    navigate(
                      "/my/commissions"
                    );

                  } catch (e) {

                    alert(
                      e.response?.data ||
                      "삭제할 수 없습니다."
                    );

                  }
                }}
              >
                삭제
              </button>

            )}

          </div>

        </div>

      </div>

      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: fixedDescription
        }}
      />

      <div className="inquiry-section">

        <div className="inquiry-header">

          <h2 className="inquiry-title">
            문의 및 답변
          </h2>

          <button
            className="toggle-inquiry-btn"
            onClick={() =>
              setShowInquiryForm(
                !showInquiryForm
              )
            }
          >
            {showInquiryForm
              ? "작성 닫기 ▲"
              : "문의하기 ▼"}
          </button>

        </div>

        <div
          className={
            showInquiryForm
              ? "inquiry-form-wrapper open"
              : "inquiry-form-wrapper"
          }
        >
          <InquiryForm
            commissionId={id}
            onSuccess={() => {
              setRefresh(!refresh);
              setShowInquiryForm(false);
            }}
          />
        </div>

        <InquiryList
          commissionId={id}
          commissionUserId={data.userId}
          refresh={refresh}
        />

        <h2 className="review-title">
          리뷰
        </h2>

        {reviews.length === 0 ? (

          <div className="empty-review">
            아직 리뷰가 없습니다.
          </div>

        ) : (

          <>

            <div className="review-header">

              <div className="review-id">
                번호
              </div>

              <div className="review-rating">
                평점
              </div>

              <div className="review-content">
                내용
              </div>

              <div className="review-writer">
                작성자
              </div>

              <div className="review-date">
                작성일
              </div>

            </div>

            {reviews.map((review) => (

              <div
                key={review.id}
                className="review-row"
              >

                <div className="review-id">
                  {review.id}
                </div>

                <div className="review-rating">

                  {"★".repeat(
                    Math.floor(review.rating)
                  )}

                  {"☆".repeat(
                    5 - Math.floor(review.rating)
                  )}

                  {" "}
                  ({review.rating})

                </div>

                <div className="review-content">
                  {review.content}
                </div>

                <div className="review-writer">
                  {review.writerNickname}
                </div>

                <div className="review-date">
                  {review.createdAt}
                </div>

              </div>

            ))}

          </>

        )}

      </div>
    </div>

  );

}