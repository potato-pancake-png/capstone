const axios = require("axios");

async function fetchProfileImage(profile_url) {
  try {
    // URL에서 이미지 가져오기
    const response = await axios.get(profile_url, {
      responseType: "arraybuffer", // 바이너리 데이터로 가져오기
    });

    // 이미지 데이터와 Content-Type 추출
    const imageData = response.data; // 이미지 바이너리 데이터
    const contentType = response.headers["content-type"];

    return { imageData, contentType };
  } catch (error) {
    console.error("fetchProfileImage 중 오류 발생:", error.message);
    throw error; // 호출한 곳으로 에러 전달
  }
}

module.exports = { fetchProfileImage };
