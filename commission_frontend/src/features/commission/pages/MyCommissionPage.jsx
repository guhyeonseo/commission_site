import { useEffect, useState } from "react";
import {
  getMyCommissions,
  toggleCommissionStatus,
  deleteCommission,
} from "../api/commissionApi";

import styles from "./MyCommissionPage.module.css";

export default function MyCommissionPage() {
  const [list, setList] = useState([]);

  const load = async () => {
    const data = await getMyCommissions();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "OPEN":
        return "모집 중";
      case "CLOSED":
        return "모집 마감";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return styles.open;
      case "CLOSED":
        return styles.closed;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 커미션</h2>

      {list.length === 0 ? (
        <div className={styles.empty}>
          등록한 커미션이 없습니다.
        </div>
      ) : (
        list.map((item) => (
          <div
            key={item.id}
            className={styles.card}
          >
            <div className={styles.row}>
              <span>제목</span>
              <strong>{item.title}</strong>
            </div>

            <div className={styles.row}>
              <span>가격</span>
              <strong>
                {item.price?.toLocaleString()}원
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

            <div className={styles.buttonGroup}>
              <button
                className={styles.toggleBtn}
                onClick={async () => {
                  await toggleCommissionStatus(
                    item.id
                  );
                  load();
                }}
              >
                {item.status === "OPEN"
                  ? "모집 마감"
                  : "모집 열기"}
              </button>

              <button
                className={styles.deleteBtn}
                onClick={async () => {
                  const ok = window.confirm(
                    "커미션을 삭제하시겠습니까?"
                  );

                  if (!ok) return;

                  try {
                    await deleteCommission(
                      item.id
                    );
                    load();
                  } catch (e) {
                    alert(
                      e.response?.data ||
                        "모집 중인 커미션이 있습니다."
                    );
                  }
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}