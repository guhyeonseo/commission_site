import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import "./HomePage.css";

export default function HomePage() {

  const { auth } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  return (

    <div className="homeContainer">

      <section className="heroSection">

        <h1>
          원하는 작업을
          <br />
          쉽고 빠르게 의뢰하세요
        </h1>

        <p>
          일러스트, 디자인, 웹 개발,
          번역 등 다양한 커미션을
          만나보세요.
        </p>

        <div className="heroButtons">

          <button
            onClick={() =>
              navigate("/commissionList")
            }
          >
            커미션 둘러보기
          </button>

          {!auth?.token && (

            <button
              onClick={() =>
                navigate("/register")
              }
            >
              회원가입
            </button>

          )}

        </div>

      </section>

      <section className="featureSection">

        <div className="featureCard">
          <h3>🎨 다양한 분야</h3>
          <p>
            일러스트, 디자인,
            개발, 번역 등
            다양한 서비스를 제공합니다.
          </p>
        </div>

        <div className="featureCard">
          <h3>💬 실시간 채팅</h3>
          <p>
            의뢰 전 판매자와
            자유롭게 상담할 수 있습니다.
          </p>
        </div>

        <div className="featureCard">
          <h3>⭐ 리뷰 시스템</h3>
          <p>
            실제 이용자의 리뷰를
            확인하고 선택하세요.
          </p>
        </div>

      </section>

    </div>

  );

}