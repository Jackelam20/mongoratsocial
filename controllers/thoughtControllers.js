const { Thought, User } = require("../models");

// 1. GET all thoughts
const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching thoughts" });
  }
};

// 2. GET a single thought by its _id
const getThoughtById = async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the thought" });
  }
};

// 3. POST to create a new thought
const createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    const thought = new Thought({ thoughtText, username, userId });
    await thought.save();

    // Update the user's thoughts array
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: "Failed to create a new thought" });
  }
};

// 4. PUT to update a thought by its _id
const updateThought = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const updateData = req.body;

  try {
    const thought = await Thought.findByIdAndUpdate(thoughtId, updateData, {
      new: true,
    });
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the thought" });
  }
};

// 5. DELETE to remove a thought by its _id
const deleteThought = async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const thought = await Thought.findByIdAndRemove(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    // Remove the thought from the user's thoughts array
    await User.findOneAndUpdate(
      { thoughts: thoughtId },
      { $pull: { thoughts: thoughtId } },
      { new: true }
    );

    res.json({ message: "Thought deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the thought" });
  }
};
//6. Add reaction
const addReaction = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const { reactionBody, username } = req.body;

  try {
    // Find the thought by thoughtId
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    // Create a new reaction
    const newReaction = {
      reactionBody,
      username,
    };

    // Add the reaction to the thought's reactions array
    thought.reactions.push(newReaction);

    // Save the thought with the new reaction
    await thought.save();

    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a reaction" });
  }
};

// 7. Remove a reaction from a thought
const removeReaction = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionId = req.params.reactionId;

  try {
    // Find the thought by thoughtId
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    // Check if the reactionId exists in the thought's reactions array
    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction._id == reactionId
    );

    if (reactionIndex === -1) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    // Remove the reaction from the thought's reactions array
    thought.reactions.splice(reactionIndex, 1);

    // Save the thought with the removed reaction
    await thought.save();

    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove a reaction" });
  }
};

module.exports = {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
};
