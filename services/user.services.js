import Game from "../models/game.model.js";

export const addByStatus = async (user, gameId, status) => {
  try {
    const gameData = await Game.findById(gameId);

    const existingIndexInUser = user.myGames[status].indexOf(gameId);
    const existingIndexInGame = gameData.game_status[status].indexOf(user._id);

    if (existingIndexInGame !== -1 && existingIndexInUser !== -1) {
      user.myGames[status].splice(existingIndexInUser, 1);
      gameData.game_status[status].splice(existingIndexInGame, 1);
      await Promise.all([gameData.save(), user.save()]);
      return;
    }

    Object.values(user.myGames).forEach((gamesArray) => {
      const index = gamesArray.indexOf(gameId);
      if (index !== -1) {
        gamesArray.splice(index, 1);
      }
    });

    user.myGames[status].push(gameId);

    Object.keys(gameData.game_status).forEach((key) => {
      const index = gameData.game_status[key].indexOf(user._id);
      if (index !== -1) {
        gameData.game_status[key].splice(index, 1);
      }
    });

    gameData.game_status[status].push(user._id);

    // Save both user and gameData
    await Promise.all([gameData.save(), user.save()]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
