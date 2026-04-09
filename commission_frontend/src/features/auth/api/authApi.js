import apiClient from "../../../services/apiClient";

export const registerApi = (data) =>
  apiClient.post("/user/register", data);

export const loginApi = async (data) => {
  const res = await apiClient.post("/user/login", data);

  console.log("응답:", res.data);

  const token = res.data.accessToken;

  if (!token) {
    throw new Error("토큰 없음");
  }
  
  return token;
};