import apiClient from "../../../services/apiClient";

export const createPayment = async (commissionId) => {
  const response = await apiClient.post("/payments/create", {
    commissionId,
  });

  return response.data;
};

export const confirmPayment = async (data) => {
  const response = await apiClient.post("/payments/confirm", data);
  return response.data;
};

export const getArtistOrders = async () => {
  return apiClient.get("/payments/artist");
};

export const workDone = async (paymentId) => {
  return apiClient.patch(`/payments/${paymentId}/work-done`);
};

export const getBuyerOrders = async () => {
  return apiClient.get("/payments/buyer");
};

export const completePayment = async (paymentId) => {
  return apiClient.patch(`/payments/${paymentId}/complete`);
};

export const cancelPayment = async (paymentId) => {
  return apiClient.patch(`/payments/${paymentId}/cancel`);
};

export const uploadResult = async (paymentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.patch(
    `/payments/${paymentId}/result`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const startWork = async (paymentId) => {
  return apiClient.patch(`/payments/${paymentId}/start`);
};