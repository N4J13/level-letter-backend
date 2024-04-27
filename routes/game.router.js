import express from "express";
import { getReviewsOfGameById } from "../controllers/reviews.controller.js";
import {
  gameSearch,
  getGameById,
  getGamesByCategory,
  getPopularGames,
  getUpcomingGames,
} from "../controllers/game.controller.js";
import { getMyGames } from "../controllers/user.controller.js";

const gameRouter = express.Router();

gameRouter.get("/reviews/:id", getReviewsOfGameById);
gameRouter.get("/category/:category", getGamesByCategory);
gameRouter.get("/upcoming", getUpcomingGames);
gameRouter.get("/popular", getPopularGames);
gameRouter.get("/search", gameSearch);
gameRouter.get("/:id", getGameById);

export default gameRouter;
