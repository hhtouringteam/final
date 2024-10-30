// utils/installmentService.js
class InstallmentService {
  calculateInstallment(totalPrice, plan) {
    let interestRate;
    switch (plan) {
      case "3":
        interestRate = 0.02; // Lãi suất 2% cho kỳ hạn 3 tháng
        break;
      case "6":
        interestRate = 0.04; // Lãi suất 4% cho kỳ hạn 6 tháng
        break;
      case "12":
        interestRate = 0.08; // Lãi suất 8% cho kỳ hạn 12 tháng
        break;
      default:
        throw new Error("Kế hoạch trả góp không hợp lệ");
    }

    const totalInterest = totalPrice * interestRate;
    const totalAmount = totalPrice + totalInterest;
    const monthlyPayment = totalAmount / parseInt(plan, 10);

    return {
      plan,
      interestRate,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }
}

module.exports = new InstallmentService();
