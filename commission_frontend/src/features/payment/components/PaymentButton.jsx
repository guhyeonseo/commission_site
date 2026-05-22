import { loadTossPayments } from "@tosspayments/payment-sdk";

import { createPayment } from "../api/paymentApi";

export default function PaymentButton({
  commissionId
}) {

  const handlePayment = async () => {

    try {

      // 주문 생성
      const data = await createPayment(
        commissionId
      );

      const { orderId, amount } = data;

      // 토스 SDK
      const tossPayments =
        await loadTossPayments(
          "test_ck_oEjb0gm23PLJgdZDxL063pGwBJn5"
        );

      // 결제창
      await tossPayments.requestPayment(
        "카드",
        {
          amount,
          orderId,

          orderName: "커미션 결제",

          customerName: "테스트유저",

          successUrl:
            "http://localhost:5173/payment/success",

          failUrl:
            "http://localhost:5173/payment/fail"
        }
      );

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <button onClick={handlePayment}>
      결제하기
    </button>
  );
}