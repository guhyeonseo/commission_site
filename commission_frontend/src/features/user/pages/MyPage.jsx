import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import { getMyInfo } from "@/features/user/api/userApi";
import {
  getMyInquiries,
  getReceivedInquiries,
} from "@/features/inquiry/api/inquiryApi";

import { useNavigate } from "react-router-dom";

import UserEditForm from "../components/UserEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

export default function MyPage() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myInquiries, setMyInquiries] = useState([]);
  const [receivedInquiries, setReceivedInquiries] = useState([]);
  const [mode, setMode] = useState("view");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUser();
    loadInquiries();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getMyInfo();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadInquiries = async () => {
    try {
      const myData = await getMyInquiries();
      setMyInquiries(myData);

      const receivedData = await getReceivedInquiries();
      setReceivedInquiries(receivedData);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>로딩중...</div>;
  }

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
              (window.location.href = "/buyer/orders")
            }
          >
            내 주문
          </button>

          <button
            onClick={() =>
              (window.location.href = "/artist/orders")
            }
          >
            판매 관리
          </button>

          <button
            onClick={() =>
              (window.location.href = "/my/commissions")
            }
          >
            내 커미션
          </button>

          <br />
          <br />

          <Link to="/my-reviews">
            내가 쓴 리뷰
          </Link>

          <button
            onClick={() =>
              navigate("/chat")
            }
          >
            내 채팅방
          </button>

          <hr />

          <h3>내가 작성한 문의</h3>

          {myInquiries.map((inquiry) => {
            if (inquiry.parentId) return null;

            const reply = myInquiries.find(
              (i) => i.parentId === inquiry.id
            );

            return (
              <div
                key={inquiry.id}
                onClick={() =>
                  navigate(`/commission/${inquiry.commissionId}`)
                }
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <div>
                  <strong>Q.</strong> {inquiry.content}

                  {inquiry.hasReply && (
                    <span style={{ color: "red", marginLeft: "10px" }}>
                      🔴 답변 도착
                    </span>
                  )}
                </div>

                <div>
                  {inquiry.createdAt}
                </div>

                {reply && (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "20px",
                      padding: "10px",
                      background: "#f5f5f5",
                    }}
                  >
                    <strong>A.</strong> {reply.content}
                  </div>
                )}
              </div>
            );
          })}

          <hr />

          <h3>받은 문의</h3>

          {receivedInquiries.length === 0 ? (
            <p>받은 문의가 없습니다.</p>
          ) : (
            receivedInquiries.map((inquiry) => (
              <div
                onClick={() =>
                  navigate(`/commission/${inquiry.commissionId}`)
                }
                key={inquiry.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <div>
                  작성자 : {inquiry.nickname}
                </div>

                <div>{inquiry.content}</div>

                <small>{inquiry.createdAt}</small>
              </div>
            ))
          )}
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