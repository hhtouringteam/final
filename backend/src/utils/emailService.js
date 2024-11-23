// emailService.js

const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Installment = require("../models/installmentModel");
const Payment = require("../models/PaymentModel");
const EmailLog = require("../models/emailLogModel");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
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
  const orderId =
    orderDetails.orderCode || orderDetails.orderId || orderDetails._id;
  const totalPrice = orderDetails.totalPrice;
  const billingInfo = orderDetails.billingInfo;
  const cartItems = orderDetails.cartItems;
  let itemsList = "";
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: ${item.price} VND\n`;
  });
  const emailContent = `
Order with code ${orderId} has been successfully paid.

Order information:
--------------------
${itemsList}
Total Price: ${totalPrice} VND

Customer Information:
--------------------
Full Name: ${billingInfo.username}
Email: ${billingInfo.email}
Phone Number: ${billingInfo.phone}
Address: ${billingInfo.streetAddress}, ${billingInfo.country}
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail, // Admin's email
    subject: "Payment Successful Notification",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email has been sent to admin:", info.response);
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
    console.error("Error sending email to admin:", error);
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

  // Extract necessary information from orderDetails
  const orderId =
    orderDetails.orderCode || orderDetails.orderId || orderDetails._id;
  const totalPrice = orderDetails.totalPrice;
  const billingInfo = orderDetails.billingInfo;
  const cartItems = orderDetails.cartItems;

  // Create a list of products in the order
  let itemsList = "";
  cartItems.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: ${item.price} VND\n`;
  });

  // Email content
  const emailContent = `
Hello ${user.username || billingInfo.username},

Thank you for placing an order at our store.

Your order information:
--------------------
Order Code: ${orderId}
${itemsList}
Total Price: ${totalPrice} VND

We will process your order as soon as possible.

Best regards,
Your Store
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail, // Customer's email from user account
    subject: "Your Order Confirmation",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email has been sent to customer:", info.response);
  } catch (error) {
    console.error("Error sending email to customer:", error);
  }
}

const sendPaymentNotification = async (user, installment, payment) => {
  // Send email to customer
  const mailOptionsCustomer = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Payment Notification",
    text: `Hello ${user.username},\n\nYou have made a payment of ${payment.amount.toLocaleString()} VND for order #${installment.order.orderCode}. Remaining amount: ${installment.remaining_amount.toLocaleString()} VND.\n\nThank you for your purchase!`,
  };

  console.log(mailOptionsCustomer);
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Order #${installment.order.orderCode} Payment Received`,
    text: `Customer ${user.username} has made a payment of ${payment.amount.toLocaleString()} VND for order #${installment.order.orderCode}. Remaining amount: ${installment.remaining_amount.toLocaleString()} VND.`,
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
    subject: `Installment Plan Cancellation Notice`,
    text: `Hello ${user.username},\n\nYour installment plan for order #${installment.order.orderCode} has been canceled.\n\nIf you have any questions, please contact us.\n\nThank you for using our service!`,
  };
  console.log(mailOptionsCustomer);
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Installment Plan for Order #${installment.order.orderCode} Canceled`,
    text: `Customer ${user.username} has canceled the installment plan for order #${installment.order.orderCode}.`,
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
