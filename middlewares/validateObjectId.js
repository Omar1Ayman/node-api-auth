const { default: mongoose } = require("mongoose");
const ApiError = require("./ApiError");

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(`This id is invalid ${req.params.id}`, 404));
  }
  next();
};
