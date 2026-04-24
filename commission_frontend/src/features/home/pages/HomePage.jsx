import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

function HomePage() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>메인 페이지</h1>

      {token ? (
        <>
          <p>로그인 상태입니다 👍</p>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}

export default HomePage;