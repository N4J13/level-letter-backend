import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile_pic: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  favGames: {
    type: Array,
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rememberPasswordToken: {
    type: String,
    default: null,
  },
  myGames: {
    yet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    owned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    beaten: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    toplay: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    dropped: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    playing: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  verificationToken: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
