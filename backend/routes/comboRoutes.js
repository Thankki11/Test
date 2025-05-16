const express = require("express");
const router = express.Router();
const multer = require("multer");
const comboController = require("../controllers/comboController");

const upload = multer({
  dest: "../uploads/temp",
  limits: {
    fileSize: 25 * 1024 * 1024, // Giới hạn 25MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.post("/", upload.single("image"), comboController.createCombo);
router.get("/", comboController.getCombos);

module.exports = router;
