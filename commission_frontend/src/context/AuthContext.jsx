import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    exp: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        console.log("decoded:", decoded);

        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("accessToken");
          setAuth({ token: null, role: null });
        } else {
          setAuth({
            token: savedToken,
            role: decoded.role,
            exp: decoded.exp,
            userId: decoded.sub
          });
        }

      } catch (e) {
        localStorage.removeItem("accessToken");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth.token) return;

    const decoded = jwtDecode(auth.token);
    const expTime = decoded.exp * 1000;
    const now = Date.now();

    const timeout = expTime - now;

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);

  }, [auth.token]);

  const login = (token) => {
    const decoded = jwtDecode(token);

    localStorage.setItem("accessToken", token);

    setAuth({
      token,
      role: decoded.role,
      exp: decoded.exp,
      userId: decoded.sub
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");

    setAuth({
      token: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);