import { useEffect, useState } from "react";
import {
  getArtistOrders,
  workDone,
  uploadResult,
  startWork,
} from "../api/paymentApi";

import styles from "./ArtistOrderPage.module.css";

export default function ArtistOrderPage() {
  const [list, setList] = useState([]);
  const [files, setFiles] = useState({});

  const load = async () => {
    const res = await getArtistOrders();
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "READY":
        return "결제 대기";
      case "WAITING_START":
        return "작업 시작 대기";
      case "IN_PROGRESS":
        return "작업 중";
      case "WORK_DONE":
        return "작업 완료";
      case "COMPLETED":
        return "구매 확정";
      case "REFUNDED":
        return "환불 완료";
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
      case "REFUNDED":
      case "CANCELED":
        return styles.canceled;
      default:
        return "";
    }
  };

  const handleStart = async (paymentId) => {
    await startWork(paymentId);
    load();
  };

  const handleUpload = async (paymentId) => {
    const file = files[paymentId];

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    await uploadResult(paymentId, file);
    load();
  };

  const handleDone = async (paymentId) => {
    await workDone(paymentId);
    load();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 주문 목록</h2>

      {list.length === 0 ? (
        <div className={styles.empty}>
          진행 중인 주문이 없습니다.
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
              <span>구매자</span>
              <strong>{item.buyerNickname}</strong>
            </div>

            <div className={styles.row}>
              <span>금액</span>
              <strong>
                {item.amount?.toLocaleString()}원
              </strong>
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

            {item.status === "WAITING_START" && (
              <button
                className={styles.startBtn}
                onClick={() =>
                  handleStart(item.id)
                }
              >
                작업 시작
              </button>
            )}

            {item.status === "IN_PROGRESS" && (
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  onChange={(e) => {
                    const file =
                      e.target.files[0];

                    setFiles((prev) => ({
                      ...prev,
                      [item.id]: file,
                    }));
                  }}
                />

                <button
                  className={styles.uploadBtn}
                  onClick={() =>
                    handleUpload(item.id)
                  }
                >
                  완성본 업로드
                </button>
              </div>
            )}

            {item.status === "WORK_DONE" && (
              <button
                className={styles.doneBtn}
                onClick={() =>
                  handleDone(item.id)
                }
              >
                작업 완료 처리
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}