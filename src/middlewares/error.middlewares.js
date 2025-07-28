const error = (err, req, res, next) => {
  console.log("Error middleware called ", err);

  //!Validation error if you not write the required field then it happen
  if (err.name === "Validation Error") {
    err.message = Object.values(err.errors)
      .map((err) => err.message)
      .join(", ");
    err.statusCode = 400;
  }

  //! Duplicate Key Error if same email is already present and you write again then this is happen
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue);
    err.message = `Provided ${field} is already in use`;
    err.statusCode = 409; // conflict
  }

  //! when you pass invalid Id format
  if (err.name === "CastError") {
    err.message = "Invalid Id format, please check the id you provided";
    err.statusCode = 400;
  }

  //! When you pass the wrong token
  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid Token ,Please Login again";
    err.statusCode = 401;
  }

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errObject: err,
  });
};

module.exports = error;
