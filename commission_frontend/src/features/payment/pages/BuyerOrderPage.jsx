import { useEffect, useState } from "react";


import {
  getBuyerOrders,
  completePayment,
  cancelPayment
} from "../api/paymentApi";

export default function BuyerOrderPage() {

  const [list, setList] =
    useState([]);

  const load = async () => {

    const res =
      await getBuyerOrders();

    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleComplete =
    async (paymentId) => {

      await completePayment(
        paymentId
      );

      load();
    };

  const handleCancel = async (
    paymentId
  ) => {

    await cancelPayment(paymentId);

    load();
  };

  const getStatusText = (status) => {

    switch (status) {

      case "WAITING_START":
        return "작업 대기";

      case "IN_PROGRESS":
        return "작업중";

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

  const getStatusColor = (status) => {

    switch (status) {

      case "WAITING_START":
        return "#f59e0b";

      case "IN_PROGRESS":
        return "#3b82f6";

      case "WORK_DONE":
        return "#8b5cf6";

      case "COMPLETED":
        return "#22c55e";

      case "CANCELED":
        return "#ef4444";

      default:
        return "#999";
    }
  };

  return (
    <div>

      <h2>내 주문</h2>

      {list.map(item => (

        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px"
          }}
        >

          <div>
            커미션:
            {item.commissionTitle}
          </div>

          <div>

            상태:

            <span
              style={{
                background:
                  getStatusColor(item.status),

                color: "white",

                padding: "4px 10px",

                borderRadius: "999px",

                marginLeft: "8px",

                fontSize: "14px"
              }}
            >
              {getStatusText(item.status)}
            </span>

          </div>

          {item.status ===
            "WORK_DONE" && (

              <div>

                <a
                  href={
                    `http://localhost:8484${item.resultUrl}`
                  }
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  <button>
                    결과물 다운로드
                  </button>
                </a>

                <button
                  onClick={() =>
                    handleComplete(
                      item.id
                    )
                  }
                >
                  구매 확정
                </button>

              </div>
            )}
        </div>
      ))}

    </div>
  );
}