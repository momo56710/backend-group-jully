const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fileDest = "uploads";
    if (file.fieldname === "avatar") {
      fileDest = "uploads/users";
    }
    if (!fs.existsSync(fileDest)) {
      // The 'recursive: true' option allows mkdirSync to create nested directories if they do not exist.
      // For example, if 'uploads/users' does not exist, it will create both 'uploads' and 'uploads/users'.
      fs.mkdirSync(fileDest, { recursive: true });
    }
    cb(null, fileDest);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const acceptedImage = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
};

const uplaodImage = multer({
  storage,
  fileFilter: acceptedImage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

const uploadSingleImage = (fieldName) => {
  return uplaodImage.single(fieldName);
};

const uploadMultipleImages = (fieldName, maxCount = 10) => {
  return uplaodImage.array(fieldName, maxCount);
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};
