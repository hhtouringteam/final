const Order = require("../../models/orderModel");
const Product = require("../../models/productModel"); // Bổ sung import Product
const crypto = require("crypto");
const moment = require("moment");
const axios = require("axios").default;
const querystring = require("querystring");
const {
  sendPaymentSuccessEmailToAdmin,
  sendOrderConfirmationToCustomer,
} = require("../../configs/email");
const Notification = require("../../models/notificationModel");
const CryptoJS = require("crypto-js"); // npm install crypto-js

const mongoose = require("mongoose");
const PayOS = require("@payos/node");
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
const NGROK_URL = process.env.NGROK_URL;
const PayOS_URL = NGROK_URL + "/api/orders/payos/webhook";
const Zalopay_URL = NGROK_URL + "/api/orders/zalopay/webhook";
const zaloPayConfig = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
class orderController {
  async create(req, res) {
    try {
      const { userId, cartItems, totalPrice } = req.body;

      console.log("Payload received in backend:", req.body);

      if (!userId || !cartItems || !totalPrice) {
        return res.status(400).json({ message: "Invalid order data" });
      }
      const transID = Math.floor(Math.random() * 1000000);

      const newOrder = new Order({
        userId,
        cartItems,
        totalPrice,
        orderCode: Date.now(),
        app_trans_id: ${moment().format("YYMMDD")}_${transID},
      });

      // Lưu đơn hàng vào cơ sở dữ liệu
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  }

  async createPayOS(req, res) {
    const { orderId, totalPrice, billingInfo, cartItems, userId } = req.body;

    if (!orderId || !totalPrice || !billingInfo || !cartItems || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      if (order.paymentStatus === "paid") {
        return res.status(400).json({ message: "Order is already paid." });
      }

      // Cập nhật thông tin billing và phương thức thanh toán
      order.billingInfo = billingInfo;
      order.paymentMethod = "PayOS";
      await order.save();

      // Tạo orderCode là timestamp đảm bảo là số nguyên dương và duy nhất
      const orderCode = order.orderCode; // Đã được thiết lập khi tạo đơn hàng

      // Giảm độ dài của mô tả xuống dưới 25 ký tự
      const description = Order #${orderCode};
      if (description.length > 25) {
        return res
          .status(400)
          .json({ message: "Description exceeds 25 characters." });
      }

      const paymentData = {
        orderCode: orderCode, // Số nguyên dương duy nhất
        amount: totalPrice, // Số tiền thanh toán
        description: description, // Mô tả thanh toán <=25 ký tự
        items: cartItems.map((item) => ({
          name:
            item.name.length > 20
              ? item.name.substring(0, 20) + "..."
              : item.name, // Đảm bảo tên sản phẩm không quá dài
          quantity: item.quantity,
          price: item.price,
        })),
        returnUrl: ${YOUR_DOMAIN}/payment-result?paymentMethod=PayOS&status=PAID,
        cancelUrl: ${YOUR_DOMAIN}/payment-result?paymentMethod=PayOS&status=FAILED,
      };

      console.log("Payment Data Sent to PayOS:", paymentData); // Log để kiểm tra dữ liệu gửi đi

      const paymentLinkResponse = await payOS.createPaymentLink(paymentData);
      res.json({ payUrl: paymentLinkResponse.checkoutUrl });
      console.log("paymentLinkResponse", paymentLinkResponse);
    } catch (error) {
      console.error("Error creating PayOS payment link:", error);

      // Kiểm tra nếu error.response có dữ liệu trả về từ PayOS
      if (error.response && error.response.data) {
        console.error("PayOS Error Response:", error.response.data);
        return res
          .status(500)
          .json({ message: "PayOS Error", details: error.response.data });
      }

      res.status(500).json({ message: "Error creating PayOS payment link." });
    }
  }

  async webhookPayOS(req, res) {
    const payload = req.body;

    console.log("Received PayOS webhook payload:", payload);

    // Kiểm tra sự tồn tại của các trường cần thiết
    if (!payload || !payload.data || !payload.signature) {
      console.error("Invalid PayOS webhook payload.");
      return res.status(400).send("Invalid payload.");
    }

    const dataStr = JSON.stringify(payload.data);
    const receivedSignature = payload.signature;

    // Tạo chữ ký từ dataStr bằng secret key của PayOS
    const computedSignature = CryptoJS.HmacSHA256(
      dataStr,
      payosConfig.secretKey
    ).toString();

    if (computedSignature !== receivedSignature) {
      console.error("Invalid PayOS signature.");
      return res.status(400).send("Invalid signature.");
    }

    // Parse dataStr thành đối tượng JSON
    let data;
    try {
      data = JSON.parse(dataStr);
      console.log("Parsed PayOS data:", data);
    } catch (err) {
      console.error("Error parsing PayOS webhook data:", err);
      return res.status(400).send("Invalid data format.");
    }

    const { status, transaction_id, order_id, amount } = data;

    if (status === "SUCCESS") {
      // Thanh toán thành công
      console.log(Payment success for order_id: ${order_id});

      try {
        // Tìm đơn hàng bằng order_id
        const order = await Order.findOne({ orderCode: order_id });

        if (order) {
          console.log(
            Found order: ${order._id}, current paymentStatus: ${order.paymentStatus}
          );
          if (order.paymentStatus.toLowerCase() !== "paid") {
            order.paymentStatus = "paid";
            order.orderStatus = "Confirmed";
            await order.save();
            console.log(Order ${order._id} has been marked as paid.);
          } else {
            console.log(Order ${order._id} is already marked as paid.);
          }
        } else {
          console.error(Order with order_id ${order_id} not found.);
        }
      } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).send("Internal server error.");
      }
    } else if (status === "FAILED") {
      // Thanh toán thất bại
      console.log(Payment failed for order_id: ${order_id});

      try {
        // Tìm đơn hàng bằng order_id
        const order = await Order.findOne({ orderCode: order_id });

        if (order) {
          console.log(
            Found order: ${order._id}, current paymentStatus: ${order.paymentStatus}
          );
          if (order.paymentStatus.toLowerCase() !== "failed") {
            order.paymentStatus = "failed";
            order.orderStatus = "Payment Failed";
            await order.save();
            console.log(Order ${order._id} has been marked as failed.);
          } else {
            console.log(Order ${order._id} is already marked as failed.);
          }
        } else {
          console.error(Order with order_id ${order_id} not found.);
        }
      } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).send("Internal server error.");
      }
    } else {
      // Các trạng thái khác
      console.log(
        Unknown payment status (${status}) for order_id: ${order_id}
      );
    }

    res.status(200).send("Webhook received.");
  }

  async createZaloPay(req, res) {
    const { userId, cartItems, billingInfo, totalPrice, orderId } = req.body;

    if (!userId || !cartItems || !totalPrice || !orderId || !billingInfo) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const YOUR_DOMAIN = process.env.YOUR_DOMAIN; // Thay thế bằng FE URL thực tế

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      order.billingInfo = billingInfo;
      order.paymentMethod = "ZaloPay";

      await order.save();
      const orderCode = order.orderCode;
      const app_trans_id = order.app_trans_id;

      const embed_data = {
        redirecturl: ${YOUR_DOMAIN}/payment-result?paymentMethod=ZaloPay&orderCode=${orderCode}&app_trans_id=${app_trans_id},
      };
      const items = cartItems.map((item) => ({
        itemid: item.productId.toString(),
        itename:
          item.name.length > 20
            ? item.name.substring(0, 20) + "..."
            : item.name, // Giảm độ dài tên sản phẩm
        itemprice: item.price,
        itemquantity: item.quantity,
      }));

      const orderData = {
        app_id: zaloPayConfig.app_id,
        app_user: userId,
        app_time: Date.now(), // Thời gian tính bằng giây
        app_trans_id: app_trans_id,
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totalPrice,
        description: Payment for order #${orderCode},
        bank_code: "zalopayapp", // Xác nhận lại giá trị này
        orderCode: orderCode,
        callback_url: Zalopay_URL, // Đảm bảo đã cấu hình đúng
      };

      const data = ${orderData.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item};
      orderData.mac = CryptoJS.HmacSHA256(data, zaloPayConfig.key1).toString(); // Tạo MAC để chứng thực

      // Log dữ liệu được gửi tới ZaloPay
      console.log("Sending order data to ZaloPay:", orderData);

      // Gửi yêu cầu tạo đơn hàng tới ZaloPay
      const response = await axios.post(
        zaloPayConfig.endpoint,
        querystring.stringify(orderData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("ZaloPay Response:", response.data);

      if (response.data.return_code === 1) {
        res.status(200).json({
          payUrl: response.data.order_url, // URL thanh toán từ ZaloPay
          zp_trans_token: response.data.zp_trans_token, // Token giao dịch từ ZaloPay
          orderCode: orderCode, // Trả về orderCode từ đơn hàng của bạn
          app_trans_id: app_trans_id, // Trả về app_trans_id từ đơn hàng của bạn
        });
      } else {
        console.error("ZaloPay returned an error:", response.data);
        res.status(400).json({ message: response.data.return_message });
      }
    } catch (error) {
      console.error(
        "Error creating ZaloPay order:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ message: "Error creating ZaloPay order." });
    }
  }

  // Xử lý callback từ ZaloPay
  async zaloPayWebhook(req, res) {
    const payload = req.body;

    console.log("Received ZaloPay webhook payload:", payload);

    // Kiểm tra sự tồn tại của các trường cần thiết
    if (!payload || !payload.data || !payload.mac) {
      console.error("Invalid webhook payload.");
      return res.status(400).send("Invalid payload.");
    }

    const dataStr = payload.data;
    const receivedMac = payload.mac;

    // Tạo MAC từ dataStr bằng key2
    const computedMac = CryptoJS.HmacSHA256(
      dataStr,
      zaloPayConfig.key2
    ).toString();

    if (computedMac !== receivedMac) {
      console.error("Invalid ZaloPay signature.");
      return res.status(400).send("Invalid signature.");
    }

    // Parse dataStr thành đối tượng JSON
    let data;
    try {
      data = JSON.parse(dataStr);
      console.log("Parsed data:", data);
    } catch (err) {
      console.error("Error parsing webhook data:", err);
      return res.status(400).send("Invalid data format.");
    }

    const { type, app_trans_id, zp_trans_id, amount, server_time } = data;

    if (type === 1) {
      // Payment success
      console.log(Payment success for app_trans_id: ${app_trans_id});

      try {
        // Tìm đơn hàng bằng app_trans_id
        const order = await Order.findOne({ app_trans_id: app_trans_id });

        if (order) {
          console.log(
            Found order: ${order._id}, current paymentStatus: ${order.paymentStatus}
          );
          if (order.paymentStatus.toLowerCase() !== "paid") {
            order.paymentStatus = "paid"; // Đặt trạng thái là 'paid'
            order.orderStatus = "Confirmed"; // Cập nhật trạng thái đơn hàng nếu cần
            await order.save();
            console.log(Order ${order._id} has been marked as paid.);
          } else {
            console.log(Order ${order._id} is already marked as paid.);
          }
        } else {
          console.error(Order with app_trans_id ${app_trans_id} not found.);
        }
      } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).send("Internal server error.");
      }
    } else {
      // Payment failed hoặc các loại khác
      console.log(
        Payment failed or unknown type for app_trans_id: ${app_trans_id}
      );

      try {
        // Tìm đơn hàng bằng app_trans_id
        const order = await Order.findOne({ app_trans_id: app_trans_id });

        if (order) {
          console.log(
            Found order: ${order._id}, current paymentStatus: ${order.paymentStatus}
          );
          if (order.paymentStatus.toLowerCase() !== "failed") {
            order.paymentStatus = "failed"; // Đặt trạng thái là 'failed'
            order.orderStatus = "Payment Failed"; // Cập nhật trạng thái đơn hàng nếu cần
            await order.save();
            console.log(Order ${order._id} has been marked as failed.);
          } else {
            console.log(Order ${order._id} is already marked as failed.);
          }
        } else {
          console.error(Order with app_trans_id ${app_trans_id} not found.);
        }
      } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).send("Internal server error.");
      }
    }

    res.status(200).send("Webhook received.");
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
      console.log(Updating order paymentStatus to: ${status});

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
          message: Đơn hàng #${order.orderCode} đã được thanh toán thành công.,
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
  // async getOrderByAppTransId(req, res) {
  //   const { app_trans_id } = req.query;

  //   if (!app_trans_id) {
  //     return res.status(400).json({ message: "Missing app_trans_id." });
  //   }

  //   try {
  //     const order = await Order.findOne({ app_trans_id: app_trans_id });

  //     if (!order) {
  //       return res.status(404).json({ message: "Order not found." });
  //     }

  //     res.json(order);
  //   } catch (error) {
  //     console.error("Error fetching order by app_trans_id:", error);
  //     res.status(500).json({ message: "Error fetching order." });
  //   }
  // }

  async createOrderCOD(req, res) {
    try {
      console.log("Payload received in backend:", req.body);
      const {
        orderId,
        totalPrice,
        cartItems,
        billingInfo,
        userId,
        paymentMethod,
      } = req.body;

      // Kiểm tra xem các trường cần thiết có đủ không
      if (
        (!orderId || !totalPrice || !cartItems || !billingInfo || !userId,
        !paymentMethod)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu thông tin đơn hàng" });
      }

      const newOrder = new Order({
        orderId: orderId,
        userId,
        cartItems,
        totalPrice,
        billingInfo,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Processing",
      });

      // Lưu đơn hàng vào cơ sở dữ liệu
      await newOrder.save();

      res.status(201).json({
        success: true,
        message: "Đặt hàng thành công",
        order: newOrder,
      });
    } catch (error) {
      console.error("Error in createOrderCOD:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }
  async getOrder(req, res) {
    const { userId } = req.params; // Lấy userId từ URL
    console.log(req.params); // In ra toàn bộ req.params để kiểm tra

    try {
      // Chuyển userId từ chuỗi sang ObjectId trước khi truy vấn
      const orders = await Order.find({
        userId: mongoose.Types.ObjectId(userId),
      });

      console.log(orders); // In ra kết quả truy vấn

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this user" });
      }

      res.json(orders); // Trả về danh sách đơn hàng nếu có
    } catch (error) {
      console.log("Error fetching orders:", error); // Ghi lại lỗi nếu có
      res.status(500).json({ message: "Error fetching orders", error });
    }
  }

  async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.log("Error updating order status:", error);
      res.status(500).json({ message: "Error updating order status", error });
    }
  }

  // Tổng quan đơn hàng
  async summary(req, res) {
    try {
      const totalOrders = await Order.countDocuments();
      const completedOrders = await Order.countDocuments({
        status: "completed",
      });
      const ordersInProcess = await Order.countDocuments({
        status: "processing",
      });

      const revenue = await Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]);

      res.json({
        totalOrders,
        completedOrders,
        ordersInProcess,
        revenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy tổng quan đơn hàng", error });
    }
  }
  async lowstock(req, res) {
    try {
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } }) // Lọc các sản phẩm có stock dưới 10
        .select("name stock") // Chỉ lấy tên và số lượng tồn kho
        .sort({ stock: 1 }) // Sắp xếp theo số lượng tồn kho tăng dần
        .limit(5); // Giới hạn kết quả trả về

      res.json(lowStockProducts);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Error fetching low stock products" });
    }
  }
  async topselling(req, res) {
    try {
      const topSellingProducts = await Order.aggregate([
        { $unwind: "$cartItems" }, // Mở rộng các mục trong giỏ hàng (cartItems)
        {
          $group: {
            _id: "$cartItems.productId", // Nhóm theo productId
            totalSold: { $sum: "$cartItems.quantity" }, // Tính tổng số lượng đã bán
          },
        },
        {
          $lookup: {
            from: "products", // Tên collection product trong MongoDB
            localField: "_id", // Khóa chính productId
            foreignField: "_id", // Khóa phụ bên product
            as: "productInfo", // Thêm thông tin sản phẩm
          },
        },
        { $unwind: "$productInfo" }, // Mở rộng thông tin sản phẩm
        {
          $project: {
            _id: 0,
            name: "$productInfo.name",
            unitsSold: "$totalSold",
          },
        },
        { $sort: { unitsSold: -1 } }, // Sắp xếp theo số lượng bán giảm dần
        { $limit: 5 }, // Giới hạn kết quả trả về
      ]);

      res.json(topSellingProducts);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      res.status(500).json({ message: "Error fetching top selling products" });
    }
  }
  async getAllOrders(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }
      const orders = await Order.find()
        .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
        .populate("userId", "username email")
        .populate("cartItems.productId", "name price");
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Error fetching orders." });
    }
  }
  async getOrderById(req, res) {
    try {
      const { id } = req.params; // Lấy 'id' từ req.params
      console.log("Order ID:", id);

      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Truy cập bị từ chối. Bạn không có quyền admin." });
      }

      const order = await Order.findById(id)
        .populate("userId", "username email") // Lấy thông tin người dùng
        .populate("cartItems.productId", "name price"); // Lấy thông tin sản phẩm (nếu cần)

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Error fetching order details." });
    }
  }
}

module.exports = new orderController();
