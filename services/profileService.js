const fs = require("fs/promises");
const path = require("path");
const { updateUserProfile } = require("../models/userModel");

// 프로필 URL에서 이미지 가져오기
async function fetchProfileImage(profileUrl) {
  try {
    if (profileUrl.startsWith("file://")) {
      // file:// 경로에서 파일 읽기
      const filePath = profileUrl.replace("file://", "");
      const imageData = await fs.readFile(filePath);
      // 확장자에 따라 Content-Type 지정 (예시)
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".gif") contentType = "image/gif";
      return { imageData, contentType };
    } else {
      // http/https는 axios 사용
      const axios = require("axios");
      const response = await axios.get(profileUrl, {
        responseType: "arraybuffer",
      });
      return {
        imageData: response.data,
        contentType: response.headers["content-type"],
      };
    }
  } catch (error) {
    console.error("fetchProfileImage 중 오류 발생:", error.message);
    throw error; // 호출한 곳으로 에러 전달
  }
}

// 나이 계산
async function evalProfile(birthYear) {
  try {
    const evalBirthYear = eval(`2025 - ${birthYear}`);

    console.log("계산된 나이:", evalBirthYear);
    return { evalBirthYear }; // 계산된 나이 반환
  } catch (error) {
    console.error("evalProfile 중 오류 발생:", error.message);
    throw error; // 호출한 곳으로 에러 전달
  }
}

// 프로필 추가 또는 업데이트
async function addProfile(username, profileUrl, birthYear) {
  try {
    // 모델 호출: 사용자 프로필 업데이트
    const results = await updateUserProfile(username, profileUrl, birthYear);

    if (results.affectedRows === 0) {
      throw new Error("프로필을 업데이트할 사용자를 찾을 수 없습니다.");
    }

    return results; // 성공 시 결과 반환
  } catch (error) {
    console.error("addProfile 중 오류 발생:", error.message);
    throw error; // 호출한 곳으로 에러 전달
  }
}

module.exports = {
  fetchProfileImage,
  evalProfile,
  addProfile,
};
