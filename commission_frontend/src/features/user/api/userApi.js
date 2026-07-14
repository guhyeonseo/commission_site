import apiClient from "@/services/apiClient";

export const getMyInfo = async () => {
  const res = await apiClient.get("/user/me");
  return res.data;
};

export const updateUser = async (formData) => {
  const res = await apiClient.patch("/user/me", formData);
  return res.data;
};

export const updatePasswordApi = (data) =>
  apiClient.patch("user/password", data);

export const getSellerProfile = async (id) => {
  const res = await apiClient.get(`/user/${id}`);
  return res.data;
};

export const getSellerCommissions = async (id) => {
  const res = await apiClient.get(
    `/user/${id}/commissions`
  );

  return res.data;
};

