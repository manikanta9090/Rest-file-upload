const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const path = require("path");

const router = express.Router();

// 🧱 Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ⚡ Rate Limiter (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "⚠️ Too many requests from this IP. Please try again later."
});

// 🧩 Apply Rate Limiter to all routes
router.use(limiter);

// 📤 File Upload Route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "✅ File uploaded successfully!",
    file: {
      name: req.file.filename,
      path: req.file.path,
      size: req.file.size + " bytes",
      type: req.file.mimetype
    }
  });
});

// 🧾 Simple route to test rate limit
router.get("/status", (req, res) => {
  res.json({ message: "Server running fine ✅" });
});

module.exports = router;
