import express from "express";
import {
  addGameToList,
  createList,
  deleteListById,
  getMyGames,
  getPrivateListById,
  getUserList,
  removeGameFromList,
  updateListById,
  updateMyGames,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  addReview,
  deleteReview,
  getReviewsByUserId,
  updateReview,
} from "../controllers/reviews.controller.js";

const userRouter = express.Router();

// My Games routes
userRouter.get("/mygames", authenticateToken, getMyGames);
userRouter.post("/mygames/update", authenticateToken, updateMyGames);

// Collection routes
userRouter
  .route("/lists")
  .get(authenticateToken, getUserList)
  .post(authenticateToken, createList);

userRouter
  .route("/lists/:id")
  .get(authenticateToken, getPrivateListById)
  .put(authenticateToken, updateListById)
  .delete(authenticateToken, deleteListById);

userRouter.post(
  "/lists/:id/addgame",
  authenticateToken,
  addGameToList
);
userRouter.post(
  "/lists/:id/removegame",
  authenticateToken,
  removeGameFromList
);

// Review routes
userRouter
  .route("/reviews")
  .get(authenticateToken, getReviewsByUserId)
  .post(authenticateToken, addReview);

userRouter
  .route("/reviews/:id")
  .put(authenticateToken, updateReview)
  .delete(authenticateToken, deleteReview);

export default userRouter;
