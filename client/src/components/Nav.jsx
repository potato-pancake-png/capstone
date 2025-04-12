import React, { useContext } from "react";
import "./Nav.css";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가
axios.defaults.headers.common["Content-Type"] = "application/json";

function Nav() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);
  const nav = useNavigate(); // 페이지 이동을 위한 훅

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout"); // Axios로 POST 요청

      // 로그아웃 요청이 완료된 후 상태 업데이트
      setIsLoggedIn(false);
      setUser(null);
      alert("로그아웃되었습니다.");
      nav("/", { replace: true }); // 홈으로 이동
    } catch (error) {
      if (error.response) {
        console.error("로그아웃 실패:", error.response.data);
        alert("로그아웃 실패: " + error.response.data.message);
      } else {
        console.error("로그아웃 요청 중 오류 발생:", error);
        alert("로그아웃 요청 중 오류가 발생했습니다.");
      }
    }
  };

  if (isLoggedIn === null) {
    // 세션 확인 중일 때 아무것도 렌더링하지 않음
    return null;
  }

  return (
    <nav>
      <div className="nav-container">
        <a href="/" className="font-bold text-lg">
          🏠 게시판
        </a>
        <div className="nav-links">
          {isLoggedIn ? (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              로그아웃
            </a>
          ) : (
            <>
              <a href="/login">로그인</a>
              <a href="/signup">회원가입</a>
            </>
          )}
          <a href="/profile">프로필</a>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
