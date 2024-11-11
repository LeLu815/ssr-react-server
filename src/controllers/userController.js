import { connectToDatabase } from "../db";
import { hashPassword } from "../models/User";
import { sign, verify } from "../modules/jwt";

// 토큰 생성 및 쿠키 설정 함수
const setTokensInCookies = async (res, user) => {
  const newAccessToken = await sign(user); // 엑세스 토큰 생성 함수
  const newRefreshToken = await sign(user); // 리프레시 토큰 생성 함수

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15분
  });
  res.cookie("refreshToken", newRefreshToken, {
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

  const hashedPassword = await hashPassword(password);
  const userData = {
    id,
    nickname,
    password: hashedPassword,
    avatarUrl: null,
  };
  const user = await createUser(db, userData);
  // 비밀번호를 제외한 유저 객체 반환
  const { password: notHashedPassword, ...userResponse } = user;

  // 쿠키에 새로운 토큰 저장
  setTokensInCookies(res, user);

  return res.status(201).json(userResponse);
  // return res.status(201).json({ msg: "성공" });
};

// 로그인 로직
export const postLogin = async (req, res) => {
  const db = await connectToDatabase();
  const col = db.collection("users");

  // 패스워드 해쉬
  const hashedPassword = await hashPassword(req.password);
  // 유저 아이디로 유저 찾아서 비밀번호 비교
  const user = await col.findOne({ id: req.id });
  const match = (await user.password) === hashedPassword;

  if (!match) {
    return res.status(400).json({ message: "비밀번호가 다릅니다." });
  }

  // 쿠키에 새로운 토큰 저장
  setTokensInCookies(res, user);

  return res.status(200).json({ message: "로그인 성공!" });
};

// 로그아웃
export const postLogout = () => {
  try {
    // 클라이언트 쿠키에서 토큰 제거
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "로그아웃 성공!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "로그아웃 중 오류가 발생했습니다." });
  }
};

// 리프레시 토큰을 통한 엑세스, 리프레시 새로 발급
export const postRefresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 리프레시 토큰 가져오기

  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 없습니다." });
  }
  // 리프레시 검증
  const verificationResult = await verify(refreshToken); // 리프레시 토큰 검증 함수 (예: JWT 사용)

  if (verificationResult instanceof number) {
    return res
      .status(403)
      .json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }
  // payload에서 사용자 정보를 추출
  const user = {
    id: verificationResult.idx, // idx를 사용자 ID로 사용
    nickname: verificationResult.email, // email을 사용자 닉네임으로 사용
  };

  // 쿠키에 새로운 토큰 저장
  setTokensInCookies(res, user); // 사용자 정보를 전달

  return res.status(200);
};

// 유저 프로필 저장 로직
export const postUploadAvatar = async (req, res) => {};
