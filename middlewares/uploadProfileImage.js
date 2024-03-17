const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    if (file) {
      const uniqueFilePath =
        new Date().toISOString().replace(/:/g, "-") + file.originalname;
      cb(null, uniqueFilePath);
    } else {
      cb(null, false);
    }
  },
});

const photoUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validate file MIME type to ensure it's an image
    if (file.mimetype.startsWith("image")) {
      cb(null, true); // Allow file upload
    } else {
      cb({ message: "Unsupported file type. Only images are allowed." }, false); // Reject file upload
    }
  },
  limits: { fileSize: 1024 * 1024 }, // Set file size limit to 1 megabyte
});

module.exports = photoUpload;
