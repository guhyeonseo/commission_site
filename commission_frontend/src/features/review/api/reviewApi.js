import apiClient from "@/services/apiClient";

export const getReviews = (commissionId) =>
  apiClient.get(`/reviews/commission/${commissionId}`);

export const createReview = (data) =>
  apiClient.post("/reviews", data);

export const getMyReviews = () =>
  apiClient.get("/reviews/my");