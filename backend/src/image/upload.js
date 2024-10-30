// src/image/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Cấu hình multer để lưu trữ tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Đảm bảo thư mục này tồn tại
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// API để upload hình ảnh
router.post("/", upload.array("images", 10), (req, res) => {
  try {
    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;
