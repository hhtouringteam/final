// server.js

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./src/configs/db"); // Kết nối cơ sở dữ liệu
const router = require("./src/routers"); // Định nghĩa các route

const port = process.env.PORT || 5000; // Port cho server (sử dụng từ biến môi trường nếu có)
app.use("/uploads", express.static("uploads"));

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(cors()); // Cho phép các yêu cầu từ frontend (CORS)
app.use(express.json()); // Để parse dữ liệu JSON từ các request
app.use(express.urlencoded({ extended: true })); // Để parse dữ liệu URL-encoded
app.use(express.static(path.join(__dirname, "public"))); // Phục vụ các file tĩnh từ thư mục public
app.use(morgan("combined")); // Sử dụng Morgan để log request

// Routes
router(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
