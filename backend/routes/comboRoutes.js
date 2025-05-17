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

// Route tạo combo
router.post("/", upload.single("image"), comboController.createCombo);

//Route lấy tất cả combo
router.get("/", comboController.getCombos);

// Route lấy combo theo ID
router.get("/:id", comboController.getComboByID);

// Route lấy đánh giá sản phẩm
router.get("/:id/reviews", comboController.getComboReviews);

// Route xóa combo
router.delete("/:id", comboController.deleteCombo);

router.put("/:id", comboController.updateCombo);

module.exports = router;
