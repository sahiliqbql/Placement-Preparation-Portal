const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session FIRST
app.use(session({
  secret: "placement-secret",
  resave: false,
  saveUninitialized: false
}));

// database SECOND
mongoose.connect("mongodb://127.0.0.1:27017/placementPortal")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// routes LAST
app.use("/", indexRouter);
app.use("/users", usersRouter);

const dsaRouter = require("./routes/dsa");
app.use("/dsa", dsaRouter);

const companiesRouter = require("./routes/companies");
app.use("/companies", companiesRouter);


app.use("/uploads", express.static("uploads"));

module.exports = app;
