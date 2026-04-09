import apiClient from "../../../services/apiClient";

export const getCommissionList = () =>
  apiClient.get("/commissions");

export const getCommissionDetail = (id) =>
  apiClient.get(`/commissions/${id}`);

export const createCommission = (data) =>
  apiClient.post("/commissions/create", data);