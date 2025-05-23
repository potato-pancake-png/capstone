const { validateLogin, signupUser } = require("../services/authService"); // 경로 수정

async function checkSession(req, res) {
  const session = req.session; // 세션 정보 가져오기
  if (!session || !session.user) {
    return res.status(403).json({ loggedIn: false });
  }
  const { id, username } = session.user; // 세션에서 id와 username 추출
  res.json({
    loggedIn: true,
    id,
    username, // 사용자 정보 반환
  });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호는 필수입니다." });
  }

  validateLogin(username, password, (err, result) => {
    if (err) {
      console.error("로그인 검증 중 오류:", err.message);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }

    if (result.isValid) {
      req.session.user = { id: result.id, username: result.username };
      return res.json({ message: "로그인 성공!", user: result.username });
    } else {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  });
}

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("로그아웃 중 오류:", err.message);
      return res
        .status(500)
        .json({ message: "로그아웃 중 오류가 발생했습니다." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 성공!" });
  });
}

async function signup(req, res) {
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
}

module.exports = { checkSession, login, logout, signup };
