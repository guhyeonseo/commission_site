import apiClient from "../../../services/apiClient";

export const getCommissionList = (params) =>
  apiClient.get("/commissions", { params });

export const getCommissionDetail = (id) =>
  apiClient.get(`/commissions/${id}`);

export const createCommission = (data) =>
  apiClient.post("/commissions/create", data);
