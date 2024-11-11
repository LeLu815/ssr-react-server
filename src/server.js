import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import contentRouter from "./routers/contentRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.use(logger);
// 쿠키를 파싱하여 JavaScript 객체로 변환, 서버에서 쿠키를 설정하여 클라이언트에게 전송, 선택적으로 서명된 쿠키를 지원하여 쿠키의 무결성을 보호
app.use(cookieParser());
app.use(express.json()); // JSON 요청을 처리하기 위한 미들웨어 추가
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청을 처리하기 위한 미들웨어 추가

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  // res.header("Access-Control-Allow-Origin","*");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use("/user", userRouter);
app.use("/content", contentRouter);

export default app;
