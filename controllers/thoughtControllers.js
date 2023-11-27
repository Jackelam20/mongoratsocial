const { Thought, User } = require("../models");

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

const createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    const thought = new Thought({ thoughtText, username, userId });
    await thought.save();

  
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


const deleteThought = async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const thought = await Thought.findByIdAndRemove(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

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

const addReaction = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const { reactionBody, username } = req.body;

  try {
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

  
    const newReaction = {
      reactionBody,
      username,
    };

    
    thought.reactions.push(newReaction);

    
    await thought.save();

    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a reaction" });
  }
};


const removeReaction = async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionId = req.params.reactionId;

  try {
   
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    
    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction._id == reactionId
    );

    if (reactionIndex === -1) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    
    thought.reactions.splice(reactionIndex, 1);

   
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
