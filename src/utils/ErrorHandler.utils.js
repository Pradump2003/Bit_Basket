class ErrorHandler extends Error {
  // Error is Built-in in method in js where all error is passed
  constructor(message, statusCode) {
    super(message); // Calls the built-in Error constructor with the message
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); //capture the stack for better debugging
  }
}

module.exports = ErrorHandler;
