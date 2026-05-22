import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { confirmPayment } from "../api/paymentApi";

export default function PaymentSuccessPage() {

  const [params] = useSearchParams();

  useEffect(() => {

    const confirm = async () => {

      try {

        const paymentKey =
          params.get("paymentKey");

        const orderId =
          params.get("orderId");

        const amount =
          params.get("amount");

        await confirmPayment({
          paymentKey,
          orderId,
          amount
        });

        alert("결제 성공");

      } catch (error) {

        console.error(error);

        alert("결제 승인 실패");

      }
    };

    confirm();

  }, []);

  return (
    <div>
      결제 승인중...
    </div>
  );
}