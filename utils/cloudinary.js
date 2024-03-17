const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImage = async (fielUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fielUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const res = await cloudinary.uploader.destroy(imagePublicId);
    return res;
  } catch (err) {
    return err;
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
