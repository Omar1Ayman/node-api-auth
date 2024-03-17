const Jwt = require("jsonwebtoken");
const ApiError = require("../middlewares/ApiError");
const { User, RegisterValidation, LoginValidation } = require("../models/User");
const bcrypt = require("bcrypt");
/**
 * @desc Register New User
 * @route  /api/auth/register
 * @method POST
 * @access Public
 */

const register = async (req, res, next) => {
  // check error message
  const { error } = RegisterValidation(req.body);
  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  const { username, email, password } = req.body;
  // create user
  const newUser = new User({ username, email, password });
  await newUser.save();

  // return no password
  newUser.password = undefined;

  // generate token
  const token = newUser.generateAuthToken();
  res.status(201).json({ message: "Created user Successfully", token });
};

/**
 * @desc login users
 * @route  /api/auth/logni
 * @method POST
 * @access Public
 */

const login = async (req, res, next) => {
  // check error message
  const { error } = LoginValidation(req.body);
  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  const { email, password } = req.body;
  // check email
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError("this email not found", 404));

  // check password
  const isMatch = await user.ComparePassword(password);
  if (!isMatch) return next(new ApiError("invalid credintials", 404));

  // generate token
  const token = user.generateAuthToken();
  res.status(201).json({ message: "Login Successfully", token });
};

module.exports = { register, login };
