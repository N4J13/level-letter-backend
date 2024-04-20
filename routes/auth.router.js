import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getUser,
  login,
  requestPasswordReset,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/verify_email", verifyEmail);
authRouter.post("/login", login);
authRouter.post("/request_password_reset" , requestPasswordReset)
authRouter.get("/profile", authenticateToken, getUser);
authRouter.delete("/:id", authenticateToken, deleteUser);

export default authRouter;
