const router = require("express").Router();
const {
  register,
  login,
  resetPassword,
  sendForgotPasswordLink,
} = require("../controllers/authController");
const { verfiyToken } = require("../middlewares/verfiyToken");

/**
 * @desc Register New User
 * @route  /api/auth/register
 * @method POST
 * @access Public
 */
router.post("/register", register);

/**
 * @desc login users
 * @route  /api/auth/login
 * @method POST
 * @access Public
 */
router.post("/login", login);

module.exports = router;
