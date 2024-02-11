import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  gameId: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
    default: null,
  },
  favourite: {
    type: Number,
    default: 0,
  },
  game_status: {
    yet: { type: Number, default: 0 },
    owned: { type: Number, default: 0 },
    beaten: { type: Number, default: 0 },
    toplay: { type: Number, default: 0 },
    dropped: { type: Number, default: 0 },
    playing: { type: Number, default: 0 },
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
