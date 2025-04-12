const dotenv = require("dotenv");
const session = require("express-session");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const MySQLStore = require("express-mysql-session")(session);
const connectToDatabase = require("./config/database");
const checkSession = require("./middleware/checkSession");
const requestLogger = require("./middleware/requestLogger");
const errorRouter = require("./routes/error");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // React 클라이언트의 주소
  methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
  credentials: true, // 쿠키를 포함한 요청 허용
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(bodyParser.json()); // JSON 요청 본문 파싱
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // 요청 로깅 미들웨어(서버에 클라이언트 요청 정보 기록)

(async () => {
  try {
    // 데이터베이스 연결 초기화
    const pool = await connectToDatabase();
    // MySQL 세션 저장소 설정
    const sessionStore = new MySQLStore({}, pool);
    // 세션 설정
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          secure: false, // HTTPS가 아닌 경우 false
          httpOnly: true,
          maxAge: 1000 * 60 * 60, // 1시간
        },
      })
    );

    // 라우트 연결
    app.use("/api/posts", postsRouter);
    app.use("/api", authRouter);
    app.use("/api/error", errorRouter);
    app.use("/api/profile", profileRouter);

    // 서버 실행
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "client/dist", "index.html"));
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ 서버가 실행 중입니다: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ 서버 초기화 중 오류 발생:", error.message);
    process.exit(1); // 초기화 실패 시 프로세스 종료
  }
})();
