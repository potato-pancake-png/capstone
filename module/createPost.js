const connection = require("../config/database");

function postCreate(user_id, title, content, callback) {
  const query = "INSERT INTO posts (user_id,title, content) VALUES (?, ?, ?)";
  connection.query(query, [user_id, title, content], (err, results) => {
    if (err) {
      return callback(err, null); // 에러 발생 시 콜백 호출
    }
    callback(null, results); // 성공 시 결과 반환
  });
}

module.exports = { postCreate };
