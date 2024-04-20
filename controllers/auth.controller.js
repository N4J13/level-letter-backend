import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwtUtils.js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
  verifyEmailService,
} from "../services/email.services.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const verificationToken = crypto.randomBytes(50).toString("hex");
    const newUser = new User({ username, password, email, verificationToken });
    await newUser.save();
    sendVerificationEmail(email, verificationToken);
    res.json({
      message: "Email successfully send",
      verificationToken: verificationToken,
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
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  const user = await verifyEmailService(token);
  if (!user) {
    return res.status(500).send("Verification Failed");
  }
  const jwttoken = generateToken(user._id);
  res.json({
    message: "Succesfully Registered Customer",
    token: jwttoken,
    userId: user._id,
  });
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      const token = generateToken(user._id);
      if (!user.isVerified) {
        res.json({ message: "Email not verified , Email Sent" });
        return sendVerificationEmail(email, user.verificationToken);
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
};

// Get logged in user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user == null) {
      res.status(404).send("Not found");
    } else {
      res.json({
        status: "success",
        message: "User found",
        data: user,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

// Delete user by id
export const deleteUser = async (req, res) => {
  if (req.params.id != req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const token = crypto.randomBytes(50).toString("hex");
  user.rememberPasswordToken = token;
  await user.save();
  sendForgotPasswordEmail(email, token);
  res.json({ message: "Email sent", token });
}

// Reset password

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ rememberPasswordToken: token });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  user.password = hash;
  user.rememberPasswordToken = null;
  await user.save();
  res.json({ message: "Password reset successfully" });
}
