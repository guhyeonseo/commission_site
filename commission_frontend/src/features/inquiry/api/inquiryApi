import apiClient from "@/services/apiClient";
import axios from "axios";

// 문의 목록 조회
export const getInquiries = async (commissionId) => {
  const res = await apiClient.get(`/inquiries/${commissionId}`);
  return res.data;
};

// 문의 작성
export const createInquiry = async (data) => {
  return await apiClient.post(`/inquiries`, data);
};

// 문의 수정
export const updateInquiry = (id, data) =>
  apiClient.patch(`/inquiries/${id}`, data);

// 문의 삭제
export const deleteInquiry = (id) =>
  apiClient.delete(`/inquiries/${id}`);