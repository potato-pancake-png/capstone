const connectToDatabase = require("../config/database");

async function filterPostsByKeyword(search) {
  try {
    const pool = await connectToDatabase();
    const query = `SELECT id, username, title, content FROM articles WHERE title LIKE \'%${search}%\'`;
    const [results] = await pool.query(query); // 검색어를 LIKE 쿼리에 바인딩

    return results; // 검색 결과 반환
  } catch (error) {
    console.error("filterPostsByKeyword 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { filterPostsByKeyword };
