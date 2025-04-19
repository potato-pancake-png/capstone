const express = require("express");
const {
  getAllPostsHandler,
  createPostHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
  searchPostsHandler,
} = require("../controllers/postController");
const checkSession = require("../middleware/checkSession");

const router = express.Router();

// 게시글 전체 조회 API
router.post("/fetchposts", getAllPostsHandler);
router.get("/", searchPostsHandler);

// 게시글 생성 API
router.post("/", checkSession, createPostHandler);

// 게시글 열람 API
router.get("/:id", checkSession, getPostByIdHandler);

// 게시글 수정 API
router.post("/:id/edit", checkSession, updatePostHandler);

// 게시글 삭제 API
router.post("/:id/delete", checkSession, deletePostHandler);

// 게시글 검색 API

module.exports = router;
