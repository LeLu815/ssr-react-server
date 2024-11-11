import multer from "multer";
import path from "path";

// 파일을 저장할 디렉토리 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatar/"); // public/avatar 디렉토리에 저장
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});

// 이미지 파일 확인
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("허용되지 않는 파일 형식입니다");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 10000000, // 파일 사이즈 10MB로 제한
  },
});

module.exports = upload;
