import apiClient from "../../../services/apiClient";

export const getCommissionList = (params) =>
  apiClient.get("/commissions", { params });

export const getCommissionDetail = (id) =>
  apiClient.get(`/commissions/${id}`);

export const createCommission = (data) =>
  apiClient.post("/commissions/create", data);

export const getMyCommissions = async () => {
  const response = await apiClient.get("/commissions/my");
  return response.data;
};

export const toggleCommissionStatus = async (commissionId) => {
  await apiClient.patch(`/commissions/${commissionId}/toggle`);
};

export const deleteCommission = async (commissionId) => {
  await apiClient.delete(`/commissions/${commissionId}`);
};

export const uploadCommissionImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post(
    "/commissions/upload",
    formData
  );

  return res.data;
};