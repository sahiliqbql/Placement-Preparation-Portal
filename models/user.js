const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  solvedQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],

  resume: {
    type: String // file path
  },

  role: {
    type: String,
    default: "user" // user or admin
  }
});

module.exports = mongoose.model("User", userSchema);
