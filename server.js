// server.js
const express = require("express");
const path = require("path");
const app = express();

// "dist" folder serve karega (frontend build yahan hota hai)
app.use(express.static(path.join(__dirname, "dist")));

// Sab routes ke liye index.html return karega
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Port Glitch khud set karega
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("RTR App running on port", PORT));