// 의도적인 오류 발생 컨트롤러
function triggerError(req, res) {
  try {
    // 의도적으로 오류 발생
    throw new Error("의도적인 서버 오류입니다.");
  } catch (error) {
    console.error("오류 발생:", error.stack); // 서버 로그에 스택 트레이스 출력
    res.status(500).json({
      message: error.message, // 오류 메시지
      stack: error.stack, // 스택 트레이스
    });
  }
}

module.exports = { triggerError };
