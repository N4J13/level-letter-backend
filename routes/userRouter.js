import express from "express";
import User from "../models/user.js";
import { ROOT_PATH } from "../config.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/jwtUtils.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { sendEmail, verifyEmail } from "../utils/verifyEmail.js";

const router = express.Router();

const uploadDir = path.join(ROOT_PATH, "public/uploads/user");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.id;
    const userDir = path.join(uploadDir, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `profile_pic${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const verificationToken = crypto.randomBytes(50).toString("hex");
    const newUser = new User({ username, password, email, verificationToken });
    await newUser.save();
    sendEmail(email, verificationToken);
    res.json({
      message: "Email successfully send",
      verificationToken : verificationToken
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      res.status(400).json({ message: "Username already exists" });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email
    ) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// verify
router.post("/verify", async (req, res) => {
  const { token } = req.body;
  const user =  await verifyEmail(token);
  if(!user){
    return res.status(500).send("Verification Failed")
  }
  const jwttoken =  generateToken(user._id)
  res.json({
    message : "Succesfully Registered Customer",
    token : jwttoken,
    userId : user._id
  })
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const passwordMatched = bcrypt.compare(password, user.password);
    if (passwordMatched) {
      const token = generateToken(user._id);
      if(!user.isVerified){
        return sendEmail(email, user.verificationToken);
      }
      res.json({
        message: "Succesfully Logged in",
        token: token,
        userId: user._id,
      });
    } else {
      res.json({ message: "Password Doesnt match" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//update profile pic and  username
router.post(
  "/profile/:id",
  authenticateToken,
  upload.single("profile"),
  async (req, res) => {
    try {
      const { username } = req.body;
      if (req.params.id != req.userId) {
        return res.status(500).json({ message: "Invalid user" });
      }
      const profilePic = req.file
        ? path.join(req.params.id, req.file.filename)
        : null;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { profile_pic: profilePic, username: username },
        { new: true }
      );

      res.send(updatedUser);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// Get user
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const users = await User.findById(req.userId);
    if (users == null) {
      res.status(404).send("Not found");
    } else {
      res.json(users);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete user by id
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
});

export default router;
