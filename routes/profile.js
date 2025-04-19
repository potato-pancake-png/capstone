const express = require("express");
const checkSession = require("../middleware/checkSession");
const {
  addProfileHandler,
  previewProfileImageHandler,
} = require("../controllers/profileController");

const router = express.Router();

// 프로필 추가 API
router.post("/", checkSession, addProfileHandler);

// 프로필 이미지 미리보기 API
router.post("/preview", previewProfileImageHandler);

module.exports = router;
