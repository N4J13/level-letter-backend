import Game from "../models/game.js";
import axios from "axios";

export const addGame = async (gameId) => {
  const endpoint = "https://api.rawg.io/api/games/" + gameId;
  const response = await axios.get(endpoint);
  const gamedata = response.data;

  const game = new Game({
    gameId: gamedata.id,
    name: gamedata.name,
    description: gamedata.description,
    cover: gamedata.background_image,
  });

  game.save();
};
