import axios from "axios";
import Game from "../models/game.model.js";

export const addGameToDB = async (gameId) => {
  const response = await axios.get(
    `https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWG_API_KEY}`
  );
  const game = response.data;
  if (!game) {
    throw new Error("Game not found");
  }
  new Game({
    name: game.name,
    description: game.description,
    gameId: game.id,
    cover: game.background_image,
  }).save();
};
