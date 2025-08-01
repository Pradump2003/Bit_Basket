const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const userCollection = require("../models/user.models");
const ErrorHandler = require("../utils/ErrorHandler.utils");

//& ─── authentication middleware ────────────────────────────────────────────────────────────────
const authenticate = expressAsyncHandler(async (req, res, next) => {
  let token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
  if (!token) return next(new ErrorHandler("You are not logged In", 401));
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // decodedToken = {payload: userID}
  let user = await userCollection.findById(decodedToken.payload);
  if (!user) return next(new ErrorHandler("Invalid token, Login again", 401));
  req.user = user;
  next();
});

//& ─── authorization middleware ────────────────────────────────────────────────────────────────
const authorization = expressAsyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 403)
    );
  }
  next();
});

module.exports = { authenticate, authorization };
