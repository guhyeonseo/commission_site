import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import "./App.css";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import apiClient from "./services/apiClient";

import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./features/home/pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CommissionListPage from "./features/commission/pages/CommissionListPage";
import CommissionDetailPage from "./features/commission/pages/CommissionDetailPage";
import CommissionCreatePage from "./features/commission/pages/CommissionCreatePage";

import PaymentSuccessPage from "./features/payment/pages/PaymentSuccessPage";
import PaymentFailPage from "./features/payment/pages/PaymentFailPage";

import Mypage from "./features/user/pages/MyPage";

import ArtistOrderPage from "./features/payment/pages/ArtistOrderPage";
import BuyerOrderPage from "./features/payment/pages/BuyerOrderPage";
import MyCommissionPage from "./features/commission/pages/MyCommissionPage";

import MyReviewsPage from "./features/review/pages/MyReviewsPage";

function AppInner() {

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    apiClient.get("/user/me")
      .then(res => {
        setAuth({
          token,
          user: res.data
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
      });

  }, []);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/commissionList" element={<CommissionListPage />} />
        <Route path="/commission/:id" element={<CommissionDetailPage />} />

        <Route path="/mypage" element={<Mypage />} />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CommissionCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              {/* <AdminPage /> */}
            </ProtectedRoute>
          }
        />

        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />

        <Route path="/artist/orders" element={<ArtistOrderPage />} />
        <Route path="/buyer/orders" element={<BuyerOrderPage />} />

        <Route path="/my/commissions" element={<MyCommissionPage />} />

        <Route path="/my-reviews" element={<MyReviewsPage />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;