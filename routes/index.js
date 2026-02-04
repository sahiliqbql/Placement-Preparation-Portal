const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Solved = require("../models/solved");
const User = require("../models/user");
const isLoggedIn = require("../middleware/isLoggedIn");

const multer = require("multer");
const path = require("path");

// Home page -> show login
router.get("/", (req, res) => {
  res.render("login");
});

// Dashboard (after login)
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    res.render("dashboard", { user });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Something went wrong!" });
  }
});

// Company list page
router.get("/companies", isLoggedIn, async (req, res) => {
  try {
    const companies = await Question.distinct("company");
    res.render("companies", { companies });
  } catch (err) {
    console.error(err);
    res.send("Error loading companies");
  }
});

router.get("/companies/:company", isLoggedIn, async (req, res) => {
  try {
    const companyName = req.params.company;

    const questions = await Question.find({
      company: new RegExp(`^${companyName}$`, "i"),
    });

    res.render("companyQuestions", {
      company: companyName,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading questions");
  }
});

// sort companies name wise
router.get("/companies", isLoggedIn, async (req, res) => {
  try {
    let companies = await Question.distinct("company");

    // sort alphabetically (A → Z)
    companies.sort((a, b) => a.localeCompare(b));

    res.render("companies", { companies });
  } catch (err) {
    console.error(err);
    res.send("Error loading companies");
  }
});

// Resume Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// GET Resume Page
router.get("/resume", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render("resume", { resumePath: user?.resume || null });
  } catch (err) {
    console.error(err);
    res.send("Error loading resume page");
  }
});

// POST Upload Resume
router.post("/resume", isLoggedIn, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.send("Only PDF files are allowed");

    await User.findByIdAndUpdate(req.session.userId, { resume: req.file.path });

    // redirect so GET will render with updated resume
    res.redirect("/resume");
  } catch (err) {
    console.error(err);
    res.send("Resume upload failed");
  }
});

module.exports = router;
