import React, { useState, useContext } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Navbar from "../components/Nav";
import axios from "axios"; // Axios 추가
axios.defaults.headers.common["Content-Type"] = "application/json";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setUser, setUserId } = useContext(AuthContext); // Context에서 상태 업데이트 함수 가져오기
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      }); // Axios로 POST 요청

      setIsLoggedIn(true); // 로그인 상태 업데이트
      setUser(response.data.user); // 사용자 이름 설정
      alert("로그인 성공!");
      navigate("/"); // 홈으로 이동
    } catch (error) {
      if (error.response) {
        console.error("로그인 실패:", error.response.data);
        alert("로그인 실패: " + error.response.data.message);
      } else {
        console.error("로그인 요청 중 오류 발생:", error);
        alert("로그인 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        <h1 className="text-2xl font-semibold text-center">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="login-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-form-button">
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}

export default LoginForm;
