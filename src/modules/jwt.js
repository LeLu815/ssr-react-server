import { sign as _sign, verify as _verify } from "jsonwebtoken";
import { uid } from "rand-token";
export const TOKEN_EXPIRED = -3;
export const TOKEN_INVALID = -2;

// 생성하기
export async function sign(user) {
  /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
  const payload = {
    idx: user.id,
    email: user.nickname,
  };
  const result = {
    //sign메소드를 통해 access token 발급!
    token: _sign(payload, process.env.SECRET_KEY, {
      algorithm: process.env.ALGORITHM,
      expiresIn: "40m", // 토큰 유효 기간
      issuer: process.env.ISSUER, // 발행자
    }),
    refreshToken: uid(256),
  };
  return result;
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
