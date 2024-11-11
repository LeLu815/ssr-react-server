import express from "express";
import { search } from "../controllers/contentController";

const contentRouter = express.Router();

contentRouter.get(`/search`, search);

export default contentRouter;
