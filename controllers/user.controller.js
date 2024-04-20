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

