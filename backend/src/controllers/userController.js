const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Hoặc dịch vụ email bạn sử dụng
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class userController {
  // Đăng ký người dùng mới
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email đã được sử dụng" });

      // Chỉ cho phép tạo tài khoản admin nếu có điều kiện đặc biệt (ví dụ: secret key)
      let userRole = "user";
      if (
        role === "admin" &&
        req.body.secretKey === process.env.ADMIN_SECRET_KEY
      ) {
        userRole = "admin";
      }

      const user = new User({ username, email, password, role: userRole });
      await user.save();

      res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // Đăng nhập người dùng
  async login(req, res) {
    try {
      const { email, password } = req.body;
      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại" });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }

      // Tạo token JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi", error });
    }
  }

  // Lấy thông tin người dùng
  async getUserInfo(req, res) {
    try {
      const user = await User.findById(req.user.userId).select("-password");
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật thông tin người dùng
  async updateUserInfo(req, res) {
    try {
      const updates = req.body;

      // Ngăn chặn cập nhật các trường nhạy cảm
      delete updates.password;
      delete updates._id;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      res.json({ message: "Cập nhật thông tin thành công", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Xóa người dùng
  async deleteUser(req, res) {
    try {
      const { password } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      // Xác thực mật khẩu
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ message: "Mật khẩu không đúng" });

      // Xóa người dùng
      await User.findByIdAndDelete(req.user.userId);

      res.json({ message: "Xóa tài khoản thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Kiểm tra xem mật khẩu mới có được cung cấp không
      if (!newPassword)
        return res.status(400).json({ message: "Mật khẩu mới là bắt buộc" });

      const user = await User.findById(req.user.userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      // Xác thực mật khẩu hiện tại
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });

      // Cập nhật mật khẩu mới
      user.password = newPassword;
      await user.save();

      res.json({ message: "Thay đổi mật khẩu thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUserByAdmin(req, res) {
    try {
      // Kiểm tra vai trò admin
      if (req.user.role !== "admin")
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xóa người dùng" });

      const userId = req.params.id;

      // Kiểm tra xem người dùng có tồn tại không
      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Người dùng không tồn tại" });

      // Xóa người dùng
      await User.findByIdAndDelete(userId);

      res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Email không tồn tại trong hệ thống" });
      }

      // Tạo token đặt lại mật khẩu
      const token = crypto.randomBytes(20).toString("hex");

      // Cập nhật user với token và thời gian hết hạn (ví dụ: 1 giờ)
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ

      await user.save();

      // Gửi email cho người dùng với link đặt lại mật khẩu
      const resetLink = `http://yourfrontend.com/reset-password/${token}`;

      const mailOptions = {
        to: user.email,
        from: "no-reply@yourdomain.com",
        subject: "Yêu cầu đặt lại mật khẩu",
        text:
          `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n` +
          `Vui lòng nhấp vào link sau hoặc dán vào trình duyệt của bạn để hoàn tất quá trình:\n\n` +
          `${resetLink}\n\n` +
          `Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Email khôi phục mật khẩu đã được gửi" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Tìm người dùng với token hợp lệ và chưa hết hạn
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Token chưa hết hạn
      });

      if (!user) {
        return res.status(400).json({
          message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        });
      }

      // Cập nhật mật khẩu mới
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ message: "Mật khẩu của bạn đã được cập nhật" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.userId; // Giả sử đã xác thực user qua token
      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      // Cập nhật avatar của người dùng trong database
      await User.findByIdAndUpdate(userId, { avatar: avatarPath });
      const fullAvatarPath = `http://localhost:5000${avatarPath}`;
      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatar: fullAvatarPath, // Trả về đường dẫn đầy đủ của avatar
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading avatar", error });
    }
  }
}

module.exports = new userController();
