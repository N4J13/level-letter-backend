import express from "express";
import { getReviewsOfGameById } from "../controllers/game.controller.js";

const gameRouter = express.Router();



gameRouter.get("/reviews", getReviewsOfGameById);



export default gameRouter;
