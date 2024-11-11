import { sign as _sign, verify as _verify } from "jsonwebtoken";
export const TOKEN_EXPIRED = -3;
export const TOKEN_INVALID = -2;
export const ACCESS_TOKEN = "accesstoken";
export const REFRESH_TOKEN = "refreshtoken";

// 생성하기
export async function sign(user, type) {
  /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
  const payload = {
    idx: user.id,
    email: user.nickname,
  };
  const tokenOptions = {
    algorithm: process.env.ALGORITHM,
    issuer: process.env.ISSUER, // 발행자
  };
  // 타입에 따라 만료 시간을 설정
  if (type === ACCESS_TOKEN) {
    tokenOptions.expiresIn = "20m"; // 엑세스 토큰 유효 기간
  } else if (type === REFRESH_TOKEN) {
    tokenOptions.expiresIn = "2d"; // 리프레시 토큰 유효 기간
  }
  const token = _sign(payload, process.env.SECRET_KEY, tokenOptions);
  console.log("sign token:", token);
  return token;
}

// 검증하기
export async function verify(token) {
  let decoded;
  try {
    // verify를 통해 값 decode!
    decoded = _verify(token, process.env.SECRET_KEY);
  } catch (err) {
    if (err.message === "jwt expired") {
      return TOKEN_EXPIRED;
    } else if (err.message === "invalid token") {
      return TOKEN_INVALID;
    } else {
      // 이외의 에러
      return TOKEN_INVALID;
    }
  }
  return decoded;
}
