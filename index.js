require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ejs = require("ejs");
const bodyparser = require("body-parser");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
// app.set("layout", "./layouts/main");

app.use(
  session({
    secret: "Secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });

app.get("/health", (req, res) => {
  res.send("hello welcome");
});

app.listen(PORT, (req, res) => {
  console.log("server is up and running on PORT", PORT);
});

const authRoutes = require("./routes/Authentication");

const productRoutes = require("./routes/Products");

const PageRoutes = require("./routes/PageRoutes");

app.use("/api", authRoutes);

app.use("/api", productRoutes);

app.use("/api", PageRoutes);
