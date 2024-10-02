const Order = require("../../models/orderModel");
const Product = require("../../models/productModel"); // Bổ sung import Product
const crypto = require("crypto");
const mongoose = require("mongoose");
class orderController {
  // Tạo đơn hàng mới
  async create(req, res) {
    try {
      const { userId, cartItems, totalPrice } = req.body;

      // Kiểm tra xem có nhận được đúng giá trị hay không
      console.log("Payload received in backend:", req.body);

      // Kiểm tra nếu thiếu dữ liệu
      if (!userId || !cartItems || !totalPrice) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Tạo đơn hàng mới
      const newOrder = new Order({
        userId,
        cartItems,
        totalPrice,
      });

      // Lưu đơn hàng vào cơ sở dữ liệu
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  }
  // Xử lý thanh toán MoMo
  async momoPayment(req, res) {
    try {
      const { orderId, totalPrice } = req.body;

      const momoRequestData = {
        partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
        accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
        secretKey:
          process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        requestId: `${orderId}_${Date.now()}`,
        amount: totalPrice.toString(),
        orderId: orderId,
        orderInfo: `Payment for order #${orderId}`,
        returnUrl: "http://localhost:3001/payment-result",
        notifyUrl:
          "https://b2e2-58-186-47-254.ngrok-free.app/api/orders/momo/ipn",
        requestType: "captureMoMoWallet",
        extraData: "",
      };
      console.log(momoRequestData);
      const rawSignature = `partnerCode=${momoRequestData.partnerCode}&accessKey=${momoRequestData.accessKey}&requestId=${momoRequestData.requestId}&amount=${momoRequestData.amount}&orderId=${momoRequestData.orderId}&orderInfo=${momoRequestData.orderInfo}&returnUrl=${momoRequestData.returnUrl}&notifyUrl=${momoRequestData.notifyUrl}&extraData=${momoRequestData.extraData}`;

      momoRequestData.signature = crypto
        .createHmac("sha256", momoRequestData.secretKey)
        .update(rawSignature)
        .digest("hex");

      const response = await fetch(
        "https://test-payment.momo.vn/gw_payment/transactionProcessor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(momoRequestData),
        }
      );

      const data = await response.json();

      if (data.payUrl) {
        res.json({ payUrl: data.payUrl });
      } else {
        res.status(400).json({ message: "MoMo payment failed", data });
      }
    } catch (error) {
      console.error("Error with MoMo payment", error);
      res
        .status(500)
        .json({ message: "Error processing payment request", error });
    }
  }

  // Nhận thông báo từ MoMo
  async MomoIPN(req, res) {
    console.log("MomoIPN", MomoIPN);
    try {
      const { orderId, resultCode } = req.body;
      console.log(req.body);

      if (resultCode === 0) {
        // Thanh toán thành công
        await Order.findByIdAndUpdate(orderId, { status: "Paid" });
        return res
          .status(200)
          .json({ message: "Payment successful and order status updated." });
      } else {
        // Thanh toán thất bại hoặc hủy bỏ
        await Order.findByIdAndUpdate(orderId, { status: "Failed" });
        return res
          .status(200)
          .json({ message: "Payment failed or cancelled." });
      }
    } catch (error) {
      console.error("Error processing MoMo IPN:", error);
      return res
        .status(500)
        .json({ message: "Error processing payment notification." });
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
}

module.exports = new orderController();
