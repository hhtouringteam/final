const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Order = require("../../models/orderModel");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const clinet_id = process.env.GG_CLIENT_ID; // Ensure this matches your Google Client ID
const client = new OAuth2Client(clinet_id);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function verifyGoogleToken(token) {
  console.log("Google token received in backend:", token); // Log token nhận từ FE
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clinet_id, // Đảm bảo client ID này chính xác
    });
    const payload = ticket.getPayload();
    console.log("Google token verified successfully:", payload); // Log payload nhận từ Google
    return payload;
  } catch (error) {
    console.error("Error verifying Google token:", error); // Log lỗi nếu xảy ra
    throw new Error("Invalid Google token");
  }
}
class userController {
  async register(req, res) {
    try {
      const { username, email, password, role, adminCode } = req.body;
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser)
        return res
          .status(400)
          .json({ error: "Username or email already exists." });
      if (role === "admin") {
        if (adminCode !== process.env.ADMIN_SECRET_CODE) {
          return res
            .status(403)
            .json({ error: "Invalid admin authentication code." });
        }
      }
      const userRole = role === "admin" ? "admin" : "user";
      const user = new User({
        username,
        email,
        password,
        role: userRole,
      });

      await user.save();
      res.json({ message: "Registration successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found");
        return res
          .status(400)
          .json({ error: "Incorrect username or password." });
      }
      const validPassword = await user.comparePassword(password);
      if (!validPassword) {
        console.log("Incorrect password");
        return res
          .status(400)
          .json({ error: "Username or password is incorrect.." });
      }
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      console.log("Token được tạo:", token);

      res.status(200).json({
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Lỗi trong quá trình đăng nhập:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  }

  // Xử lý đăng nhập Google
  async google(req, res) {
    try {
      const { token } = req.body;
      console.log("Google token received for login:", token);

      const googleUser = await verifyGoogleToken(token);
      const { email, name, sub } = googleUser;

      let account = await User.findOne({ email, googleId: sub });
      if (!account) {
        console.log("Creating new Google user:", name);
        account = await User.create({
          username: name,
          email: email,
          googleId: sub,
        });
        await account.save();
      }

      const jwtToken = jwt.sign(
        {
          userId: account._id,
          role: account.role,
          username: account.username,
          email: account.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      console.log(
        "Google user logged in successfully, JWT token generated:",
        jwtToken
      );

      res.status(200).json({ token: jwtToken, user: account });
    } catch (error) {
      console.error("Error during Google login:", error);
      res.status(401).json({ error: "Invalid Google token" });
    }
  }
  async adminDashboard(req, res) {
    try {
      // Kiểm tra quyền admin
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }

      // Trả về thông tin admin từ req.user
      res.json({
        admin: {
          name: req.user.username, // Trả về thông tin từ req.user
          email: req.user.email,
          avatar: req.user.avatar,
          // Các thông tin khác nếu có
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  }

  // Lấy thông tin người dùng
  async getUserInfo(req, res) {
    try {
      // Kiểm tra xem người dùng có phải admin không
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }

      const users = await User.find().select("-password"); // Loại bỏ trường mật khẩu
      res.json(users);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  }
  //k cần là admin

  // Cập nhật thông tin người dùng
  async updateUserInfo(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }

      const userId = req.params.id;
      const updateData = req.body;

      // Không cho phép cập nhật mật khẩu qua API này
      delete updateData.password;

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy người dùng." });
      }

      res.json(user);
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
    }
  }

  // Xóa người dùng
  async deleteUser(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }

      const userId = req.params.id;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy người dùng." });
      }

      res.json({ message: "Xóa người dùng thành công." });
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      res.status(500).json({ error: "Lỗi máy chủ." });
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
      const userId = req.params.userId; // Lấy userId từ token (đã xác thực qua middleware)
      const avatarPath = req.file.path; // Đường dẫn đến file đã upload
      console.log("File đã upload:", req.file); // Log thông tin file upload

      await User.findByIdAndUpdate(userId, { avatar: avatarPath });

      res
        .status(200)
        .json({ message: "Avatar uploaded successfully", avatar: avatarPath });
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error); // Log chi tiết lỗi
      res.status(500).json({ message: "Lỗi khi upload avatar" });
    }
  }
  async getNewUsers(req, res) {
    try {
      // Sử dụng countDocuments để đếm tổng số người dùng
      const totalUsers = await User.countDocuments();

      console.log(res.json({ count: totalUsers }));
    } catch (error) {
      console.error("Error fetching total users:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi lấy tổng số người dùng", error });
    }
  }

}

module.exports = new userController();
