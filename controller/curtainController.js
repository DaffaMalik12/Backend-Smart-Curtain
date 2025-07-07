const fs = require("fs");
const path = require("path");

const statusFile = path.join(__dirname, "../data/status.json");

function readStatus() {
  const data = fs.readFileSync(statusFile, "utf8");
  return JSON.parse(data);
}

function writeStatus(newStatus) {
  fs.writeFileSync(statusFile, JSON.stringify(newStatus, null, 2));
}

// GET status
exports.getStatus = (req, res) => {
  try {
    const status = readStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Gagal membaca status." });
  }
};

// SEND kontrol manual
exports.sendControl = (req, res) => {
  const { action } = req.body;
  if (!["left", "right", "stop"].includes(action)) {
    return res.status(400).json({ error: "Aksi tidak valid." });
  }

  try {
    const status = readStatus();
    status.status = action === "left" ? "menutup" : action === "right" ? "membuka" : "berhenti";
    status.mode = "manual";
    status.last_action = action;
    writeStatus(status);

    // Emit status ke semua client via Socket.IO
    const io = req.io; // didapat dari middleware
    if (io) {
      io.emit("status-update", status);
    }

    res.json({ message: "Perintah diterima.", status });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengirim perintah." });
  }
};

// RESET ke mode auto
exports.resetToAuto = (req, res) => {
  try {
    const status = readStatus();
    status.mode = "auto";
    status.last_action = "reset";
    writeStatus(status);

    // Emit status terbaru
    const io = req.io;
    if (io) {
      io.emit("status-update", status);
    }

    res.json({ message: "Mode otomatis diaktifkan kembali.", status });
  } catch (error) {
    res.status(500).json({ error: "Gagal reset ke mode otomatis." });
  }
};

// Di controller Express.js
exports.updateSchedule = (req, res) => {
  try {
    const { buka, tutup } = req.body;
    const status = readStatus();
    status.jadwal.buka = buka;
    status.jadwal.tutup = tutup;
    writeStatus(status);

    const io = req.io;
    if (io) io.emit("status-update", status);

    res.json({ message: "Jadwal diperbarui.", status });
  } catch (error) {
    res.status(500).json({ error: "Gagal update jadwal." });
  }
};

