import express from "express";
import {
  getMyGames,
  updateMyGames,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/mygames", authenticateToken, getMyGames);
userRouter.post("/mygames/update", authenticateToken, updateMyGames);

export default userRouter;
