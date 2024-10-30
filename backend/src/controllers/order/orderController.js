// controllers/orderController.js
const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const moment = require("moment");
const mongoose = require("mongoose");
const Installment = require("../../models/installmentModel");
const installmentService = require("../../utils/installmentService");
const InstallmentPayment = require("../../models/installmentPaymentModel");
const { sendOrderConfirmationToCustomer } = require("../../utils/emailService");

class OrderController {
  async create(req, res) {
    try {
      const {
        userId,
        cartItems,
        totalPrice,
        installmentPlan,
        paymentMethod,
        billingInfo,
      } = req.body;

      // Kiểm tra các trường bắt buộc
      if (
        !userId ||
        !cartItems ||
        !totalPrice ||
        !billingInfo ||
        !paymentMethod
      ) {
        return res
          .status(400)
          .json({ message: "Dữ liệu đơn hàng không hợp lệ" });
      }

      const transID = Math.floor(Math.random() * 1000000);

      // **Tạo đơn hàng trước**
      const newOrder = new Order({
        userId,
        cartItems,
        totalPrice,
        orderCode: Date.now(),
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
        paymentMethod,
        billingInfo,
      });

      const savedOrder = await newOrder.save();

      // **Sau đó, nếu có trả góp, tạo bản ghi Installment**
      let installmentId = null;
      if (installmentPlan && ["3", "6", "12"].includes(installmentPlan)) {
        const installmentData = installmentService.calculateInstallment(
          totalPrice,
          installmentPlan
        );
        const installment = new Installment({
          orderId: savedOrder._id, // Sử dụng orderId vừa tạo
          ...installmentData,
        });
        const savedInstallment = await installment.save();
        installmentId = savedInstallment._id;

        // **Cập nhật installmentId vào đơn hàng**
        savedOrder.installmentId = installmentId;
        await savedOrder.save();

        // **Tạo các kỳ thanh toán trả góp (InstallmentPayment)**
        const numberOfPayments = parseInt(installmentPlan, 10);
        const installmentPayments = [];

        for (let i = 1; i <= numberOfPayments; i++) {
          installmentPayments.push({
            installmentId: savedInstallment._id,
            paymentNumber: i,
            amount: savedInstallment.monthlyPayment,
            dueDate: moment()
              .add(i - 1, "months")
              .toDate(),
            status: "Pending",
          });
        }

        await InstallmentPayment.insertMany(installmentPayments);
      }

      // Gửi email xác nhận đơn hàng
      await sendOrderConfirmationToCustomer(savedOrder);

      res.status(201).json({ order: savedOrder });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      res.status(500).json({ message: "Lỗi khi tạo đơn hàng" });
    }
  }

  async createOrderCOD(req, res) {
    try {
      const {
        orderId,
        totalPrice,
        cartItems,
        billingInfo,
        userId,
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

      await newOrder.save();

      res.status(201).json({
        success: true,
        message: "Đặt hàng thành công",
        order: newOrder,
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng COD:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  }

  async getOrder(req, res) {
    const { userId } = req.params;

    try {
      const orders = await Order.find({
        userId: mongoose.Types.ObjectId(userId),
      });

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn hàng cho người dùng này" });
      }

      res.json(orders);
    } catch (error) {
      console.log("Lỗi khi lấy đơn hàng:", error);
      res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error });
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
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      res.json(order);
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error });
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
        .populate("userId", "username email")
        .populate("cartItems.productId", "name price")
        .populate("installmentId");
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

module.exports = new OrderController();
