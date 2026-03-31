import apiClient from "../../../services/apiClient";

export const registerApi = (data) =>
  apiClient.post("/user/register", data);

export const loginApi = (data) =>
  apiClient.post("/user/login", data);