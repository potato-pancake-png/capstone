const { generateMD5Hash } = require("./loginValidation");
const connectToDatabase = require("../config/database");

// 회원가입 함수
async function signupUser(username, password, email) {
  try {
    const pool = await connectToDatabase(); // 데이터베이스 연결 풀 가져오기
    const hashedPassword = generateMD5Hash(password); // 비밀번호를 MD5 해시로 변환

    // 데이터베이스에 사용자 추가
    const query =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const [results] = await pool.query(query, [
      username,
      hashedPassword,
      email || null,
    ]);

    return results; // 성공 시 결과 반환
  } catch (error) {
    console.error("signupUser 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { signupUser };
