import axios from "axios";
import "dotenv/config";
import cache from "../config/cache.js";
import { formatDate } from "../utils/utils.js";
import Game from "../models/game.model.js";
import { addGameToDB } from "../services/game.services.js";
import expressAsyncHandler from "express-async-handler";

export const getGamesByCategory = async (req, res) => {
  const category = req.params.category;
  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }
  try {
    if (cache.has(category)) {
      const games = cache.get(category);
      return res.json({
        message: "Games fetched successfully",
        data: games,
      });
    }
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&genres=${category}&d`
    );
    const games = response.data.results;
    if (!games) {
      return res.status(404).json({ message: "Games not found", data: [] });
    }
    cache.set(category, games, 60 * 60 * 24);
    res.json({
      message: "Games fetched successfully",
      data: games,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUpcomingGames = async (req, res) => {
  try {
    const date = new Date();
    const currentDate = formatDate(new Date());
    const endDate = formatDate(new Date(date.setMonth(date.getMonth() + 3)));

    if (cache.has("upcoming")) {
      const games = cache.get("upcoming");
      return res.json({
        message: "Upcoming games fetched successfully",
        data: games,
      });
    }

    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&dates=${currentDate},${endDate}&ordering=-added`
    );
    const games = response.data.results;
    if (!games) {
      return res.status(404).json({ message: "Games not found", data: [] });
    }
    cache.set("upcoming", games, 60 * 60 * 24);
    res.json({
      message: "Upcoming games fetched successfully",
      data: games,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong");
  }
};

export const getPopularGames = async (req, res) => {
  const currentDate = formatDate(new Date());
  const lastYear = formatDate(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  );

  try {
    if (cache.has("popular")) {
      const games = cache.get("popular");
      return res.json({
        message: "Popular games fetched successfully",
        data: games,
      });
    }

    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&dates=${lastYear},${currentDate}&ordering=-rating`
    );
    const games = response.data.results;
    if (!games) {
      return res.status(404).json({ message: "Games not found", data: [] });
    }
    cache.set("popular", games, 60 * 60 * 24);
    res.json({
      message: "Popular games fetched successfully",
      data: games,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong");
  }
};

export const gameSearch = async (req, res) => {
  const search = req.query.search;
  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${search}`
    );
    const games = response.data.results;
    if (!games) {
      return res.status(404).json({ message: "Games not found", data: [] });
    }
    res.json({
      message: "Games fetched successfully",
      data: games,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGameById = expressAsyncHandler(async (req, res) => {
  const gameId = req.params.id;

  // Check if gameId exists
  if (!gameId) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  // Attempt to retrieve game from cache
  const cachedGame = cache.get(gameId);
  if (cachedGame) {
    return res.json({
      message: "Game fetched successfully from cache",
      data: cachedGame,
    });
  }

  try {
    // Find game in the database
    let game = await Game.findOne({ gameId: gameId });

    // If game doesn't exist in the database, add it
    if (!game) {
      await addGameToDB(gameId);
      game = await Game.findOne({ gameId: gameId });
    }

    // If game still doesn't exist, return 404
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Set the game in cache
    cache.set(gameId, game, 60 * 60 * 24 * 7);

    // Return the game data
    return res.json({
      message: "Game fetched successfully",
      data: game,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ message: "Internal server error" });
  }
});
