// @desc this calss s responsibil about operation errors (error tha i can predict)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOpretional = true;
  }
}

module.exports = ApiError;
