import axios from "axios";

const API_URL = "http://localhost:8484/api/payments";

export const createPayment = async (
  commissionId
) => {

  const response = await axios.post(
    `${API_URL}/create`,
    {
      commissionId
    },
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );

  return response.data;
};

export const confirmPayment = async (data) => {

  const response = await axios.post(
    `${API_URL}/confirm`,
    data
  );

  return response.data;
};

export const getArtistOrders = async () => {

  return axios.get(
    "http://localhost:8484/api/payments/artist",
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};

export const workDone = async (paymentId) => {

  return axios.patch(
    `http://localhost:8484/api/payments/${paymentId}/work-done`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};

export const getBuyerOrders = async () => {

  return axios.get(
    "http://localhost:8484/api/payments/buyer",
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};

export const completePayment = async (
  paymentId
) => {

  return axios.patch(
    `http://localhost:8484/api/payments/${paymentId}/complete`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};

export const cancelPayment = async (
  paymentId
) => {

  return axios.patch(
    `http://localhost:8484/api/payments/${paymentId}/cancel`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};

export const uploadResult = async (
  paymentId,
  file
) => {

  const formData = new FormData();

  formData.append("file", file);

  return axios.patch(
    `http://localhost:8484/api/payments/${paymentId}/result`,
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type":
          "multipart/form-data"
      }
    }
  );
};

export const startWork = async (paymentId) => {

  return axios.patch(
    `http://localhost:8484/api/payments/${paymentId}/start`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
};