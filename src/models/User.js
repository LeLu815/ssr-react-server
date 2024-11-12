import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const User = {
  // 비밀번호 해시 처리 함수
  async hashPassword(password) {
    return await bcrypt.hash(password, 10); // 해시 비용을 10으로 수정
  },

  // 유저 생성 함수
  async createUser(db, userData) {
    const hashedPassword = await this.hashPassword(userData.password); // 비밀번호 해시 처리
    const user = {
      _id: new ObjectId(),
      id: userData.id,
      nickname: userData.nickname,
      password: hashedPassword, // 해시 처리된 비밀번호 저장
      avatarUrl: userData.avatarUrl,
    };

    try {
      // 유저를 데이터베이스에 저장
      const result = await db.collection("users").insertOne(user);

      // 생성된 유저를 조회하여 반환
      const createdUser = await db
        .collection("users")
        .findOne({ _id: result.insertedId });
      return createdUser; // 생성된 유저 반환
    } catch (error) {
      console.error("유저 생성 실패:", error);
      throw new Error("유저 생성에 실패했습니다.");
    }
  },

  // avatarUrl 변경 함수
  async updateAvatarUrl(db, userId, newAvatarUrl) {
    try {
      const result = await db.collection("users").updateOne(
        { id: userId }, // 유저 ID로 검색
        { $set: { avatarUrl: newAvatarUrl } } // 새로운 avatarUrl로 업데이트
      );

      if (result.modifiedCount === 0) {
        throw new Error("유저의 avatarUrl을 업데이트하는 데 실패했습니다.");
      }

      // 업데이트된 유저 정보를 반환
      const updatedUser = await db.collection("users").findOne({ id: userId });
      return updatedUser;
    } catch (error) {
      console.error("avatarUrl 업데이트 실패:", error);
      throw new Error("avatarUrl 업데이트에 실패했습니다.");
    }
  },
};

export default User;
