const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

// DSA main page
router.get("/", isLoggedIn, (req, res) => {
  res.render("dsa");
});

// Array notes
router.get("/array", isLoggedIn, (req, res) => {
  res.render("dsa/array");
});

// Linked List notes
router.get("/linked-list", isLoggedIn, (req, res) => {
  res.render("dsa/linkedList");
});

module.exports = router;
