const express = require("express");
const router = express.Router();
const {
  getStatus,
  sendControl,
  resetToAuto
} = require("../controller/curtainController");

router.get("/status", getStatus);        // GET status tirai
router.post("/control", sendControl);    // POST buka/tutup
router.post("/refresh", resetToAuto);    // POST reset ke mode otomatis

module.exports = router;
