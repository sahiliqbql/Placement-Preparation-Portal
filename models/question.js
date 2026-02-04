const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  leetcode: String,
  gfg: String,
  codeforces: String
});

module.exports = mongoose.model("Question", questionSchema);
