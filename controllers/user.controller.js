import Collection from "../models/collection.model.js";
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

// Get Collections
export const getPrivateCollections = async (req, res) => {
  try {
    const userID = req.userId;
    const collections = await Collection.find({ user: userID, isPrivate: true })
      .sort({ date: -1 })
      .populate("games");
    res.json({
      message: "Collections fetched successfully",
      data: collections,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create Collection
export const createCollection = async (req, res) => {
  try {
    const { name, isPrivate, games } = req.body;
    const userID = req.userId;
    const newCollection = new Collection({
      name,
      isPrivate,
      games,
      user: userID,
    });
    await newCollection.save();
    res.json({
      message: "Collection created successfully",
      data: newCollection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Collection
export const updateCollectionById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await Collection.findByIdAndUpdate(
      collectionID,
      req.body
    );
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    await collection.save();
    res.json({
      message: "Collection updated successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Collection
export const deleteCollectionById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await Collection.findByIdAndDelete(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.json({
      message: "Collection deleted successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Game to Collection
export const addGameToCollection = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await Collection.findById(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
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

// Remove Game from Collection
export const removeGameFromCollection = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await Collection.findById(collectionID);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
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

// Get Collection by ID
export const getPrivateCollectionById = async (req, res) => {
  try {
    if (req.userId != req.body.user)
      return res.status(401).json({ message: "Unauthorized" });
    const collectionID = req.params.id;
    const collection = await Collection.findById(collectionID)
      .find({ isPrivate: true })
      .populate("games");
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.json({
      message: "Collection fetched successfully",
      data: collection,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
