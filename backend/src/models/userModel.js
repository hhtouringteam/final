const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Tên đăng nhập là bắt buộc"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      match: [/.+\@.+\..+/, "Vui lòng nhập một email hợp lệ"],
    },
    password: {
      type: String,

      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    googleId: { type: String, unique: true, sparse: true },
    address: { type: String },
    phoneNumber: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String, // Đây là đường dẫn đến ảnh đại diện
      default: "", // Mặc định là rỗng nếu người dùng chưa tải lên ảnh đại diện
    },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },

  { timestamps: true }
);

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Phương thức xác thực mật khẩu
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
