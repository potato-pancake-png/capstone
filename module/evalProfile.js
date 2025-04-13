const axios = require("axios");

async function evalProfile(birthYear) {
  try {
    // 나이 계산 (취약한 eval 사용)
    const evalBirthYear = eval("2025 - " + birthYear);
    console.log("계산된 나이:", evalBirthYear); // 계산된 나이 확인
    return { evalBirthYear }; // 계산된 나이 반환
  } catch (error) {
    console.error("evalProfile 중 오류 발생:", error.message);
  }
}

module.exports = { evalProfile };
