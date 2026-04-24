import { useEffect, useState } from "react";
import { getMyInfo } from "@/features/user/api/userApi";
import UserEditForm from "../components/UserEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

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