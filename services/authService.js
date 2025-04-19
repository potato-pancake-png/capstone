const crypto = require("crypto");
const {
  findUserByUsernameAndPassword,
  insertUser,
} = require("../models/authModel");

// MD5 해시 생성
function generateMD5Hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

// 로그인 검증
async function validateLogin(username, password, callback) {
  try {
    const hashedPassword = generateMD5Hash(password); // 입력된 비밀번호를 MD5 해시로 변환

    // 모델 호출: 사용자 조회
    const user = await findUserByUsernameAndPassword(username, hashedPassword);

    if (user) {
      // 사용자 인증 성공
      const { id, username } = user;
      callback(null, { isValid: true, id, username }); // 사용자 정보 반환
    } else {
      // 사용자 인증 실패
      callback(null, { isValid: false });
    }
  } catch (err) {
    console.error("❌ 로그인 검증 중 오류 발생:", err.message);
    callback(err, null);
  }
}

// 회원가입 함수
async function signupUser(username, password, email) {
  try {
    const hashedPassword = generateMD5Hash(password); // 비밀번호를 MD5 해시로 변환

    // 모델 호출: 사용자 추가
    const results = await insertUser(username, hashedPassword, email);

    return results; // 성공 시 결과 반환
  } catch (error) {
    console.error("signupUser 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = {
  generateMD5Hash,
  validateLogin,
  signupUser,
};
