const express = require("express");
const checkSession = require("../middleware/checkSession");
const { evalProfile } = require("../module/evalProfile");
const { addProfile } = require("../module/addProfile");
const { fetchProfileImage } = require("../module/fetchProfileImage");

const router = express.Router();

/* [5] SSRF – Server-Side Request Forgery (A10) 시나리오 구현 */
// 프로필 추가 API
router.post("/", checkSession, async (req, res) => {
  const { profile_url, birth_year } = req.body;

  if (!profile_url || !birth_year) {
    return res
      .status(400)
      .json({ message: "프로필 URL과 태어난 연도는 필수입니다." });
  }

  try {
    // 세션에서 username 가져오기
    const username = req.session.user.username;

    // evalProfile 호출 (나이 계산)
    const { evalBirthYear } = await evalProfile(birth_year);

    // 프로필 데이터 업데이트 (DB에 profile_url, 계산된 생일 저장)
    const results = await addProfile(username, profile_url, evalBirthYear);

    res.status(200).json({
      message: "프로필이 성공적으로 업데이트되었습니다.",
      profile: {
        profile_url,
        birth_year,
      },
    });
  } catch (error) {
    console.error("프로필 업데이트 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 프로필 이미지 미리보기 API
router.post("/preview", async (req, res) => {
  const { url } = req.body;

  try {
    // fetchProfileImage 호출
    const { imageData, contentType } = await fetchProfileImage(url);

    // Content-Type 설정
    res.set("Content-Type", contentType);

    // 이미지 데이터 반환
    res.send(imageData);
  } catch (error) {
    console.error("이미지 가져오기 중 오류 발생:", error.message);
    res
      .status(500)
      .json({ message: "이미지를 가져오는 중 오류가 발생했습니다." });
  }
});

module.exports = router;
