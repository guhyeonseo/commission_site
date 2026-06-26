import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

import "./Header.css";
import logo from "../../assets/logo.png";

export default function Header() {

  const { auth, logout } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  let nickname = "";

  if (auth?.token) {

    const decoded =
      jwtDecode(auth.token);

    nickname =
      decoded.nickname;

  }

  const handleLogout =
    async () => {

      try {

        await apiClient.post(
          "/user/logout"
        );

      } catch (e) {
        console.log(e);
      }

      logout();

      navigate("/login");
    };

  return (

    <header className="headerContainer">

      <div className="leftMenu">

        <Link
          to="/"
          className="logoLink"
        >
          <img
            src={logo}
            alt="로고"
            className="logo"
          />
        </Link>

        <Link
          to="/commissionList"
          className="menuItem"
        >
          커미션
        </Link>

        <Link
          to="/boards/free"
          className="menuItem"
        >
          게시판
        </Link>

      </div>

      <div className="rightMenu">

        {auth?.token ? (
          <>

            <span className="nickname">
              {nickname}님
            </span>

            <Link
              to="/myPage"
              className="menuItem"
            >
              마이페이지
            </Link>

            {auth.role === "ADMIN" && (
              <Link
                to="/admin"
                className="menuItem"
              >
                관리자
              </Link>
            )}

            <button
              className="menuButton"
              onClick={handleLogout}
            >
              로그아웃
            </button>

          </>
        ) : (
          <>

            <Link
              to="/login"
              className="menuItem"
            >
              로그인
            </Link>

            <Link
              to="/register"
              className="menuItem"
            >
              회원가입
            </Link>

          </>
        )}

      </div>

    </header>

  );
}