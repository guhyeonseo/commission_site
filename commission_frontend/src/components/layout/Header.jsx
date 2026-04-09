import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

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
    } catch (e) {}

    logout(); 
    navigate("/login"); 
  };

  return (
    <div>
      <h2>사이트</h2>

      {auth.token ? (
        <>
          <span>{nickname}님</span>
          <button onClick={() => navigate("/create")}>등록</button>
          <button onClick={() => navigate("/commissionList")}>
            커미션 목록
          </button>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <a href="/">홈 </a>
          <a href="/login">로그인 </a>
          <a href="/register">회원가입</a>
        </>
      )}
    </div>
  );
};

export default Header;