const { User, UpdateValidation } = require("../models/User");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const ApiError = require("../middlewares/ApiError");

/**
 * @desc Get ALl users
 * @route  /api/users/
 * @method GET
 * @access private (only loggedin user)
 */

const getUsersCTR = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(users);
};

/**
 * @desc Get user ById
 * @route  /api/users/:id
 * @method GET
 * @access private (only loggedin user)
 */

const getUserByIdCTR = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    return next(new ApiError("no user found for this id", 404));
  }
  res.status(200).json(user);
};

/**
 * @desc delete user
 * @route  /api/users/:id
 * @method DELETE
 * @access private (only loggedin user)
 */
const deleteUserCTR = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError("no user found for this id", 404));
  }

  // remove user image profile from cloudinary
  await cloudinaryRemoveImage(user.profilePhoto.publicId);

  // finally remove User
  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "deleted user Successfully" });
};

/**
 * @desc delete user
 * @route  /api/users/
 * @method DELETE
 * @access private (only loggedin user)
 */
const deleteUsersCTR = async (req, res, next) => {
  const users = await User.find({});
  users.map(async (user) => {
    // remove user image profile from cloudinary
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  });
  // finally remove User
  await User.deleteMany({});
  res.status(200).json({ message: "deleted aall users Successfully" });
};

/**
 * @desc update user by id
 * @route  /api/users/profle/:id
 * @method PUT
 * @access private (only user himself)
 */

const updateUserCTR = async (req, res, next) => {
  // Validate the request body
  const { error } = UpdateValidation(req.body);
  if (error) {
    return next(new ApiError(`${error.details[0].message}`, 400));
  }

  const { id } = req.params;

  let user = await User.findById(id);
  user = { ...user._doc, ...req.body };
  console.log(user);
  // Hash the password if it's provided
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
  }

  // Update the user in the database
  user = await User.findByIdAndUpdate(id, { $set: user }, { new: true });

  // Send the updated user object as a response
  res.status(200).json({ message: "updated successfully" });
};

/**
 * @desc upload profl photo
 * @route  /api/users/profle/profile-photo-upload
 * @method POST
 * @access private (only loggedin user)
 */
const uploadPhotoProfile = async (req, res, next) => {
  //1-Validation
  if (!req.file) {
    return next(new ApiError(`no file provided`, 404));
  }

  //2-get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  //3-upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  //   console.log(result);

  // 4- get the user from DB
  const user = await User.findById(req.user.id);

  // 5- delete the old profile photo if exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 6- change the platform field in the DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  fs.unlink(imagePath, (err) => {
    if (err) throw err;
  });

  // send respost to client
  res.status(200).json({ message: "Upload photo profile Success!" });
};

module.exports = {
  uploadPhotoProfile,
  deleteUserCTR,
  getUsersCTR,
  deleteUsersCTR,
  updateUserCTR,
  getUserByIdCTR,
};
