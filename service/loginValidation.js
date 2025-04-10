const crypto = require("crypto");
const connection = require("../config/database");

function generateMD5Hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

function validateLogin(username, password, callback) {
  const hashedPassword = generateMD5Hash(password); // 입력된 비밀번호를 MD5 해시로 변환

  // 데이터베이스에서 사용자 조회
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  connection.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      // 사용자 인증 성공
      callback(null, true);
    } else {
      // 사용자 인증 실패
      callback(null, false);
    }
  });
}

module.exports = { generateMD5Hash, validateLogin };
