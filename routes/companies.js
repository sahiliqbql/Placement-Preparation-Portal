const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Question = require("../models/question");

/* =========================
   Company List Page
========================= */
router.get("/", isLoggedIn, (req, res) => {
  res.render("companies");
});

/* =========================
   Company Questions Page
========================= */
router.get("/:company", isLoggedIn, async (req, res) => {
  try {
    const companyName = req.params.company;

    const questions = await Question.find({
      company: companyName
    });

    res.render("companyQuestions", {
      company: companyName,
      questions
    });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Something went wrong" });
  }
});

module.exports = router;
