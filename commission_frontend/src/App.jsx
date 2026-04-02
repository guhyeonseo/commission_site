import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/layout/Header"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔒 보호된 페이지 */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                {/* <AdminPage /> */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;