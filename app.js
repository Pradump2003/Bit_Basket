require("dotenv").config();
const express = require("express");
const error = require("./src/middlewares/error.middlewares");
const cookieParser = require("cookie-parser");
const path = require("path");
const { seedAdmin } = require("./seedData/adminSeed");

// console.log(process.argv);

if (process.argv[2] === "seed") {
  seedAdmin();
}

const userRoutes = require("./src/routes/user/user.routes");
const productRoutes = require("./src/routes/admin/product.routes");
const {
  authenticate,
  authorization,
} = require("./src/middlewares/auth.middlewares");
const shopCartRoutes = require("./src/routes/shop/cart.routes");
const addressRoutes = require("./src/routes/shop/address.routes");

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/products", authenticate, authorization, productRoutes);
app.use("/api/v1/shop/cart", authenticate, shopCartRoutes);
app.use("/api/v1/shop/address", authenticate, addressRoutes);

app.use(error);

module.exports = app;
