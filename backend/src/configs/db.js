const mongoose = require("mongoose");
require("dotenv").config(); // Đảm bảo biến môi trường từ file .env được đọc

async function connectDB() {
  try {
    // Loại bỏ các tùy chọn đã deprecated
    // mongoose.set("strictPopulate", false);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connectDBed to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connectDB to MongoDB:", error); // Log chi tiết lỗi
    process.exit(1); // Thoát quá trình nếu kết nối thất bại
  }
}

module.exports = connectDB;
