import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const User = {
  // 유저 생성 함수
  async createUser(db, userData) {
    const user = {
      _id: new ObjectId(),
      id: userData.id,
      nickname: userData.nickname,
      password: userData.password, // 비밀번호는 나중에 해시 처리해야 함
      avatarUrl: userData.avatarUrl,
    };

    // 유저를 데이터베이스에 저장
    const result = await db.collection("users").insertOne(user);
    console.log("유저 생성 결과 :", result);
    return result.ops[0]; // 생성된 유저 반환
  },

  // 비밀번호 해시 처리 함수 (bcrypt 사용)
  async hashPassword(password) {
    return await bcrypt.hash(password, 5);
  },
};

export default User;
