const express = require("express");
const { validateLogin } = require("../service/loginValidation");
const { signupUser } = require("../service/signup");
const checkSession = require("../middleware/checkSession");

const router = express.Router();

// 세션 체크 API
router.post("/check-session", checkSession, (req, res) => {
  const session = req.session; // 세션 정보 가져오기
  const { id, username } = session.user; // 세션에서 id와 username 추출
  res.json({
    loggedIn: true,
    id,
    username, // 사용자 정보 반환
  });
});

/* [4] Insecure Password Storage 시나리오 구현 */
// 로그인 API
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호는 필수입니다." });
  }

  validateLogin(username, password, (err, result) => {
    if (err) {
      console.error("로그인 검증 중 오류:", err);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }

    if (result.isValid) {
      const id = result.id;
      const username = result.username;
      req.session.user = { id, username };

      return res.json({
        message: "로그인 성공!",
        user: username,
        id: id,
      });
    } else {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  });
});

// 로그아웃 API
router.post("/logout", checkSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("로그아웃 중 오류:", err);
      return res
        .status(500)
        .json({ message: "로그아웃 중 오류가 발생했습니다." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 성공!" });
  });
});

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호는 필수입니다." });
  }

  try {
    const results = await signupUser(username, password, email);
    res.status(201).json({
      message: "회원가입이 성공적으로 완료되었습니다.",
      userId: results.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "이미 존재하는 사용자입니다." });
    }
    console.error("회원가입 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
