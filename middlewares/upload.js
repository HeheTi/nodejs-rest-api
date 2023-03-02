const multer = require("multer");
const path = require("path");

const tmpDis = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDis,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

module.exports = upload;
