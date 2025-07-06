const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http"); // Tambahkan ini
const socketIO = require("socket.io"); // Tambahkan ini
const curtainRoutes = require("./routes/curtain");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app); // Ubah jadi pakai http server
const io = socketIO(server, {
  cors: {
    origin: "*", // Bisa kamu batasi kalau mau
  },
});

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware supaya controller bisa akses io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Gunakan route curtain
app.use("/api", curtainRoutes);

// Saat client tersambung
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Kirim status awal tirai saat client tersambung
  const statusFile = path.join(__dirname, "./data/status.json");
  if (fs.existsSync(statusFile)) {
    const status = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    socket.emit("status-update", status);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Jalankan server pakai http server
server.listen(PORT, () => {
  console.log(`Backend Smart Curtain berjalan di http://localhost:${PORT}`);
});
