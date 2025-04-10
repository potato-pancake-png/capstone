const express = require("express");
const { signupUser } = require("./service/signup");
const { validateLogin } = require("./service/loginValidation");
const app = express();
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 암호화 키
    resave: false, // 세션을 항상 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
    cookie: { secure: false }, // HTTPS가 아닌 경우 false로 설정
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버에 요청이 들어올 때마다 로그를 출력
app.use((req, res, next) => {
  console.log({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
  });
  next(); // 다음 미들웨어 또는 라우트로 요청 전달
});

// 회원가입 요청
app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;

  signupUser(username, password, email, (err, results) => {
    if (err) {
      console.error("Error during user registration:", err);
      return res.status(500).send("Internal Server Error"); // HTTP 500 반환
    }
    console.log("삽입된 사용자 ID:", results.insertId);
    res.send(`
      <script>
        alert("회원가입 성공!");
        window.location.href = "/login";
      </script>
    `);
  });
});

// 로그인 요청
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  validateLogin(username, password, (err, isValid) => {
    if (err) {
      console.error("Error during login validation:", err);
      return res.status(500).send("Internal Server Error"); // HTTP 500 반환
    }
    if (isValid) {
      res.status(200).send("로그인 성공!"); // HTTP 200 반환
    } else {
      res.status(401).send("로그인 실패!"); // HTTP 401 반환
    }
  });
});

// 로그인 라우트
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "login.html"));
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "signup.html"));
});
// 홈페이지 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

module.exports = app;
