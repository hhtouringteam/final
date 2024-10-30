// controllers/paymentController.js
const PaymentService = require("../../utils/paymentService");
const Order = require("../../models/orderModel");
const Notification = require("../../models/notificationModel");
const Installment = require("../../models/installmentModel");
const installmentService = require("../../utils/installmentService");
const CryptoJS = require("crypto-js");
const {
  sendPaymentSuccessEmailToAdmin,
  sendOrderConfirmationToCustomer,
} = require("../../utils/emailService");

class PaymentController {
  async createPayOSPayment(req, res) {
    try {
      const { orderId, userId } = req.body;

      if (!orderId || !userId) {
        return res.status(400).json({ message: "Thiếu trường bắt buộc." });
      }

      const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

      const order = await Order.findById(orderId).populate("installmentId");
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      }

      if (order.paymentStatus === "paid") {
        return res
          .status(400)
          .json({ message: "Đơn hàng đã được thanh toán." });
      }

      const orderCode = order.orderCode;
      const description = `Order #${orderCode}`.substring(0, 25);

      // Sử dụng số tiền phải trả cho kỳ thanh toán đầu tiên nếu là trả góp
      let amountToPay = order.totalPrice;
      if (order.installmentId) {
        amountToPay = order.installmentId.monthlyPayment;
      }

      // Chuyển amountToPay thành số nguyên
      amountToPay = Math.round(amountToPay);

      // Kiểm tra xem amountToPay có được tính đúng không
      console.log("Số tiền cần thanh toán:", amountToPay);

      const paymentData = {
        orderCode: orderCode,
        amount: amountToPay,
        description: description,
        items: order.cartItems.map((item) => ({
          name: item.name.substring(0, 20),
          quantity: item.quantity,
          price: item.price,
        })),
        returnUrl: `${YOUR_DOMAIN}/payment-result?paymentMethod=PayOS&status=PAID`,
        cancelUrl: `${YOUR_DOMAIN}/payment-result?paymentMethod=PayOS&status=FAILED`,
      };

      const checkoutUrl =
        await PaymentService.createPayOSPaymentLink(paymentData);
      res.json({ payUrl: checkoutUrl });
    } catch (error) {
      console.error("Lỗi khi tạo liên kết thanh toán PayOS:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi tạo liên kết thanh toán PayOS." });
    }
  }

  async handlePayOSWebhook(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.data || !payload.signature) {
        return res.status(400).send("Payload không hợp lệ.");
      }

      const dataStr = JSON.stringify(payload.data);
      const isValidSignature = PaymentService.verifyPayOSSignature(
        dataStr,
        payload.signature
      );

      if (!isValidSignature) {
        return res.status(400).send("Chữ ký không hợp lệ.");
      }

      const data = JSON.parse(dataStr);
      const { status, order_id } = data;

      await this.updateOrderPaymentStatus(order_id, status);
      res.status(200).send("Webhook đã nhận.");
    } catch (error) {
      console.error("Lỗi khi xử lý webhook PayOS:", error);
      res.status(500).send("Lỗi server nội bộ.");
    }
  }

  async createZaloPayPayment(req, res) {
    try {
      const { orderId, userId } = req.body;

      if (!orderId || !userId) {
        return res.status(400).json({ message: "Thiếu trường bắt buộc." });
      }

      const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

      const order = await Order.findById(orderId).populate("installmentId");
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      }

      if (order.paymentStatus === "paid") {
        return res
          .status(400)
          .json({ message: "Đơn hàng đã được thanh toán." });
      }

      const orderCode = order.orderCode;
      const app_trans_id = order.app_trans_id;

      const embed_data = {
        redirecturl: `${YOUR_DOMAIN}/payment-result?paymentMethod=ZaloPay&orderCode=${orderCode}&app_trans_id=${app_trans_id}`,
      };
      const items = order.cartItems.map((item) => ({
        itemid: item.productId.toString(),
        itename: item.name.substring(0, 20),
        itemprice: item.price,
        itemquantity: item.quantity,
      }));

      // Sử dụng số tiền phải trả cho kỳ thanh toán đầu tiên nếu là trả góp
      let amountToPay = order.totalPrice;
      if (order.installmentId) {
        amountToPay = order.installmentId.monthlyPayment;
      }

      // Chuyển amountToPay thành số nguyên
      amountToPay = Math.round(amountToPay);
      // Kiểm tra xem amountToPay có được tính đúng không
      console.log("Số tiền cần thanh toán:", amountToPay);

      const orderData = {
        app_id: process.env.ZALOPAY_APP_ID,
        app_user: userId,
        app_time: Date.now(),
        app_trans_id: app_trans_id,
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amountToPay,
        description: `Payment for order #${orderCode}`,
        bank_code: "zalopayapp",
        orderCode: orderCode,
        callback_url: `${process.env.NGROK_URL}/api/payments/zalopay/webhook`,
      };

      const response = await PaymentService.createZaloPayOrder(orderData);

      if (response.return_code === 1) {
        res.status(200).json({
          payUrl: response.order_url,
          zp_trans_token: response.zp_trans_token,
          orderCode: orderCode,
          app_trans_id: app_trans_id,
        });
      } else {
        res.status(400).json({ message: response.return_message });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng ZaloPay:", error);
      res.status(500).json({ message: "Lỗi khi tạo đơn hàng ZaloPay." });
    }
  }
  async handleZaloPayWebhook(req, res) {
    try {
      const payload = req.body;

      if (!payload || !payload.data || !payload.mac) {
        return res.status(400).send("Payload không hợp lệ.");
      }

      const isValidSignature = PaymentService.verifyZaloPaySignature(
        payload.data,
        payload.mac
      );

      if (!isValidSignature) {
        return res.status(400).send("Chữ ký không hợp lệ.");
      }

      const data = JSON.parse(payload.data);
      const { type, app_trans_id } = data;

      const status = type === 1 ? "paid" : "failed";
      await this.updateOrderPaymentStatusByAppTransId(app_trans_id, status);

      res.status(200).send("Webhook đã nhận.");
    } catch (error) {
      console.error("Lỗi khi xử lý webhook ZaloPay:", error);
      res.status(500).send("Lỗi server nội bộ.");
    }
  }

  async updatePaymentStatus(req, res) {
    const { orderCode, app_trans_id, status } = req.body;

    console.log("Received updatePaymentStatus request with body:", req.body);

    if (!status) {
      console.error("Missing status in request body.");
      return res.status(400).json({ message: "Missing status." });
    }

    try {
      let order;

      if (orderCode) {
        // Nếu có orderCode, tìm đơn hàng bằng orderCode
        const numericOrderCode = Number(orderCode);
        if (isNaN(numericOrderCode)) {
          console.error("Invalid orderCode format:", orderCode);
          return res.status(400).json({ message: "Invalid orderCode format." });
        }
        order = await Order.findOne({ orderCode: numericOrderCode });
        console.log("Order search by orderCode result:", order);
      } else if (app_trans_id) {
        order = await Order.findOne({ app_trans_id: app_trans_id });
        console.log("Order search by app_trans_id result:", order);
      } else {
        console.error("No order identifier provided.");
        return res.status(400).json({ message: "Missing order identifier." });
      }

      if (!order) {
        console.error("Order not found with provided identifier.");
        return res.status(404).json({ message: "Order not found." });
      }

      // Cập nhật trạng thái thanh toán
      order.paymentStatus = status;
      console.log(`Updating order paymentStatus to: ${status}`);

      const normalizedStatus = status.toString().toLowerCase();

      if (normalizedStatus === "paid" || normalizedStatus === "1") {
        order.orderStatus = "Confirmed"; // Cập nhật trạng thái đơn hàng nếu cần
        console.log("Order status set to Confirmed.");

        await order.save();
        console.log("Order saved successfully:", order);

        // Gửi email thông báo đến admin
        await sendPaymentSuccessEmailToAdmin(order);
        console.log("Called sendPaymentSuccessEmailToAdmin.");

        // Gửi email xác nhận đến khách hàng
        await sendOrderConfirmationToCustomer(order);
        console.log("Called sendOrderConfirmationToCustomer.");
        const notification = new Notification({
          type: "Order",
          message: `Đơn hàng #${order.orderCode} đã được thanh toán thành công.`,
          relatedId: order._id,
        });
        await notification.save();
      } else {
        await order.save();
        console.log("Order saved with updated status:", order);
      }

      res
        .status(200)
        .json({ message: "Order payment status updated successfully." });
    } catch (error) {
      console.error("Error updating order payment status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = new PaymentController();
