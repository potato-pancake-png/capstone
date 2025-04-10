const { generateMD5Hash } = require("./loginValidation");
const connection = require("../config/database");

// 회원가입 함수
function signupUser(username, password, email, callback) {
  const hashedPassword = generateMD5Hash(password); // 비밀번호를 MD5 해시로 변환

  // 데이터베이스에 사용자 추가
  const query =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  connection.query(
    query,
    [username, hashedPassword, email || null],
    (err, results) => {
      if (err) {
        return callback(err, null); // 에러 발생 시 콜백 호출
      }
      callback(null, results); // 성공 시 결과 반환
    }
  );
}

module.exports = { signupUser };
