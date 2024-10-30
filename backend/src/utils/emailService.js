// emailService.js

const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Installment = require("../models/installmentModel");
const Payment = require("../models/PaymentModel");
const EmailLog = require("../models/emailLogModel");
require("dotenv").config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (người gửi)
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng của email
  },
});

async function sendPaymentSuccessEmailToAdmin(orderDetails) {
  console.log(
    "Preparing to send email to admin with orderDetails:",
    orderDetails
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("ADMIN_EMAIL is not defined in environment variables.");
    return;
  }

  // Lấy các thông tin cần thiết từ orderDetails
  const orderId =
    orderDetails.orderCode || orderDetails.orderId || orderDetails._id;
  const totalPrice = orderDetails.totalPrice;
  const billingInfo = orderDetails.billingInfo;
  const cartItems = orderDetails.cartItems;

  // Tạo danh sách sản phẩm trong đơn hàng
  let itemsList = "";
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price} VND\n`;
  });

  // Nội dung email
  const emailContent = `
Đơn hàng với mã ${orderId} đã được thanh toán thành công.

Thông tin đơn hàng:
--------------------
${itemsList}
Tổng tiền: ${totalPrice} VND

Thông tin khách hàng:
--------------------
Họ và tên: ${billingInfo.username}
Email: ${billingInfo.email}
Số điện thoại: ${billingInfo.phone}
Địa chỉ: ${billingInfo.streetAddress}, ${billingInfo.country}
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail, // Email của admin
    subject: "Thông báo thanh toán thành công",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi đến admin:", info.response);
    const emailLog = new EmailLog({
      to: adminEmail,
      subject: mailOptions.subject,
      content: emailContent,
      relatedOrderId: orderDetails._id,
      customerName: billingInfo.username,
      customerEmail: billingInfo.email,
      products: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalPrice,
      billingInfo: billingInfo,
    });
    await emailLog.save();
  } catch (error) {
    console.error("Lỗi khi gửi email đến admin:", error);
  }
}

async function sendOrderConfirmationToCustomer(orderDetails) {
  let user;
  try {
    user = await User.findById(orderDetails.userId);
    if (!user) {
      console.error("User not found with ID:", orderDetails.userId);
      return;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return;
  }

  const customerEmail = user.email;

  if (!customerEmail || !validateEmail(customerEmail)) {
    console.error("Customer email is missing or invalid in user account.");
    return;
  }

  // Lấy các thông tin cần thiết từ orderDetails
  const orderId =
    orderDetails.orderCode || orderDetails.orderId || orderDetails._id;
  const totalPrice = orderDetails.totalPrice;
  const billingInfo = orderDetails.billingInfo;
  const cartItems = orderDetails.cartItems;

  // Tạo danh sách sản phẩm trong đơn hàng
  let itemsList = "";
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price} VND\n`;
  });

  // Nội dung email
  const emailContent = `
Chào ${user.username || billingInfo.username},

Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.

Thông tin đơn hàng của bạn:
--------------------
Mã đơn hàng: ${orderId}
${itemsList}
Tổng tiền: ${totalPrice} VND

Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.

Trân trọng,
Cửa hàng của bạn
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail, // Email của khách hàng từ tài khoản người dùng
    subject: "Xác nhận đơn hàng của bạn",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi đến khách hàng:", info.response);
  } catch (error) {
    console.error("Lỗi khi gửi email đến khách hàng:", error);
  }
}

const sendPaymentNotification = async (user, installment, payment) => {
  // Gửi email cho khách hàng
  const mailOptionsCustomer = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Thông Báo Thanh Toán",
    text: `Xin chào ${user.username},\n\nBạn đã thanh toán ${payment.amount.toLocaleString()} VND cho đơn hàng #${installment.order.orderCode}. Số tiền còn lại: ${installment.remaining_amount.toLocaleString()} VND.\n\nCảm ơn bạn đã mua hàng!`,
  };

  console.log(mailOptionsCustomer);
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Đơn hàng #${installment.order.orderCode} đã thanh toán`,
    text: `Khách hàng ${user.username} đã thanh toán ${payment.amount.toLocaleString()} VND cho đơn hàng #${installment.order.orderCode}. Số tiền còn lại: ${installment.remaining_amount.toLocaleString()} VND.`,
  };
  console.log(mailOptionsAdmin);
  try {
    await transporter.sendMail(mailOptionsCustomer);
    await transporter.sendMail(mailOptionsAdmin);
  } catch (error) {
    console.error("Error sending payment notifications:", error);
  }
};

const sendInstallmentNotification = async (user, installment, status) => {
  const mailOptionsCustomer = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Thông Báo Hủy Kế Hoạch Trả Góp`,
    text: `Xin chào ${user.username},\n\nKế hoạch trả góp của bạn cho đơn hàng #${installment.order.orderCode} đã bị hủy.\n\nNếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.\n\nCảm ơn bạn đã sử dụng dịch vụ!`,
  };
  console.log(mailOptionsCustomer);
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Kế Hoạch Trả Góp Đơn Hàng #${installment.order.orderCode} Đã Bị Hủy`,
    text: `Khách hàng ${user.username} đã hủy kế hoạch trả góp cho đơn hàng #${installment.order.orderCode}.`,
  };

  try {
    await transporter.sendMail(mailOptionsCustomer);
    await transporter.sendMail(mailOptionsAdmin);
  } catch (error) {
    console.error("Error sending installment notifications:", error);
  }
};
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
module.exports = {
  sendPaymentSuccessEmailToAdmin,
  sendOrderConfirmationToCustomer,
  sendPaymentNotification,
  sendInstallmentNotification,
};
