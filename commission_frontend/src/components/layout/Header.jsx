import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  let nickname = null;

  if (auth.token) {
    const decoded = jwtDecode(auth.token);
    nickname = decoded.nickname;
  }

  return (
    <div>
      <h2>사이트</h2>

      {auth.token ? (
        <>
          <span>{nickname}님</span>
          <button onClick={logout}>로그아웃</button>
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