import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommissionDetail } from "../features/commission/api/commissionApi.js";
import "./CommissionDetailPage.css";

export default function CommissionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getCommissionDetail(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  if (!data) return <div>로딩...</div>;

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
        <div>💰 가격: {data.price?.toLocaleString()}원 ~</div>
        <div>⏱ 작업일: {data.estimatedDays}일</div>
      </div>

      {/* 설명 */}
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: fixedDescription }}
      />
    </div>
  );
}