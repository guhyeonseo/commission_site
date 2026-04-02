import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);

        setAuth({
          token: savedToken,
          role: decoded.role, 
        });
      } catch (e) {
        console.error("토큰 decode 실패");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);

    const role = decoded.role; 

    localStorage.setItem("token", token);

    setAuth({
      token,
      role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");

    setAuth({
      token: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};