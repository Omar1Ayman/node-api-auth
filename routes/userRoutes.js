const {
  uploadPhotoProfile,
  deleteUserCTR,
  getUsersCTR,
  deleteUsersCTR,
  updateUserCTR,
  getUserByIdCTR,
} = require("../controllers/userController");
const photoUpload = require("../middlewares/uploadProfileImage");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verfiyToken,
  verifiyAuthUser,
  verifiyAdmin,
  verifiyAuthUserOrAdmin,
} = require("../middlewares/verfiyToken");

const router = require("express").Router();

router
  .route("/")
  .get(verifiyAdmin, getUsersCTR)
  .delete(verifiyAdmin, deleteUsersCTR);

router
  .route("/:id")
  .delete(validateObjectId, verifiyAuthUserOrAdmin, deleteUserCTR)
  .put(validateObjectId, verifiyAuthUser, updateUserCTR)
  .get(validateObjectId, verfiyToken, getUserByIdCTR);

router
  .route("/profile/profile-photo-upload")
  .post(verfiyToken, photoUpload.single("image"), uploadPhotoProfile);
module.exports = router;
