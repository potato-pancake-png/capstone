const express = require("express");
const { triggerError } = require("../controllers/errorController");

const router = express.Router();

// 의도적인 오류 발생 API
router.get("/", triggerError);

module.exports = router;
