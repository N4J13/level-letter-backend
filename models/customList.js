import mongoose from "mongoose";

const customListSchema = new mongoose.Schema({
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

const CustomList = mongoose.model("CustomList", customListSchema);
export default CustomList;
