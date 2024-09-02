const multer = require("multer");
const path = require("path");

const profileUpload = (userId) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file);
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, userId + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });
  return upload;
};

module.exports = { profileUpload };
