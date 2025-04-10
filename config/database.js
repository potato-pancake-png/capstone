const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost", // MySQL 서버 호스트
  user: "root", // MySQL 사용자 이름
  password: process.env.DB_PASSWORD, // MySQL 비밀번호
  database: process.env.DB_NAME, // 사용할 데이터베이스 이름
  port: process.env.DB_PORT, // MySQL 포트
});

module.exports = connection;
