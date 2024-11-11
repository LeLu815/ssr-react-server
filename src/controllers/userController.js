import bcrypt from "bcrypt";
import { connectToDatabase } from "../db";
import User from "../models/User";
import { ACCESS_TOKEN, REFRESH_TOKEN, sign, verify } from "../modules/jwt";

// 토큰 생성 및 쿠키 설정 함수
const setTokensInCookies = async (res, user) => {
  const newAccessToken = await sign(user, ACCESS_TOKEN); // 엑세스 토큰 생성 함수
  const newRefreshToken = await sign(user, REFRESH_TOKEN); // 리프레시 토큰 생성 함수

  res.cookie(ACCESS_TOKEN, newAccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15분
  });
  res.cookie(REFRESH_TOKEN, newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2일
  });
};

// 회원가입 로직
export const postJoin = async (req, res) => {
  const db = await connectToDatabase();
  const { id, nickname, password } = req.body;

  // 필수 데이터 검증
  if (!id || !nickname || !password) {
    return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
  }

  const userData = {
    id,
    nickname,
    password,
    avatarUrl: null,
  };
  const user = await User.createUser(db, userData);
  // 비밀번호를 제외한 유저 객체 반환
  const { password: notHashedPassword, ...userResponse } = user;

  // 생성 전에 클라이언트 쿠키에서 토큰 제거
  res.clearCookie(ACCESS_TOKEN);
  res.clearCookie(REFRESH_TOKEN);
  // 쿠키에 새로운 토큰 저장
  await setTokensInCookies(res, user);
  // 응답 전송
  return res.status(201).json(userResponse);
};

// 로그인 로직
export const postLogin = async (req, res) => {
  const db = await connectToDatabase();
  const col = db.collection("users");
  const { id, password } = req.body;

  // 필수 데이터 검증
  if (!id || !password) {
    return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
  }

  // 패스워드 해쉬
  const hashedPassword = await User.hashPassword(password);
  // 유저 아이디로 유저 찾아서 비밀번호 비교
  const user = await col.findOne({ id });
  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    return res.status(400).json({ message: "비밀번호가 다릅니다." });
  }

  // 생성 전에 클라이언트 쿠키에서 토큰 제거
  res.clearCookie(ACCESS_TOKEN);
  res.clearCookie(REFRESH_TOKEN);
  // 쿠키에 새로운 토큰 저장
  await setTokensInCookies(res, user);
  return res.status(200).json({ message: "로그인 성공!" });
};

// 로그아웃
export const postLogout = (req, res) => {
  try {
    // 클라이언트 쿠키에서 토큰 제거
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);

    return res.status(200).json({ message: "로그아웃 성공!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "로그아웃 중 오류가 발생했습니다." });
  }
};

export const getTestCookie = async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN]; // 쿠키에서 리프레시 토큰 가져오기
  return res.status(200).json({ cookie: refreshToken, cookies: req.cookies });
};

// 리프레시 토큰을 통한 엑세스, 리프레시 새로 발급
export const postRefresh = async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN]; // 쿠키에서 리프레시 토큰 가져오기

  console.log(req.cookies, req.cookies[REFRESH_TOKEN]);

  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 없습니다." });
  }

  // 리프레시 검증
  const verificationResult = await verify(refreshToken); // 리프레시 토큰 검증 함수 (예: JWT 사용)

  if (typeof verificationResult === "number") {
    return res
      .status(403)
      .json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }
  // payload에서 사용자 정보를 추출
  const user = {
    id: verificationResult.idx, // idx를 사용자 ID로 사용
    nickname: verificationResult.email, // email을 사용자 닉네임으로 사용
  };

  // 생성 전에 클라이언트 쿠키에서 토큰 제거
  res.clearCookie(ACCESS_TOKEN);
  res.clearCookie(REFRESH_TOKEN);

  // 쿠키에 새로운 토큰 저장
  await setTokensInCookies(res, user); // 사용자 정보를 전달

  return res.status(200).json({ message: "토큰 재발급에 성공했습니다." });
};

// // 유저 프로필 저장 로직
// export const postUploadAvatar = async (req, res) => {
//   const accessToken = req.cookies[ACCESS_TOKEN]; // access 쿠키에서 토큰을 가져옵니다.
//   const verificationResult = await verify(accessToken); // 리프레시 토큰 검증 함수 (예: JWT 사용)
//   // payload에서 사용자 정보를 추출
//   const user = {
//     id: verificationResult.idx, // idx를 사용자 ID로 사용
//     nickname: verificationResult.email, // email을 사용자 닉네임으로 사용
//   };

//   const uploadMiddleware = upload.single("avatar");
//   uploadMiddleware(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: "파일 업로드 실패" });
//     }
// }
// // 이미지 파일이 업로드된 경우
// if (req.file) {
//   const avatarUrl = `/avatars/${req.file.filename}`; // 저장된 이미지 경로 설정
//   await updateUser(db, user.id, { avatarUrl }); // 유저 프로필 업데이트
// }

// 쿠키에 새로운 토큰 저장
// setTokensInCookies(res, user.id);
// };
