import React, { useState } from "react";
import "./Signup.css";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/signup", {
        username,
        password,
        email,
      }); // Axios로 POST 요청

      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      if (error.response) {
        console.error("회원가입 실패:", error.response.data);
        alert("회원가입 실패: " + error.response.data.message);
      } else {
        console.error("회원가입 요청 중 오류 발생:", error);
        alert("회원가입 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <Nav />

      <main className="signup-main">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <label htmlFor="username" className="signup-label">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="signup-label">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="signup-label">
              이메일 (선택)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>
        <p className="signup-footer">
          비밀번호는 서버에서 MD5 해시로 저장됩니다.
        </p>
      </main>
    </div>
  );
}

export default Signup;
