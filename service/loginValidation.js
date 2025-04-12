const crypto = require("crypto");
const connectToDatabase = require("../config/database");

function generateMD5Hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

async function validateLogin(username, password, callback) {
  try {
    const pool = await connectToDatabase();
    const hashedPassword = generateMD5Hash(password); // 입력된 비밀번호를 MD5 해시로 변환

    // 데이터베이스에서 사용자 조회
    const query =
      "SELECT id, username FROM users WHERE username = ? AND password = ?";
    const [results] = await pool.query(query, [username, hashedPassword]);

    if (results.length > 0) {
      // 사용자 인증 성공
      const { id, username } = results[0]; // 첫 번째 결과에서 id와 username 추출
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

module.exports = { generateMD5Hash, validateLogin };
