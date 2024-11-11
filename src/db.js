import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
// .env.local 파일을 로드
dotenv.config();

const uri = process.env.DB_URL; // 환경변수에서 DB URL을 가져옵니다.

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("MongoDB에 성공적으로 연결되었습니다.");
    return client.db("ssr-server"); // 사용할 데이터베이스 이름
  } catch (err) {
    console.error(`MongoDB 연결 실패: ${err}`);
    throw err;
  }
}

export { connectToDatabase };
