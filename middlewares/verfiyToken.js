const ApiError = require("./ApiError");
const jwt = require("jsonwebtoken");

const verfiyToken = (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (token) {
    try {
      const Authuser = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🚀 ~ verfiyToken ~ Authuser:", Authuser);
      req.user = Authuser;
      next();
    } catch (err) {
      return next(new ApiError("invalid token", 401));
    }
  } else {
    return next(new ApiError("you must login to access", 401));
  }
};

const verifiyAuthUserOrAdmin = (req, res, next) => {
  verfiyToken(req, res, () => {
    if (req?.user?.id === req.params.id || req?.user?.isAdmin) {
      next();
    } else {
      return next(
        new ApiError("forbidden, you sholud be logn and be auth", 403)
      );
    }
  });
};

const verifiyAuthUser = (req, res, next) => {
  verfiyToken(req, res, () => {
    if (req?.user?.id === req.params.id) {
      next();
    } else {
      return next(
        new ApiError("forbidden, you sholud be logn and be auth", 403)
      );
    }
  });
};

const verifiyAdmin = (req, res, next) => {
  verfiyToken(req, res, () => {
    if (req?.user?.isAdmin) {
      next();
    } else {
      return next(new ApiError("forbidden, you must be an admin", 403));
    }
  });
};

module.exports = {
  verfiyToken,
  verifiyAdmin,
  verifiyAuthUser,
  verifiyAuthUserOrAdmin,
};
