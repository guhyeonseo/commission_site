import apiClient from "@/services/apiClient";

export const getMyInfo = async () => {
  const res = await apiClient.get("/user/me");
  return res.data;
};

export const updateUser = async (data) => {
  const res = await apiClient.patch("/user/me", data);
  return res.data;
};

export const updatePasswordApi = (data) =>
  apiClient.patch("user/password", data);