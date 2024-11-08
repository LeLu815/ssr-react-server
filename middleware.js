export const publicOnlyMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken; // access 쿠키에서 토큰을 가져옵니다.
  const refreshToken = req.cookies.refreshToken; // refresh 쿠키에서 토큰을 가져옵니다.

  if (!accessToken) {
    return next(); // accessToken이 없으면 다음 미들웨어로 이동
  }
  const verificationResult = await verify(accessToken); // accessToken 검증

  if (verificationResult === TOKEN_EXPIRED) {
    // accessToken이 만료된 경우
    if (refreshToken) {
      // refreshToken이 있는 경우, 새로운 accessToken 발급 로직을 추가할 수 있습니다.
      // 예: 새로운 accessToken을 발급받고 쿠키에 저장하거나, 사용자에게 로그인 요구
    }
    return next(); // 만료된 경우에도 다음 미들웨어로 이동
  } else if (verificationResult === TOKEN_INVALID) {
    // accessToken이 유효하지 않은 경우
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }

  // 유효한 accessToken인 경우, 다음 미들웨어로 이동
  return next();
};
