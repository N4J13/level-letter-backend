import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
