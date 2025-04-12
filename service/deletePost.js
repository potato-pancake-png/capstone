const connectToDatabase = require("../config/database");

async function deletePostById(postId) {
  try {
    const pool = await connectToDatabase();
    const query = "DELETE FROM articles WHERE id = ?";
    const [results] = await pool.query(query, [postId]); // Prepared Statement 사용
    return results; // 삭제 결과 반환
  } catch (error) {
    console.error("deletePostById 중 오류 발생:", error.message);
    throw error; // 에러를 호출한 곳으로 전달
  }
}

module.exports = { deletePostById };
