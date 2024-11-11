import multer from "multer";
import { ACCESS_TOKEN } from "./modules/jwt";

export const publicOnlyMiddleware = async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN]; // access 쿠키에서 토큰을 가져옵니다.

  if (!accessToken) {
    return next(); // accessToken이 없으면 다음 미들웨어로 이동
  }
  const verificationResult = await verify(accessToken); // accessToken 검증

  if (typeof verificationResult === "number") {
    // accessToken이 만료된 경우, accessToken이 유효하지 않은 경우 : accessToken을 삭제해주는 로직
    res.clearCookie(ACCESS_TOKEN); // accessToken 쿠키를 삭제합니다.
    return next(); // 만료된 경우에도 다음 미들웨어로 이동
  }

  // 유효한 accessToken인 경우, 로그인된 상태이므로 거부합니다. (403 : 권한거부)
  return res
    .status(403)
    .json({ error: "로그인 상태입니다. 접근이 거부되었습니다." });
};

export const protectorMiddleware = async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN]; // access 쿠키에서 토큰을 가져옵니다.

  if (accessToken) {
    const verificationResult = await verify(accessToken);
    if (!(typeof verificationResult === "number")) {
      // 디코딩이 성공적일경우
      return next();
    }
  }
  return res
    .status(403)
    .json({ error: "로그아웃 상태입니다. 접근이 거부되었습니다." });
};

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatar/"); // public/avatar 디렉토리에 저장
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 파일 이름 설정
  },
});
export const upload = multer({ storage });
