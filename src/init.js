import dotenv from "dotenv";
// .env.local 파일을 로드
dotenv.config();

import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`🚀 Server is listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
