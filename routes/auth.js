const express = require("express");
const {
  checkSession,
  login,
  logout,
  signup,
} = require("../controllers/authController");
const checkSessionMiddleware = require("../middleware/checkSession");

const router = express.Router();

// 세션 체크 API
router.post("/check-session", checkSessionMiddleware, checkSession);

// 로그인 API
router.post("/login", login);

// 로그아웃 API
router.post("/logout", checkSessionMiddleware, logout);

// 회원가입 API
router.post("/signup", signup);

module.exports = router;
