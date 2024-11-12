import express from "express";
import {
  getTestCookie,
  getUser,
  postJoin,
  postLogin,
  postLogout,
  postRefresh,
  postUploadAvatar,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  upload,
} from "../middleware";

const userRouter = express.Router();

userRouter.route("/info").all(protectorMiddleware).get(getUser);
userRouter.route("/join").all(publicOnlyMiddleware).post(postJoin);
userRouter.route("/login").all(publicOnlyMiddleware).post(postLogin);
userRouter.route("/logout").all(publicOnlyMiddleware).post(postLogout);
userRouter
  .route("/avatar")
  .all(protectorMiddleware)
  .post(upload.single("avatar"), postUploadAvatar);
userRouter.route("/cookie").get(getTestCookie);
userRouter.route("/refresh").post(postRefresh);

export default userRouter;
