import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  postRefresh,
  postUploadAvatar,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middleware";

const userRouter = express.Router();

userRouter.route("/join").all(publicOnlyMiddleware).post(postJoin);
userRouter.route("/login").all(publicOnlyMiddleware).post(postLogin);
userRouter.route("/logout").all(publicOnlyMiddleware).post(postLogout);
userRouter.route("/avatar").all(protectorMiddleware).post(postUploadAvatar);
userRouter.route("/refresh").post(postRefresh);

export default userRouter;
