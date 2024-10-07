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
      const {
        orderId,
        userId,
        totalPrice,
        cartItems,
        billingInfo,
        paymentMethod,
      } = req.body;
      if (
        !orderId ||
        !totalPrice ||
        !cartItems ||
        !billingInfo ||
        !userId ||
        !paymentMethod
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu thông tin đơn hàng" });
      }
      const momoRequestData = {
        partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
        accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
        secretKey:
          process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        requestId: `${orderId}_${Date.now()}`,
        amount: totalPrice.toString(),
        orderId: orderId,
        orderInfo: `Payment for order #${orderId}`,
        billingInfo,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Processing",
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

      // http://localhost:3001/payment-result?partnerCode=MOMO&accessKey=F8BBA842ECF85&requestId=66feb2621e9e73ca52feef69_1727967844674&amount=2121&orderId=66feb2621e9e73ca52feef69&orderInfo=Payment%20for%20order%20%2366feb2621e9e73ca52feef69&orderType=momo_wallet&transId=4180794999&message=Success&localMessage=Th%C3%A0nh%20c%C3%B4ng&responseTime=2024-10-03%2022:07:11&errorCode=0&payType=web&extraData=&signature=0430d0b98c3af98a268c812a8472b662d559b54e513d758885dbbed2da04c627
      /*{
  "partnerCode": "MOMO",
  "accessKey": "F8BBA842ECF85",
  "requestId": "66feb2621e9e73ca52feef69_1727967844674",
  "amount": "2121",
  "orderId": "66feb2621e9e73ca52feef69",
  "orderInfo": "Payment for order #66feb2621e9e73ca52feef69",
  "orderType": "momo_wallet",
  "transId": "4180794999",
  "message": "Success",
  "localMessage": "Thành công",
  "responseTime": "2024-10-03 22:07:11",
  "errorCode": "0",
  "payType": "web",
  "extraData": "",
  "signature": "0430d0b98c3af98a268c812a8472b662d559b54e513d758885dbbed2da04c627"
}
*/

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
    try {
      const data = req.body;
      console.log("MoMo IPN Data:", data);

      // Xác thực chữ ký (signature) nếu cần thiết

      const orderId = data.orderId;
      const order = await Order.findById(orderId);

      if (order) {
        if (data.errorCode === "0") {
          order.paymentStatus = "Paid";
          order.orderStatus = "Confirmed";
          await order.save();
          res.status(200).json({ message: "Order updated successfully" });
        } else {
          order.paymentStatus = "Failed";
          order.orderStatus = "Cancelled";
          await order.save();
          res
            .status(200)
            .json({ message: "Order updated with failure status" });
        }
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.error("Error handling MoMo IPN", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

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
}

module.exports = new orderController();
