import express from "express";
import {
  createCollection,
  getPrivateCollections,
  getMyGames,
  getPrivateCollectionById,
  updateMyGames,
  updateCollectionById,
  deleteCollectionById,
  addGameToCollection,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  addReview,
  deleteReview,
  getReviewsByUserId,
  updateReview,
} from "../controllers/game.controller.js";

const userRouter = express.Router();

// My Games routes
userRouter.get("/mygames", authenticateToken, getMyGames);
userRouter.post("/mygames/update", authenticateToken, updateMyGames);

// Collection routes
userRouter.get("/collections", authenticateToken, getPrivateCollections);
userRouter.post("/collections/", authenticateToken, createCollection);
userRouter.get("/collections/:id", authenticateToken, getPrivateCollectionById);
userRouter.put("/collections/:id", authenticateToken, updateCollectionById);
userRouter.delete("/collections/:id", authenticateToken, deleteCollectionById);
userRouter.post("/collections/addgame", authenticateToken, addGameToCollection);
userRouter.post(
  "/collections/removegame",
  authenticateToken,
  addGameToCollection
);

// Review routes
userRouter.get("/reviews", authenticateToken, getReviewsByUserId);
userRouter.post("/reviews", authenticateToken, addReview);
userRouter.put("/reviews/:id", authenticateToken, updateReview);
userRouter.delete("/reviews/:id", authenticateToken, deleteReview);

export default userRouter;
