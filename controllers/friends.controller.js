// Get All Friends of User

import User from "../models/user.model";

export const getAllFriends = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate("friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Friends found",
      data: user.friends,
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all friend request
export const getAllFriendRequests = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate("friendRequests");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Friend Requests found",
      data: user.friendRequests,
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// send friend request

export const sendFriendRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already Friends" });
    }
    if (user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: "Request already sent" });
    }
    user.friendRequests.push(friendId);
    friend.friendRequests.push(userId);
    await user.save();
    await friend.save();
    res.json({
      message: "Friend Request Sent",
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// accept friend request
export const acceptFriendRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: "No request found" });
    }
    user.friends.push(friendId);
    friend.friends.push(userId);
    user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
    friend.friendRequests = friend.friendRequests.filter((id) => id !== userId);
    await Promise.all([user.save(), friend.save()]);
    res.json({
      message: "Friend Request Accepted",
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// reject friend request
export const rejectFriendRequest = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: "No request found" });
    }
    user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
    friend.friendRequests = friend.friendRequests.filter((id) => id !== userId);
    await Promise.all([user.save(), friend.save()]);
    res.json({
      message: "Friend Request Rejected",
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// remove friend
export const removeFriend = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Not Friends" });
    }
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== userId);
    await Promise.all([user.save(), friend.save()]);
    res.json({
      message: "Friend Removed",
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get collection of friends
export const getFriendsCollection = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "collection",
        match: { private: false }, // Filter non-private collections
        populate: {
          path: "games",
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Friends Collection",
      data: user.friends,
      status: true,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
