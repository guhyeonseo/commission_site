import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommissionDetail } from "../api/commissionApi.js";

import InquiryForm from "@/features/inquiry/components/InquiryForm";
import InquiryList from "@/features/inquiry/components/InquiryList";

import PaymentButton from "../../payment/components/PaymentButton";

import { getReviews } from "@/features/review/api/reviewApi";

import "./CommissionDetailPage.css";

export default function CommissionDetailPage() {
  const [refresh, setRefresh] = useState(false);

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getCommissionDetail(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  useEffect(() => {
    getReviews(id)
      .then((res) => {
        console.log("리뷰 응답", res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log("리뷰 에러", err);
      });
  }, [id]);

  if (!data) return <div>로딩...</div>;

  console.log(data.status);
  console.log(typeof data.status);

  const fixedDescription = data.description
    ?.replace(/src="(?!http)(\/?uploads\/)/g, 'src="http://localhost:8484/$1')
    ?.replace(/src="blob:[^"]*"/g, '');

  return (
    <div className="detail-container">
      <h2 className="title">{data.title}</h2>

      {/* 🔥 슬라이드 (클릭 이동) */}
      <div
        className="slider"
        onClick={(e) => {
          const { left, width } = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - left;

          if (clickX < width / 2) {
            setCurrentIndex((prev) =>
              prev === 0 ? data.images.length - 1 : prev - 1
            );
          } else {
            setCurrentIndex((prev) =>
              prev === data.images.length - 1 ? 0 : prev + 1
            );
          }
        }}
      >
        <img
          src={`http://localhost:8484${data.images[currentIndex]}`}
          className="main-image"
          alt=""
        />
      </div>

      {/* 🔥 썸네일 */}
      <div className="thumbnail-list">
        {data.images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:8484${img}`}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
            alt=""
          />
        ))}
      </div>

      {/* 정보 */}
      <div className="info-box">
        <div>
          ⭐ {data.avgRating?.toFixed(2)}
          ({data.reviewCount}개)
        </div>

        <div>💰 가격: {data.price?.toLocaleString()}원 ~</div>
        <div>⏱ 작업일: {data.estimatedDays}일</div>

        <PaymentButton
          commissionId={data.id}
        />
      </div>

      {/* 설명 */}
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: fixedDescription }}
      />

      <div style={{ marginTop: "40px" }}>
        <InquiryForm
          commissionId={id}
          onSuccess={() => setRefresh(!refresh)}
        />

        <InquiryList
          commissionId={id}
          commissionUserId={data.userId}
          refresh={refresh}
        />
      </div>

      <h2>리뷰</h2>

      {reviews.length === 0 ? (
        <p>아직 리뷰가 없습니다.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "20px",
              fontWeight: "bold",
              borderBottom: "2px solid black",
              paddingBottom: "10px"
            }}
          >
            <div>번호</div>
            <div style={{ width: "120px" }}>평점</div>
            <div style={{ flex: 1 }}>내용</div>
            <div style={{ width: "120px" }}>작성자</div>
            <div style={{ width: "160px" }}>작성일</div>
          </div>

          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #ddd"
              }}
            >
              <div>{review.id}</div>

              <div style={{ width: "120px" }}>
                {"★".repeat(Math.floor(review.rating))}
                {"☆".repeat(5 - Math.floor(review.rating))}
                {" "}
                ({review.rating})
              </div>

              <div style={{ flex: 1 }}>
                {review.content}
              </div>

              <div style={{ width: "120px" }}>
                {review.writerNickname}
              </div>

              <div style={{ width: "160px" }}>
                {review.createdAt}
              </div>
            </div>
          ))}
        </>
      )}

    </div>

  );
}