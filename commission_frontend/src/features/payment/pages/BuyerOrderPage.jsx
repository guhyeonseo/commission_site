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
            {item.status}
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