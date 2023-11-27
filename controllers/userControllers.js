const User = require("../models/User");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("thoughts friends");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};


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

const createUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = new User({ username, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      
      res.status(400).json({ error: error.message });
    } else {
      
      res.status(500).json({ error: "Failed to create a new user" });
    }
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body; 

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

const addFriend = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const friendExists = await User.findById(friendId);
    if (!friendExists) {
      return res.status(404).json({ error: "Friend not found" });
    }

  
    user.friends.push(friendId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a friend" });
  }
};

const removeFriend = async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.friends.includes(friendId)) {
      return res
        .status(404)
        .json({ error: "Friend not found in user's friend list" });
    }

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
