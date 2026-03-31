import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h2>사이트</h2>

      {user ? (
        <>
          <span>{user.nickname}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <>
          <a href="/login">로그인</a>
          <a href="/register">회원가입</a>
        </>
      )}
    </div>
  );
};

export default Header;