const { Router } = require("express");
const {
  getAllUser,
  registerUser,
  loginUser,
  logoutUser,
} = require("../../controllers/user/user.controllers");

const userRoutes = Router();

userRoutes.get("/allUser", getAllUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);

module.exports = userRoutes;
