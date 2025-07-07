const express = require("express");
const router = express.Router();
const {
  getStatus,
  sendControl,
  resetToAuto,
  updateSchedule
} = require("../controller/curtainController");

router.get("/status", getStatus);        // GET status tirai
router.post("/control", sendControl);    // POST buka/tutup
router.post("/refresh", resetToAuto);    // POST reset ke mode otomatis
router.post("/jadwal", updateSchedule); // POST update jadwal buka/tutup


module.exports = router;
