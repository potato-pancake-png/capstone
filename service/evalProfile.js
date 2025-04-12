const axios = require("axios");

async function evalProfile(birthYear) {
  console.log("요청된 URL:", profileUrl); // 요청된 URL 확인

  try {
    // 나이 계산 (취약한 eval 사용)
    const evalBirthYear = eval("2025 - " + birthYear);
    console.log("계산된 나이:", evalBirthYear); // 계산된 나이 확인
    return { evalBirthYear };
  } catch (error) {
    console.error("evalProfile 중 오류 발생:", error.message);

    // 기본값 반환
    return {
      axiosProfileUrl: {
        url: profileUrl || "http://example.com/default-profile.jpg",
        status: error.response ? error.response.status : 500, // 오류 상태 코드
        headers: error.response ? error.response.headers : {}, // 오류 응답 헤더
      },
      evalBirthYear: 0,
    };
  }
}

module.exports = { evalProfile };
