import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import "./Header.css"
import logo from "../../assets/logo.png";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  let nickname = null;

  if (auth.token) {
    const decoded = jwtDecode(auth.token);
    nickname = decoded.nickname;
  }

  const handleLogout = async () => {
    try {
      await apiClient.post("/user/logout");
    } catch (e) { }

    logout();
    navigate("/login");
  };

  return (
    <div className="headerContainer">

      <div className="headerHome">
        <a href="/">
          <img src={logo} alt="홈" className="logo" />
        </a>
      </div>

      <div className="headerCategory">
        <button onClick={() => navigate("/commissionList")}>
          커미션 목록
        </button>

        {auth.token ? (
          <>
            <span className="nickname">{nickname}님</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <a href="/login">로그인 </a>
            <a href="/register">회원가입</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;