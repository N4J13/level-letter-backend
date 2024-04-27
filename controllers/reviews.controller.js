import axios from "axios";
import Review from "../models/review.model.js";

// Get Reviews of Game by ID
export const getReviewsOfGameById = async (req, res) => {
  try {
    const gameId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const reviews = await Review.find({ game: gameId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .sort({ date: -1 });
    if (!reviews) {
      return res.status(404).json({ message: "Reviews not found" });
    }
    res.json({
      message: "Reviews found",
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Reviews by User ID
export const getReviewsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const reviews = await Review.find({ user: userId }).populate("game");
    if (!reviews) {
      return res.status(404).json({ message: "Reviews not found" });
    }
    res.json({
      message: "Reviews found",
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Review
export const addReview = async (req, res) => {
  try {
    const { review, rating, game } = req.body;
    const user = req.userId;
    const existingReview = await Review.findOne({ user, game });
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists" });
    }
    const newReview = new Review({
      user,
      game,
      review,
      rating,
    });
    await newReview.save();
    res.json({
      message: "Review added successfully",
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await review.remove();
    res.json({
      message: "Review deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    review.review = req.body.review;
    review.rating = req.body.rating;
    await review.save();
    res.json({
      message: "Review updated successfully",
      data: review,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

