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
    yet: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    owned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    beaten: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    toplay: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dropped: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    playing: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
