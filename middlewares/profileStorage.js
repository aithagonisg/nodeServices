const multer = require("multer");
const path = require("path");

const profileUpload = (userId) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, userId + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });
  return upload;
};

module.exports = { profileUpload };
