const {
  getPostById,
  getPostsByKeyword,
  insertPost,
  updatePostById,
  deletePostById,
  getAllPosts,
} = require("../models/postModel");

async function findAllPosts() {
  try {
    const posts = await getAllPosts();
    return posts;
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error.message);
    throw new Error("게시글을 가져오는 중 오류가 발생했습니다.");
  }
}

async function findPostById(id) {
  const post = await getPostById(id);
  if (!post) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  return post;
}

async function searchPosts(keyword) {
  const posts = await getPostsByKeyword(keyword);
  if (posts.length === 0) {
    throw new Error("검색 결과가 없습니다.");
  }
  return posts;
}

async function createPost(username, title, content) {
  return await insertPost(username, title, content);
}

async function editPost(postId, title, content) {
  const affectedRows = await updatePostById(postId, title, content);
  if (affectedRows === 0) {
    throw new Error("수정할 게시글을 찾을 수 없습니다.");
  }
  return affectedRows;
}

async function removePost(postId) {
  const affectedRows = await deletePostById(postId);
  if (affectedRows === 0) {
    throw new Error("삭제할 게시글을 찾을 수 없습니다.");
  }
  return affectedRows;
}

module.exports = {
  findAllPosts,
  findPostById,
  searchPosts,
  createPost,
  editPost,
  removePost,
};
