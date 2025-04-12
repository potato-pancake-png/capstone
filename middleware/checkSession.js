function checkSession(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(403).json({ loggedIn: false });
  }
  next(); // 세션이 유효하면 다음 미들웨어로 이동
}

module.exports = checkSession;
