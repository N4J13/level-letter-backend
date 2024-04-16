import express from "express";
import Game from "../models/game.js";
import { addGame } from "../helpers/addGame.js";

const gameRouter = express.Router();

// Get Game by Object Id
gameRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const game = await Game.findById(id);
    res.json(game);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Get Game by Gameid
gameRouter.get("/gameid/:gameid", async (req, res) => {
  try {
    const gameid = req.params.gameid;
    const game = await Game.findOne({ gameId: gameid });
    if (!game) {
      addGame(gameid);
      game = await Game.findOne({ gameId: gameid });
    }
    res.json(game);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Get all Games
gameRouter.get("/", async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
    }
);

export default gameRouter;
