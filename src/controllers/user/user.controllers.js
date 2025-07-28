const userCollection = require("../../models/user.models");
const expressAsyncHandler = require("express-async-handler");
const ApiResponse = require("../../utils/ApiResponse.utils");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const generateJWTToken = require("../../utils/jwt.utils");

const getAllUser = expressAsyncHandler(async (req, res) => {
  let users = await userCollection.find();
  if (users.length == 0) {
    new ApiResponse(200, false, "User data is empty").send(res);
  }
  new ApiResponse(200, true, "Users fetched successfully", users).send(res);
});

const registerUser = expressAsyncHandler(async (req, res, next) => {
  let { userName, email, password } = req.body;
  let user = await userCollection.create({ userName, email, password });
  new ApiResponse(201, true, "User Created Successfully", user).send(res);
});

const loginUser = expressAsyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser = await userCollection
    .findOne({ email })
    .select("+password"); // include the password field who is excluded by default
  console.log(existingUser);
  if (!existingUser)
    return next(new ErrorHandler("No account find this email", 404));
  let isMatch = await existingUser.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid Credential", 401));
  let token = await generateJWTToken(existingUser._id);
  console.log(token);
  console.log(process.env.JWT_COOKIE_EXPIRY);

  res.cookie("token", token, {
    maxAge: process.env.JWT_COOKIE_EXPIRY * 60 * 60 * 1000, // Max age in 1 hour
  });
  new ApiResponse(200, true, "User Login Successfully").send(res);
});

const logoutUser = expressAsyncHandler(async (req, res, next) => {
  res.clearCookie("token");
  new ApiResponse(200, true, "Logged out successfully").send(res);
});

module.exports = { getAllUser, registerUser, loginUser, logoutUser };
