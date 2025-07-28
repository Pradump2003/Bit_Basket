const jwt = require("jsonwebtoken");

const generateJWTToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//{payload : "64abcf3a..." }

module.exports = generateJWTToken;
