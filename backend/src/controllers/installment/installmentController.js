// controllers/installmentController.js

const Installment = require("../../models/installmentModel");
const InstallmentPayment = require("../../models/installmentPaymentModel");

class InstallmentController {
  async getInstallmentDetails(req, res) {
    try {
      const { installmentId } = req.params;
      const installment = await Installment.findById(installmentId);
      if (!installment) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin trả góp." });
      }

      const payments = await InstallmentPayment.find({
        installmentId: installment._id,
      });

      res.status(200).json({ installment, payments });
    } catch (error) {
      console.error("Error fetching installment details:", error);
      res.status(500).json({ message: "Lỗi server nội bộ." });
    }
  }
  async getInstallmentSummary(req, res) {
    try {
      const totalInstallments = await Installment.countDocuments();
      const completedInstallments = await Installment.countDocuments({
        status: "Completed",
      });
      const installmentsInProcess = await Installment.countDocuments({
        status: "Pending",
      });
      const overdueInstallments = await Installment.countDocuments({
        status: "Overdue",
      });

      res.status(200).json({
        totalInstallments,
        completedInstallments,
        installmentsInProcess,
        overdueInstallments,
      });
    } catch (error) {
      console.error("Error fetching installment summary:", error);
      res.status(500).json({ message: "Error fetching installment summary" });
    }
  }

  async getAllInstallments(req, res) {
    try {
      const installments = await Installment.find()
        .populate("orderId", "orderCode totalPrice")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: installments.length,
        data: installments,
      });
    } catch (error) {
      console.error("Error fetching installments:", error);
      res.status(500).json({ message: "Error fetching installments" });
    }
  }

  async getDetailedInstallmentSummary(req, res) {
    try {
      const totalInstallments = await Installment.countDocuments();
      const completedInstallments = await Installment.countDocuments({
        status: "Completed",
      });
      const installmentsInProcess = await Installment.countDocuments({
        status: "Pending",
      });
      const overdueInstallments = await Installment.countDocuments({
        status: "Overdue",
      });

      const totalAmount = await Installment.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      const averageInterestRate = await Installment.aggregate([
        {
          $group: {
            _id: null,
            averageInterestRate: { $avg: "$interestRate" },
          },
        },
      ]);

      res.status(200).json({
        totalInstallments,
        completedInstallments,
        installmentsInProcess,
        overdueInstallments,
        totalAmount: totalAmount[0] ? totalAmount[0].totalAmount : 0,
        averageInterestRate: averageInterestRate[0]
          ? averageInterestRate[0].averageInterestRate
          : 0,
      });
    } catch (error) {
      console.error("Error fetching detailed installment summary:", error);
      res
        .status(500)
        .json({ message: "Error fetching detailed installment summary" });
    }
  }

  async createInstallment(req, res) {
    try {
      const { order, user, amount, dueDate } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!order || !user || !amount || !dueDate) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp đầy đủ thông tin" });
      }

      const installment = new Installment({
        order,
        user,
        amount,
        dueDate,
      });

      const savedInstallment = await installment.save();
      res.status(201).json(savedInstallment);
    } catch (error) {
      console.error("Error creating installment:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

module.exports = new InstallmentController();
