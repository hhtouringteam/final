// services/paymentService.js
const axios = require("axios");
const CryptoJS = require("crypto-js");
const querystring = require("querystring");
const PayOS = require("@payos/node");

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
console.log("zaloPayConfig.key1:", zaloPayConfig);
class PaymentService {
  // PayOS Payment
  async createPayOSPaymentLink(paymentData) {
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
  async createZaloPayOrder(orderData) {
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
}

module.exports = new PaymentService();
