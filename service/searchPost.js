const connectToDatabase = require("../config/database");

async function searchPostById(id) {
  try {
    const pool = await connectToDatabase();
    const query = `SELECT id, username, title, content FROM articles WHERE id = ${id}`;
    const [results] = await pool.query(query);

    if (results.length === 0) {
      return null; // 게시글이 없으면 null 반환
    }

    return results[0]; // 첫 번째 결과 반환
  } catch (error) {
    console.error("searchPostById 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { searchPostById };
