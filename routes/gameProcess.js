import User from "../models/user.js";
import Game from "../models/game.js";
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addGame } from "../helpers/addGame.js";
import CustomList from "../models/customList.js";

const gameProcess = express.Router();

// Get Favorite Games
gameProcess.get("/get_fav", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const games = await user.populate("favGames").execPopulate();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add game to favorite list
gameProcess.post("/add_to_fav", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    const gameId = req.body.gameId;
    const game = await Game.findOne({ gameId: gameId });

    // Add game to database if not present
    if (!game) {
      await addGame(gameId);
    }

    // If game is already present in user's favorite list, remove it
    if (user.games.includes(gameId)) {
      user.games.pull(gameId);
      game.favourite = (game.favourite || 0) - 1;
      await game.save();
      await user.save();
      return res.json({ message: "Game removed from favorites" });
    }

    // Add game to user's favorite list
    user.games.push(gameId);
    await user.save();

    // Increment game's favourite count
    if (game) {
      game.favourite = (game.favourite || 0) + 1;
      await game.save();
    }

    res.json({ message: "Game added to favorites" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add game to custom list
gameProcess.post("/create_custom_list", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { listName, games , isPrivate } = req.body;
    const customList = {
      user: userId,
      name: listName,
      isPrivate: isPrivate,
      games: games,
    };
    const gameList = await CustomList.create(customList);
    gameList.save();
    res.json({ message: "Custom List Created", data: gameList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get custom list of a user
gameProcess.get("/get_custom_list", authenticateToken, async (req, res) => {
  const userId = req.userId;
  const customList = await CustomList.find({ user: userId });
  res.json(customList);
});

// Get custom list of a user by id
gameProcess.get("/get_custom_list/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const customList = await CustomList.find({ user: userId })
    .findById(req.params.id)
    .populate("games");
  res.json(customList);
});

// Delete custom list of a user by id
gameProcess.delete(
  "/delete_custom_list/:id",
  authenticateToken,
  async (req, res) => {
    const userId = req.userId;
    const customList = await CustomList.findById(req.params.id);
    if (customList.user == userId) {
      await CustomList.findByIdAndDelete(req.params.id);
      res.json({ message: "Custom List Deleted" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

// Edit custom list of a user by id
gameProcess.put(
  "/edit_custom_list/:id",
  authenticateToken,
  async (req, res) => {
    const userId = req.userId;
    const customList = await CustomList.findById(req.params.id);
    if (customList.user == userId) {
      await CustomList.findByIdAndUpdate(req.params.id, req.body);
      res.json({ message: "Custom List Edited" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

export default gameProcess;
