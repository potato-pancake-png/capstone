const connectToDatabase = require("../config/database");

// 게시글 ID로 검색
async function getPostById(id) {
  const pool = await connectToDatabase();
  const query =
    "SELECT id, username, title, content FROM articles WHERE id = ?";
  const [results] = await pool.query(query, [id]);
  return results[0]; // 첫 번째 결과 반환
}

// 키워드로 게시글 검색
async function getPostsByKeyword(keyword) {
  const pool = await connectToDatabase();
  const query = `SELECT id, username, title, content FROM articles WHERE title LIKE \'%${keyword}%\'`;
  const [results] = await pool.query(query);
  return results;
}

// 게시글 생성
async function insertPost(username, title, content) {
  const pool = await connectToDatabase();
  const query =
    "INSERT INTO articles (username, title, content) VALUES (?, ?, ?)";
  const [results] = await pool.query(query, [username, title, content]);
  return results; // 생성된 게시글 ID 반환
}

// 게시글 수정
async function updatePostById(postId, title, content) {
  const pool = await connectToDatabase();
  const query = "UPDATE articles SET title = ?, content = ? WHERE id = ?";
  const [results] = await pool.query(query, [title, content, postId]);
  return results; // 수정된 행 수 반환
}

// 게시글 삭제
async function deletePostById(postId) {
  const pool = await connectToDatabase();
  const query = "DELETE FROM articles WHERE id = ?";
  const [results] = await pool.query(query, [postId]);
  return results.affectedRows; // 삭제된 행 수 반환
}

// 모든 게시글 조회
async function getAllPosts() {
  const pool = await connectToDatabase();
  const query = "SELECT id, username, content, title FROM articles";
  const [results] = await pool.query(query);
  return results;
}

module.exports = {
  getPostById,
  getPostsByKeyword,
  insertPost,
  updatePostById,
  deletePostById,
  getAllPosts,
};
