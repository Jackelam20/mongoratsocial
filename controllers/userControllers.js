const User = require("../models/User");

// 1. GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("thoughts friends");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// 2. GET a single user by its _id and populate thoughts and friends
const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("thoughts friends");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

// 3. POST a new user
const createUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = new User({ username, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation errors
      res.status(400).json({ error: error.message });
    } else {
      // Handle other errors
      res.status(500).json({ error: "Failed to create a new user" });
    }
  }
};

// 4. PUT to update a user by its ID
const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body; // Assuming you provide the data to update in the request body

  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user" });
  }
};

// 5. DELETE to remove a user by its _id
const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the user" });
  }
};

// 6. POST to add a new friend to a user's friend list
const addFriend = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the friendId exists or handle any validation as needed
    const friendExists = await User.findById(friendId);
    if (!friendExists) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Add the friendId to the user's friend list
    user.friends.push(friendId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a friend" });
  }
};

// 7. DELETE to remove a friend from a user's friend list
const removeFriend = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the friendId is in the user's friend list
    if (!user.friends.includes(friendId)) {
      return res
        .status(404)
        .json({ error: "Friend not found in user's friend list" });
    }

    // Remove the friendId from the user's friend list
    user.friends.pull(friendId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove a friend" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};
