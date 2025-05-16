const express = require("express");
const router = express.Router();
const comboController = require("../controllers/comboController");

router.post("/", comboController.createCombo);
router.get("/", comboController.getCombos);

module.exports = router;