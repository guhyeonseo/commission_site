import { useEffect, useState } from "react";
import { getMyInfo } from "@/features/user/api/userApi";
import UserEditForm from "../components/UserEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { Link } from "react-router-dom";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit | password

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const data = await getMyInfo();
    setUser(data);
  };

  if (!user) return <div>로딩중...</div>;

  return (
    <div>
      <h1>마이페이지</h1>

      {mode === "view" && (
        <>
          {user.profileImage && (
            <img
              src={`http://localhost:8484${user.profileImage}`}
              alt="프로필"
              width={120}
            />
          )}

          <p>아이디: {user.username}</p>
          <p>닉네임: {user.nickname}</p>
          <p>이메일: {user.email}</p>
          <p>소개: {user.bio}</p>

          <button onClick={() => setMode("edit")}>
            회원정보 수정
          </button>

          <button onClick={() => setMode("password")}>
            비밀번호 변경
          </button>

          <hr />

          <h3>주문 / 판매</h3>

          <button
            onClick={() =>
              window.location.href =
              "/buyer/orders"
            }
          >
            내 주문
          </button>

          <button
            onClick={() =>
              window.location.href =
              "/artist/orders"
            }
          >
            판매 관리
          </button>

          <button
            onClick={() =>
              window.location.href =
              "/my/commissions"
            }
          >
            내 커미션
          </button>

          <Link to="/my-reviews">
            내가 쓴 리뷰
          </Link>

        </>
      )}

      {mode === "edit" && (
        <UserEditForm
          user={user}
          onSuccess={() => {
            setMode("view");
            fetchUser();
          }}
          onCancel={() => setMode("view")}
        />
      )}

      {mode === "password" && (
        <PasswordChangeForm
          onSuccess={() => setMode("view")}
          onCancel={() => setMode("view")}
        />
      )}
    </div>
  );
}