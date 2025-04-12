import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Navbar from "../components/Nav";
import axios from "axios"; // Axios 추가

function Profile() {
  const [profileUrl, setProfileUrl] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 상태
  const [loadingPreview, setLoadingPreview] = useState(false); // 미리보기 로딩 상태
  const navigate = useNavigate();

  const handlePreview = async () => {
    if (!profileUrl.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    try {
      setLoadingPreview(true);
      const response = await axios.post("/api/profile/preview", {
        url: profileUrl,
      }); // Axios로 POST 요청
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      }); // Blob 생성
      const objectUrl = URL.createObjectURL(blob); // Blob을 Object URL로 변환
      setPreviewImage(objectUrl); // 미리보기 이미지 URL 설정
    } catch (error) {
      console.error("미리보기 요청 중 오류 발생:", error);
      alert("미리보기 요청 중 오류가 발생했습니다.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileUrl.trim() || !birthYear.trim()) {
      alert("프로필 이미지 URL과 태어난 연도를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/api/profile", {
        profile_url: profileUrl,
        birth_year: birthYear,
      }); // Axios로 POST 요청

      if (response.status === 200) {
        alert("프로필이 성공적으로 저장되었습니다!");
        navigate("/", { replace: true }); // 홈으로 이동
      } else {
        alert("프로필 저장 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("프로필 저장 요청 중 오류 발생:", error);
      alert("프로필 저장 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="profile-main">
        <h1 className="profile-title">프로필 설정</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label htmlFor="profile_url" className="profile-label">
              프로필 이미지 URL
            </label>
            <input
              type="text"
              id="profile_url"
              name="profile_url"
              className="profile-input"
              placeholder="http://example.com/image.jpg"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              required
            />
            <button
              type="button"
              className="profile-preview-button"
              onClick={handlePreview}
            >
              미리보기
            </button>
          </div>

          {/* 미리보기 섹션 */}
          {loadingPreview ? (
            <p>미리보기 로딩 중...</p>
          ) : (
            previewImage && (
              <div className="profile-preview">
                <h2>미리보기</h2>
                <img
                  src={previewImage}
                  alt="미리보기 이미지"
                  className="profile-preview-image"
                />
              </div>
            )
          )}

          <div>
            <label htmlFor="birth_year" className="profile-label">
              태어난 연도
            </label>
            <input
              type="text"
              id="birth_year"
              name="birth_year"
              className="profile-input"
              placeholder="1999"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="profile-button">
            저장
          </button>
        </form>
      </main>
    </div>
  );
}

export default Profile;
