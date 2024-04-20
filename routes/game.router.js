import express from "express";
import Game from "../models/game.model.js";
import { addGame } from "../helpers/addGame.js";
import { getReviewsOfGameById } from "../controllers/game.controller.js";

const gameRouter = express.Router();

gameRouter.get("/reviews", getReviewsOfGameById);



export default gameRouter;
