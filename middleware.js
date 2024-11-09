import { TOKEN_EXPIRED, TOKEN_INVALID } from "./modules/jwt";

export const publicOnlyMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken; // access 쿠키에서 토큰을 가져옵니다.
  // const refreshToken = req.cookies.refreshToken; // refresh 쿠키에서 토큰을 가져옵니다.

  if (!accessToken) {
    return next(); // accessToken이 없으면 다음 미들웨어로 이동
  }
  const verificationResult = await verify(accessToken); // accessToken 검증

  if (
    verificationResult === TOKEN_EXPIRED &&
    verificationResult === TOKEN_INVALID
  ) {
    // accessToken이 만료된 경우, accessToken이 유효하지 않은 경우 : accessToken을 삭제해주는 로직
    res.clearCookie("accessToken"); // accessToken 쿠키를 삭제합니다.
    return next(); // 만료된 경우에도 다음 미들웨어로 이동
  }

  // 유효한 accessToken인 경우, 로그인된 상태이므로 거부합니다. (403 : 권한거부)
  return res
    .status(403)
    .json({ error: "로그인 상태입니다. 접근이 거부되었습니다." });
};

export const protectorMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken; // access 쿠키에서 토큰을 가져옵니다.

  if (accessToken) {
    const verificationResult = await verify(accessToken);
    if (!(verificationResult instanceof number)) {
      // 디코딩이 성공적일경우
      return next();
    }
  }
  return res
    .status(403)
    .json({ error: "로그아웃 상태입니다. 접근이 거부되었습니다." });
};
