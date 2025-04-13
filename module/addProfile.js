const connectToDatabase = require("../config/database");

async function addProfile(username, profileUrl, birthYear) {
  try {
    const pool = await connectToDatabase();

    const query = `
      UPDATE users
      SET profile_url = ?, birth_year = ?
      WHERE username = ?
    `;

    const [results] = await pool.query(query, [
      profileUrl, // 이미지 Content-Type
      birthYear, // 태어난 연도
      username, // 사용자 이름
    ]);

    return results; // 성공 시 결과 반환
  } catch (error) {
    console.error("addProfile 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { addProfile };
