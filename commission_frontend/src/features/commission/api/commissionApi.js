import apiClient from "../../../services/apiClient";
import axios from "axios";

export const getCommissionList = (params) =>
  apiClient.get("/commissions", { params });

export const getCommissionDetail = (id) =>
  apiClient.get(`/commissions/${id}`);

export const createCommission = (data) =>
  apiClient.post("/commissions/create", data);

export const getMyCommissions =
  async () => {

    const response =
      await axios.get(
        "http://localhost:8484/api/commissions/my",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

    return response.data;
  };

export const toggleCommissionStatus =
  async (commissionId) => {

    await axios.patch(
      `http://localhost:8484/api/commissions/${commissionId}/toggle`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
  };

export const deleteCommission =
  async (commissionId) => {

    await axios.delete(
      `http://localhost:8484/api/commissions/${commissionId}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
  };