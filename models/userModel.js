const connectToDatabase = require("../config/database");

// 사용자 이름과 비밀번호로 사용자 조회
async function findUserByUsernameAndPassword(username, hashedPassword) {
  const pool = await connectToDatabase();
  const query =
    "SELECT id, username FROM users WHERE username = ? AND password = ?";
  const [results] = await pool.query(query, [username, hashedPassword]);
  return results[0]; // 첫 번째 결과 반환 (없으면 undefined 반환)
}

// 사용자 프로필 업데이트
async function updateUserProfile(username, profileUrl, birthYear) {
  const pool = await connectToDatabase();

  const query = `
    UPDATE users
    SET profile_url = ?, birth_year = ?
    WHERE username = ?
  `;

  const [results] = await pool.query(query, [profileUrl, birthYear, username]);
  return results; // 성공 시 결과 반환
}

module.exports = {
  findUserByUsernameAndPassword,
  updateUserProfile,
};
