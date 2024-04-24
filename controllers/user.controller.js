import List from "../models/list.model.js";
import User from "../models/user.model.js";
import { addByStatus } from "../services/user.services.js";

// Update My Games
export const updateMyGames = async (req, res) => {
  try {
    const { game, status } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    await addByStatus(user, game, status);
    await user.populate(`myGames.${status}`);
    res.json({
      message: "My Games updated successfully",
      status: true,
      data: user.myGames[status],
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

// Get My Games
export const getMyGames = async (req, res) => {
  try {
    const status = req.query.status;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const user = await User.findById(req.userId).populate(`myGames.${status}`);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user.myGames[status]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get List by yser ID
export const getUserList = async (req, res) => {
  try {
    const userID = req.userId;
    const lists = await List.find({ user: userID, isPrivate: true })
      .sort({ date: -1 })
      .populate("games");
    res.json({
      message: "List by ID fetched successfully",
      data: lists,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create List
export const createList = async (req, res) => {
  try {
    const { name, isPrivate, games } = req.body;
    const userID = req.userId;
    const newList = new List({
      name,
      isPrivate,
      games,
      user: userID,
    });
    await newList.save();
    res.json({
      message: "List created successfully",
      data: newList,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update List
export const updateListById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await List.findByIdAndUpdate(
      collectionID,
      req.body
    );
    if (!collection) {
      return res.status(404).json({ message: "List not found" });
    }
    await collection.save();
    res.json({
      message: "List updated successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete List
export const deleteListById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await List.findByIdAndDelete(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({
      message: "List deleted successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Game to List
export const addGameToList = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await List.findById(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "List not found" });
    }
    const gameID = req.body.game;
    if (collection.games.includes(gameID)) {
      return res.status(400).json({ message: "Game already in collection" });
    }
    collection.games.push(gameID);
    collection.save();
    res.json({
      message: "Game added to collection successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove Game from List
export const removeGameFromList = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await List.findById(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "List not found" });
    }
    const gameID = req.body.game;
    if (!collection.games.includes(gameID)) {
      return res.status(400).json({ message: "Game not in collection" });
    }
    collection.games = collection.games.filter((g) => g !== gameID);
    collection.save();
    res.json({
      message: "Game removed from collection successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get List by ID
export const getPrivateListById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await List.findById(collectionID)
      .find({ isPrivate: true })
      .populate("games");
    if (!collection) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({
      message: "List fetched successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
