function requestLogger(req, res, next) {
  console.log("클라이언트 요청:", {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
  });
  next(); // 다음 미들웨어로 요청 전달
}

module.exports = requestLogger;
