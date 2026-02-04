const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

/* =========================
   SIGNUP
========================= */

// show signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// handle signup form
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.send("All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/users/login");
  } catch (err) {
    console.error("Signup error:", err);
    res.send("Error during signup");
  }
});

/* =========================
   LOGIN
========================= */

// show login page
router.get("/login", (req, res) => {
  res.render("login");
});

// handle login form
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect("/users/login");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/users/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/users/login");
    }

    // store user id in session
    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.send("Login error");
  }
});

/* =========================
   LOGOUT
========================= */

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
});


// upload resume


module.exports = router;
