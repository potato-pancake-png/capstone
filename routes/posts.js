const express = require("express");
const { searchPostById } = require("../module/searchPost");
const { filterPostsByKeyword } = require("../module/filterPost");
const { editPost } = require("../module/editPost");
const { deletePostById } = require("../module/deletePost");
const checkSession = require("../middleware/checkSession");
const connectToDatabase = require("../config/database");

const router = express.Router();

// 게시글 조회 API
router.post("/", async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const query = "SELECT id, username, content, title FROM articles";
    const [results] = await pool.query(query);

    if (results.length === 0) {
      return res.status(200).json({ message: "게시글이 없습니다." });
    }
    res.json({ posts: results });
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
// 게시글 생성 API
router.post("/create", checkSession, async (req, res) => {
  const { username, title, content } = req.body;

  if (!username || !title || !content) {
    return res.status(400).json({
      message: "아이디, 제목, 내용은 필수입니다.",
    });
  } // 아이디, 제목, 내용이 없을 경우 에러 처리

  try {
    const pool = await connectToDatabase();
    const query =
      "INSERT INTO articles (username, title, content) VALUES (?, ?, ?)";
    const [results] = await pool.query(query, [username, title, content]);

    res.status(201).json({
      id: results.insertId,
      username,
      title,
      content,
    });
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/* [1] Broken Access Control 시나리오 구현 */
// 게시글 열람 API
router.get("/:id", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(403).json({ message: "권한이 없습니다. 로그인하세요." });
  }

  const { id } = req.params;

  try {
    const post = await searchPostById(id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }
    res.send({ post });
  } catch (error) {
    console.error("게시글 검색 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 게시글 수정 API
router.post("/:id/edit", checkSession, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const results = await editPost(id, title, content);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }

    res.json({ message: "게시글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 게시글 삭제 API
router.post("/:id/delete", checkSession, async (req, res) => {
  const { id } = req.params;

  try {
    const results = await deletePostById(id);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }

    res.json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/* [2] SQL Injection 시나리오 구현 */
// 게시글 검색 API
router.get("/", async (req, res) => {
  const { search } = req.query; // 쿼리 파라미터에서 검색어 추출

  if (!search) {
    return res.status(400).json({ message: "검색어를 입력하세요." });
  }

  try {
    const posts = await filterPostsByKeyword(search); // 검색 서비스 호출

    if (posts.length === 0) {
      return res.status(404).json({ message: "검색 결과가 없습니다." });
    }

    res.json({ posts }); // 검색 결과 반환
  } catch (error) {
    console.error("게시글 검색 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
