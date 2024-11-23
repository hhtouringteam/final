// services/paymentService.js

const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");
const PayOS = require("@payos/node");
const moment = require("moment"); // Đảm bảo đã nhập khẩu moment
const querystring = require("querystring");
const InstallmentPayment = require("../models/installmentPaymentModel");
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const zaloPayConfig = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

class PaymentService {
  // ... (các phương thức khác)
  static async createPayOSPaymentLink(paymentData) {
    try {
      const paymentLinkResponse = await payOS.createPaymentLink(paymentData);
      return paymentLinkResponse.checkoutUrl;
    } catch (error) {
      throw error;
    }
  }

  verifyPayOSSignature(dataStr, signature) {
    const computedSignature = CryptoJS.HmacSHA256(
      dataStr,
      process.env.PAYOS_SECRET_KEY
    ).toString();
    return computedSignature === signature;
  }

  // ZaloPay Payment
  static async createZaloPayOrder(orderData) {
    try {
      const data = `${orderData.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
      orderData.mac = CryptoJS.HmacSHA256(data, zaloPayConfig.key1).toString();

      const response = await axios.post(
        zaloPayConfig.endpoint,
        querystring.stringify(orderData),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  verifyZaloPaySignature(dataStr, receivedMac) {
    const computedMac = CryptoJS.HmacSHA256(
      dataStr,
      zaloPayConfig.key2
    ).toString();
    return computedMac === receivedMac;
  }

  static async createZaloPayPayment({
    amount,
    orderCode,
    description,
    orderId,
    paymentId,
  }) {
    try {
      // Chuyển đổi amount thành số nguyên
      const amountInt = Math.round(amount);
      const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

      // Tạo app_trans_id duy nhất
      const appTransId = `${moment().format("YYMMDD")}_${Date.now()}`;

      // Tạo embed_data với redirect URL bao gồm orderId và paymentId
      const embed_data = {
        redirecturl: `${YOUR_DOMAIN}/PaymentResultInstallment?paymentMethod=ZaloPay&orderId=${orderId}&paymentId=${paymentId}&app_trans_id=${appTransId}`,
      };

      const orderData = {
        app_id: zaloPayConfig.app_id,
        app_trans_id: appTransId,
        app_user: "user123", // Có thể là userId hoặc thông tin người dùng
        app_time: Date.now(),
        amount: amountInt,
        item: "[]",
        description: description,
        bank_code: "",
        embed_data: JSON.stringify(embed_data),
        callback_url: `${YOUR_DOMAIN}/api/payments/zalopay/webhook`,
        mac: "",
      };

      // Tính toán MAC
      const data =
        orderData.app_id +
        "|" +
        orderData.app_trans_id +
        "|" +
        orderData.app_user +
        "|" +
        orderData.amount +
        "|" +
        orderData.app_time +
        "|" +
        orderData.embed_data +
        "|" +
        orderData.item;

      orderData.mac = CryptoJS.HmacSHA256(data, zaloPayConfig.key1).toString();

      // Serialize dữ liệu bằng qs
      const postData = qs.stringify(orderData);

      // Gửi yêu cầu tới ZaloPay
      const response = await axios.post(zaloPayConfig.endpoint, postData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Ghi log phản hồi từ ZaloPay
      console.log("ZaloPay Response:", response.data);

      // Kiểm tra kết quả trả về
      if (response.data.return_code === 1) {
        const paymentUrl = response.data.order_url;

        // Lưu app_trans_id vào kỳ thanh toán trong cơ sở dữ liệu
        await InstallmentPayment.findByIdAndUpdate(paymentId, {
          app_trans_id: appTransId,
        });

        return paymentUrl;
      } else {
        throw new Error(`ZaloPay Error: ${response.data.return_message}`);
      }
    } catch (error) {
      // Ghi log lỗi chi tiết
      console.error("Error in createZaloPayPayment:", error);
      throw error;
    }
  }

  // ... (các phương thức khác)
}

module.exports = PaymentService;
