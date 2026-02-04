const mongoose = require("mongoose");

const solvedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  solvedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Solved", solvedSchema);
