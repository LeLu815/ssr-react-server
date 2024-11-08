import express from "express";
import { publicOnlyMiddleware } from "../../middleware";

const rootRouter = express.Router();

rootRouter.route("/join").all(publicOnlyMiddleware).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
