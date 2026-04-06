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

function AppInner() {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.token) {
      apiClient.get("/user/me")
        .then(res => console.log("유저:", res.data))
        .catch(err => console.error(err));
    }
  }, [auth.token]);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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