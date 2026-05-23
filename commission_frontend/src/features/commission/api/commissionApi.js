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