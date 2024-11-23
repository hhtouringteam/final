// controllers/paymentController.js

const Order = require("../../models/orderModel");
const Notification = require("../../models/notificationModel");
const Installment = require("../../models/installmentModel");
const PaymentService = require("../../utils/paymentService");
const InstallmentPayment = require("../../models/installmentPaymentModel");

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
        return res.status(400).json({ message: "Missing required field" });
      }
      const YOUR_DOMAIN = process.env.YOUR_DOMAIN;
      const order = await Order.findById(orderId).populate("installmentId");
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
      if (order.paymentStatus === "paid") {
        return res
          .status(400)
          .json({ message: "Order has already been paid." });
      }
      const orderCode = order.orderCode;
      const description = `Order #${orderCode}`.substring(0, 25);
      let amountToPay = order.totalPrice;
      if (order.installmentId) {
        amountToPay = order.installmentId.monthlyPayment;
      }
      amountToPay = Math.round(amountToPay);
      console.log("Amount due for payment:", amountToPay);
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
      const { status, order_id, amount } = data;

      const paymentStatus = status === "success" ? "Paid" : "Failed";

      // Gọi phương thức updatePaymentStatus
      req.body = {
        orderCode: order_id,
        status: paymentStatus,
        amount,
      };
      await this.updatePaymentStatus(req, res);
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
      let amountToPay = order.totalPrice;
      if (order.installmentId) {
        amountToPay = order.installmentId.monthlyPayment;
      }
      amountToPay = Math.round(amountToPay);
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
      const { app_trans_id, amount, zp_trans_id } = data;

      const status = data.status === 1 ? "Paid" : "Failed";

      // Gọi phương thức updatePaymentStatus
      req.body = {
        app_trans_id,
        status,
        amount,
      };
      await this.updatePaymentStatus(req, res);
    } catch (error) {
      console.error("Lỗi khi xử lý webhook ZaloPay:", error);
      res.status(500).send("Lỗi server nội bộ.");
    }
  }

  async updatePaymentStatus(req, res) {
    const { orderCode, app_trans_id, status, amount } = req.body;

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
        order = await Order.findOne({ orderCode: numericOrderCode }).populate(
          "installmentId"
        );
        console.log("Order search by orderCode result:", order);
      } else if (app_trans_id) {
        order = await Order.findOne({ app_trans_id: app_trans_id }).populate(
          "installmentId"
        );
        console.log("Order search by app_trans_id result:", order);
      } else {
        console.error("No order identifier provided.");
        return res.status(400).json({ message: "Missing order identifier." });
      }

      if (!order) {
        console.error("Order not found with provided identifier.");
        return res.status(404).json({ message: "Order not found." });
      }

      console.log("Order before update:", order);

      // Kiểm tra nếu đơn hàng là trả góp
      if (order.installmentId) {
        // Xử lý thanh toán trả góp
        const paymentAmount = amount ? Number(amount) : 0;

        if (paymentAmount <= 0) {
          console.error("Invalid payment amount for installment payment.");
          return res.status(400).json({ message: "Invalid payment amount." });
        }

        // Cập nhật tổng số tiền đã thanh toán
        order.totalPaid += paymentAmount;

        // Cập nhật trạng thái của kỳ thanh toán tương ứng
        const installmentPayment = await InstallmentPayment.findOneAndUpdate(
          {
            installmentId: order.installmentId._id,
            status: "Pending",
          },
          {
            status: "Paid",
            paidDate: new Date(),
          },
          { sort: { paymentNumber: 1 } }
        );

        if (!installmentPayment) {
          console.error("No pending installment payment found.");
          return res
            .status(400)
            .json({ message: "No pending installment payment found." });
        }

        // Kiểm tra nếu tất cả các kỳ thanh toán đã được thanh toán
        const pendingPayments = await InstallmentPayment.find({
          installmentId: order.installmentId._id,
          status: "Pending",
        });

        if (pendingPayments.length === 0) {
          // Tất cả các kỳ đã được thanh toán
          order.paymentStatus = "Paid";
          order.orderStatus = "Confirmed";
        } else {
          // Vẫn còn kỳ chưa thanh toán
          order.paymentStatus = "Partial";
          order.orderStatus = "Processing";
        }
      } else {
        // Đơn hàng không trả góp
        const normalizedStatus = status.toString().toLowerCase();

        if (normalizedStatus === "paid" || normalizedStatus === "1") {
          order.paymentStatus = "Paid";
          order.orderStatus = "Confirmed";
        } else {
          order.paymentStatus = status;
          order.orderStatus = "Processing";
        }
      }

      await order.save();
      console.log("Order saved successfully:", order);

      // Gửi email thông báo đến admin và khách hàng
      await sendPaymentSuccessEmailToAdmin(order);
      await sendOrderConfirmationToCustomer(order);
      console.log("Sent payment success emails.");

      // Tạo thông báo
      const notification = new Notification({
        type: "Order",
        message: `Order #${order.orderCode} has been partially ${
          order.paymentStatus === "Paid" ? "full" : "a part"
        }.`,
        relatedId: order._id,
      });
      await notification.save();

      res
        .status(200)
        .json({ message: "Order payment status updated successfully." });
    } catch (error) {
      console.error("Error updating order payment status:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  async updateInstallmentPaymentStatus(req, res) {
    try {
      const { status, paymentMethod, orderId, paymentId } = req.body;
  
      // Tìm đơn hàng
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
      }
  
      // Tìm kỳ thanh toán
      const installmentPayment = await InstallmentPayment.findById(paymentId);
      if (!installmentPayment) {
        return res.status(404).json({ message: 'Không tìm thấy kỳ thanh toán.' });
      }
  
      // Cập nhật trạng thái kỳ thanh toán
      installmentPayment.status = status === '1' ? 'Paid' : 'Failed';
      await installmentPayment.save();
  
      // Kiểm tra nếu tất cả các kỳ đã được thanh toán
      const unpaidPayments = await InstallmentPayment.find({
        installmentId: installmentPayment.installmentId,
        status: 'Pending',
      });
  
      if (unpaidPayments.length === 0) {
        // Cập nhật trạng thái thanh toán của đơn hàng
        order.paymentStatus = 'Paid';
        await order.save();
      }
  
      res.status(200).json({ message: 'Cập nhật trạng thái thanh toán thành công.' });
    } catch (error) {
      console.error('Error updating installment payment status:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái thanh toán.' });
    }
  }
  async payInstallment(req, res) {
    try {
      const { orderId, paymentId } = req.body;

      // Tìm đơn hàng
      const order = await Order.findById(orderId).populate("installmentId");
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      }

      // Kiểm tra xem đơn hàng có trả góp không
      if (!order.installmentId) {
        return res
          .status(400)
          .json({ message: "Đơn hàng không phải trả góp." });
      }

      // Tìm kỳ thanh toán
      const installmentPayment = await InstallmentPayment.findById(paymentId);
      if (!installmentPayment) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy kỳ thanh toán." });
      }

      // Kiểm tra trạng thái kỳ thanh toán
      if (installmentPayment.status !== "Pending") {
        return res.status(400).json({
          message:
            "Kỳ thanh toán này đã được thanh toán hoặc không thể thanh toán.",
        });
      }

      // Tạo yêu cầu thanh toán
      const amount = installmentPayment.amount;

      // Sử dụng PaymentService để tạo yêu cầu thanh toán
      const paymentMethod = order.paymentMethod;
      let paymentUrl;

      if (paymentMethod === "ZaloPay") {
        paymentUrl = await PaymentService.createZaloPayPayment({
          amount,
          orderCode: order.orderCode,
          description: `Thanh toán kỳ trả góp ${installmentPayment.paymentNumber} cho đơn hàng ${order.orderCode}`,
          orderId: orderId,
          paymentId: paymentId,
        });
      } else if (paymentMethod === "PayOS") {
        // Tương tự cho PayOS
      } else {
        return res
          .status(400)
          .json({ message: "Phương thức thanh toán không hỗ trợ." });
      }

      // Trả về paymentUrl để frontend chuyển hướng người dùng
      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error("Error creating installment payment:", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi tạo yêu cầu thanh toán." });
    }
  }
}

module.exports = new PaymentController();
