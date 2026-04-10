import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import "./App.css";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import apiClient from "./services/apiClient";

import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CommissionListPage from "./pages/CommissionListPage";
import CommissionDetailPage from "./pages/CommissionDetailPage";
import CommissionCreatePage from "./pages/CommissionCreatePage";

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

        <Route path="/commissionList" element= {<CommissionListPage />}/>

        <Route
          path="/commission/:id"
          element={
            <ProtectedRoute>
              <CommissionDetailPage />
            </ProtectedRoute>
          }
        />

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