const express = require("express");
const router = express.Router();
const { getChefs } = require("../controllers/chefsController");

// Route lấy tất cả menu
router.get("/", getChefs);

module.exports = router;
