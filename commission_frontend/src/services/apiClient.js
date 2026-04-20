import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // accessToken 만료
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh 요청
        const res = await apiClient.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        // 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 헤더 다시 세팅
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return apiClient(originalRequest);

      } catch (e) {
        // refresh도 실패 → 진짜 로그아웃
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;