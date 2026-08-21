import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

import "./Header.css";
import logo from "../../assets/logo.png";

export default function Header() {

  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  let nickname = "";

  if (auth?.token) {
    const decoded = jwtDecode(auth.token);
    nickname = decoded.nickname;
  }

  const handleLogout = async () => {

    try {
      await apiClient.post("/user/logout");
    } catch (e) {
      console.log(e);
    }

    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (

    <header className="headerContainer">

      {/* 왼쪽 */}
      <div className="leftMenu">

        <Link
          to="/"
          className="logoLink"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="로고"
            className="logo"
          />
        </Link>

        {/* PC 메뉴 */}
        <div className="desktopMenu">

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

      </div>


      {/* PC 오른쪽 메뉴 */}
      <div className="rightMenu desktopMenu">

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


      {/* 모바일 햄버거 버튼 */}
      <button
        className="mobileMenuButton"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="메뉴"
      >
        ☰
      </button>


      {/* 모바일 메뉴 */}
      {menuOpen && (

        <div className="mobileMenu">

          <Link
            to="/commissionList"
            onClick={closeMenu}
          >
            커미션
          </Link>

          <Link
            to="/boards/free"
            onClick={closeMenu}
          >
            게시판
          </Link>

          {auth?.token ? (
            <>

              <Link
                to="/myPage"
                onClick={closeMenu}
              >
                마이페이지
              </Link>

              {auth.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                >
                  관리자
                </Link>
              )}

              <button
                onClick={handleLogout}
              >
                로그아웃
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                onClick={closeMenu}
              >
                로그인
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
              >
                회원가입
              </Link>

            </>
          )}

        </div>

      )}

    </header>
  );
}