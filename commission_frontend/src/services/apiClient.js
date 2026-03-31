import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8484/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;