const router = require("express").Router();
const {
  resetPassword,
  sendResetPasswordLink,
  getForgotPasswordView,
  getResetPasswordView,
  ResetPassword,
} = require("../controllers//resetPasswordController");
const { verfiyToken } = require("../middlewares/verfiyToken");

router
  .route("/forgot-password")
  .get(getForgotPasswordView)
  .post(sendResetPasswordLink);

router
  .route("/reset-password/:id/:token")
  .get(getResetPasswordView)
  .post(ResetPassword);
module.exports = router;
