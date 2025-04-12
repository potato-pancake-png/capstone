const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

let pool;

async function connectToDatabase() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: "root", // MySQL 사용자 이름
        password: process.env.DB_PASSWORD, // MySQL 비밀번호
        database: process.env.DB_NAME, // 사용할 데이터베이스 이름
        port: process.env.DB_PORT || 3306, // MySQL 포트
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("✅ MySQL 데이터베이스에 성공적으로 연결되었습니다.");
    }
    return pool;
  } catch (error) {
    console.error("❌ MySQL 데이터베이스 연결 실패:", error.message);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
}

module.exports = connectToDatabase;
