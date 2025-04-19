const connectToDatabase = require("../config/database");

// 사용자 이름과 비밀번호로 사용자 조회
async function findUserByUsernameAndPassword(username, hashedPassword) {
  const pool = await connectToDatabase();
  const query =
    "SELECT id, username FROM users WHERE username = ? AND password = ?";
  const [results] = await pool.query(query, [username, hashedPassword]);
  return results[0]; // 첫 번째 결과 반환 (없으면 undefined 반환)
}

// 사용자 생성
async function insertUser(username, hashedPassword, email) {
  const pool = await connectToDatabase();
  const query =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  const [results] = await pool.query(query, [
    username,
    hashedPassword,
    email || null,
  ]);
  return results; // 성공 시 결과 반환
}

module.exports = {
  findUserByUsernameAndPassword,
  insertUser,
};
