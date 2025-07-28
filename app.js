require("dotenv").config();
const express = require("express");
const error = require("./src/middlewares/error.middlewares");
const cookieParser = require("cookie-parser");
const { seedAdmin } = require("./seedData/adminSeed");


console.log(process.argv);

if (process.argv[2] === "seed") {
  seedAdmin();
}

const userRoutes = require("./src/routes/user/user.routes");

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);


app.use(error);

module.exports = app;
