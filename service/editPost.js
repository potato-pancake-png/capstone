const connectToDatabase = require("../config/database");

async function editPost(post_id, title, content) {
  try {
    const pool = await connectToDatabase();
    const query = "UPDATE articles SET title = ?, content = ? WHERE id = ?";
    const [results] = await pool.query(query, [title, content, post_id]); // Promise 기반 query 호출
    return results; // 결과 반환
  } catch (error) {
    console.error("editPost 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { editPost };
