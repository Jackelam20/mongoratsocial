const { Schema, model } = require("mongoose");

// Define reaction schema
const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280, // Adjust as needed
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => {
      return new Date(timestamp).toLocaleString();
    },
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], // Now it refers to the defined reactionSchema
});

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
