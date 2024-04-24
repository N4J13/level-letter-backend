import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
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

const List = mongoose.model("List", listSchema);
export default List;
