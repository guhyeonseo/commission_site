import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";

import { getMyInfo } from "@/features/user/api/userApi";
import {
  getMyInquiries,
  getReceivedInquiries,
} from "@/features/inquiry/api/inquiryApi";

import UserEditForm from "../components/UserEditForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

import styles from "./MyPage.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>마이페이지</h1>

      {mode === "view" && (
        <>
          {/* 프로필 */}
          <div className={styles.profileSection}>
            {user.profileImage && (
              <img
                src={`http://localhost:8484${user.profileImage}`}
                alt="프로필"
                className={styles.profileImage}
              />
            )}

            <div className={styles.userInfo}>
              <p>
                <strong>아이디</strong> : {user.username}
              </p>

              <p>
                <strong>닉네임</strong> : {user.nickname}
              </p>

              <p>
                <strong>이메일</strong> : {user.email}
              </p>

              <p>
                <strong>소개</strong> : {user.bio || "소개가 없습니다."}
              </p>

              <div className={styles.buttonGroup}>
                <button
                  className={styles.button}
                  onClick={() => setMode("edit")}
                >
                  회원정보 수정
                </button>

                <button
                  className={styles.button}
                  onClick={() => setMode("password")}
                >
                  비밀번호 변경
                </button>
              </div>
            </div>
          </div>

          {/* 주문/판매 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              주문 / 판매
            </h3>

            <div className={styles.orderButtons}>
              <button
                className={styles.button}
                onClick={() => navigate("/buyer/orders")}
              >
                내 주문
              </button>

              <button
                className={styles.button}
                onClick={() => navigate("/artist/orders")}
              >
                판매 관리
              </button>

              <button
                className={styles.button}
                onClick={() => navigate("/my/commissions")}
              >
                내 커미션
              </button>

              <button
                className={styles.button}
                onClick={() => navigate("/chat")}
              >
                내 채팅방
              </button>
            </div>

            <Link
              to="/my-reviews"
              className={styles.link}
            >
              내가 쓴 리뷰
            </Link>
          </div>

          {/* 내가 작성한 문의 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              내가 작성한 문의
            </h3>

            {myInquiries
              .filter((inquiry) => !inquiry.parentId)
              .map((inquiry) => {
                const reply = myInquiries.find(
                  (i) => i.parentId === inquiry.id
                );

                return (
                  <div
                    key={inquiry.id}
                    className={styles.card}
                    onClick={() =>
                      navigate(
                        `/commission/${inquiry.commissionId}`
                      )
                    }
                  >
                    <div>
                      <strong>Q.</strong>{" "}
                      {inquiry.content}

                      {inquiry.hasReply && (
                        <span className={styles.badge}>
                          🔴 답변 도착
                        </span>
                      )}
                    </div>

                    <small>
                      {inquiry.createdAt}
                    </small>

                    {reply && (
                      <div className={styles.reply}>
                        <strong>A.</strong>{" "}
                        {reply.content}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* 받은 문의 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              받은 문의
            </h3>

            {receivedInquiries.length === 0 ? (
              <p className={styles.empty}>
                받은 문의가 없습니다.
              </p>
            ) : (
              receivedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={styles.card}
                  onClick={() =>
                    navigate(
                      `/commission/${inquiry.commissionId}`
                    )
                  }
                >
                  <div>
                    <strong>작성자</strong> :
                    {" "}
                    {inquiry.nickname}
                  </div>

                  <div>{inquiry.content}</div>

                  <small>
                    {inquiry.createdAt}
                  </small>
                </div>
              ))
            )}
          </div>
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