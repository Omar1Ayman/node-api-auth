const Jwt = require("jsonwebtoken");
const ApiError = require("../middlewares/ApiError");
const { User, ResetPassworValidation } = require("../models/User");
const nodemailer = require("nodemailer");

/**
 * @desc forgot password users view
 * @route  /password/forgot-password
 * @method GET
 * @access Public
 */
const getForgotPasswordView = (req, res) => {
  res.render("forgot-password");
};

/**
 * @desc Send reset password Link
 * @route  password/reset-password
 * @method POST
 * @access Public
 */
const sendResetPasswordLink = async (req, res, next) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const secret_key = process.env.JWT_SECRET + user.password;
  const token = Jwt.sign({ email: user.email, id: user.id }, secret_key, {
    expiresIn: "10m",
  });
  const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;
  //   res
  //     .status(200)
  //     .json({ message: "Click on the link", reesetPasswordLink: link });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASS },
  });
  const options = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "reset password",
    html: `<div>
        <h4>Click on the link below to reset password</h4>
        <p>${link}</p>
  </div>`,
  };
  transporter.sendMail(options, (err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent successfully" + success.response);
    }
  });
  res.render("link-send");
};

/**
 * @desc GEt reset password Link
 * @route  /password/reset-password/:id/:token
 * @method GET
 * @access Public
 */
const getResetPasswordView = async (req, res, next) => {
  const { id, token } = req.params;

  // Find the user by id
  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  const secret_key = process.env.JWT_SECRET + user.password;

  Jwt.verify(token, secret_key);
  res.render("reset-password", { email: user.email });
};

/**
 * @desc  reset password Link
 * @route  /password/reset-password/:id/:token
 * @method POST
 * @access Public
 */
const ResetPassword = async (req, res, next) => {
  const { id, token } = req.params;

  // Find the user by id
  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  const secret_key = process.env.JWT_SECRET + user.password;
  Jwt.verify(token, secret_key);
  user.password = req.body.password;
  await user.save();
  res.redirect("success-password");
};

module.exports = {
  sendResetPasswordLink,
  getForgotPasswordView,
  getResetPasswordView,
  ResetPassword,
};
