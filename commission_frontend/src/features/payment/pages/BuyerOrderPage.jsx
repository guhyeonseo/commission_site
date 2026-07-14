import { useEffect, useState } from "react";
import {
  getBuyerOrders,
  completePayment,
  cancelPayment,
} from "../api/paymentApi";

import { createReview } from "@/features/review/api/reviewApi";

import styles from "./BuyerOrderPage.module.css";

export default function BuyerOrderPage() {

  const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

  const [list, setList] = useState([]);
  const [reviewData, setReviewData] = useState({});

  const load = async () => {
    const res = await getBuyerOrders();
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleComplete = async (paymentId) => {
    await completePayment(paymentId);
    load();
  };

  const handleCancel = async (paymentId) => {
    await cancelPayment(paymentId);
    load();
  };

  const getStatusText = (status) => {
    switch (status) {
      case "WAITING_START":
        return "작업 대기";
      case "IN_PROGRESS":
        return "작업 중";
      case "WORK_DONE":
        return "작업 완료";
      case "COMPLETED":
        return "거래 완료";
      case "CANCELED":
        return "주문 취소";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "WAITING_START":
        return styles.waiting;
      case "IN_PROGRESS":
        return styles.progress;
      case "WORK_DONE":
        return styles.done;
      case "COMPLETED":
        return styles.completed;
      case "CANCELED":
        return styles.canceled;
      default:
        return "";
    }
  };

  const handleReviewChange = (
    paymentId,
    field,
    value
  ) => {
    setReviewData((prev) => ({
      ...prev,
      [paymentId]: {
        ...prev[paymentId],
        [field]: value,
      },
    }));
  };

  const handleReview = async (paymentId) => {
    const review = reviewData[paymentId];

    try {
      await createReview({
        paymentId,
        rating: Number(review?.rating ?? 5),
        content: review?.content ?? "",
      });

      alert("리뷰 작성 완료");
      load();
    } catch (e) {
      console.log(e);
      alert("리뷰 작성 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 주문</h2>

      {list.length === 0 ? (
        <div className={styles.empty}>
          주문 내역이 없습니다.
        </div>
      ) : (
        list.map((item) => (
          <div
            key={item.id}
            className={styles.card}
          >
            <div className={styles.row}>
              <span>커미션</span>
              <strong>{item.commissionTitle}</strong>
            </div>

            <div className={styles.row}>
              <span>상태</span>

              <span
                className={`${styles.statusBadge} ${getStatusClass(
                  item.status
                )}`}
              >
                {getStatusText(item.status)}
              </span>
            </div>

            {item.status === "WORK_DONE" && (
              <div className={styles.buttonGroup}>
                <a
                  href={`${API_BASE}${item.resultUrl}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className={styles.downloadBtn}>
                    결과물 다운로드
                  </button>
                </a>

                <button
                  className={styles.completeBtn}
                  onClick={() =>
                    handleComplete(item.id)
                  }
                >
                  구매 확정
                </button>

                <button
                  className={styles.cancelBtn}
                  onClick={() =>
                    handleCancel(item.id)
                  }
                >
                  주문 취소
                </button>
              </div>
            )}

            {item.status === "COMPLETED" &&
              !item.reviewed && (
                <div className={styles.reviewBox}>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    placeholder="별점"
                    value={
                      reviewData[item.id]
                        ?.rating ?? 5
                    }
                    onChange={(e) =>
                      handleReviewChange(
                        item.id,
                        "rating",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    placeholder="리뷰 내용을 입력해주세요"
                    value={
                      reviewData[item.id]
                        ?.content ?? ""
                    }
                    onChange={(e) =>
                      handleReviewChange(
                        item.id,
                        "content",
                        e.target.value
                      )
                    }
                  />

                  <button
                    className={styles.reviewBtn}
                    onClick={() =>
                      handleReview(item.id)
                    }
                  >
                    리뷰 작성
                  </button>
                </div>
              )}

            {item.status === "COMPLETED" &&
              item.reviewed && (
                <div className={styles.reviewDone}>
                  ✅ 리뷰 작성 완료
                </div>
              )}
          </div>
        ))
      )}
    </div>
  );
}