// middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // store in memory for Cloudinary upload

const upload = multer({
  storage,
  limits: { files: 4 , fileSize: 5 * 1024 * 1024}, // Max 4 images
});

module.exports = upload;
