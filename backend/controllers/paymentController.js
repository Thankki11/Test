const moment = require("moment");
const crypto = require("crypto");
let { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = require("../config/vnpConfig");
const { sortObject } = require("../utils/vnpay");
const Order = require("../models/orderModel"); // Import model Order

exports.createPayment = (req, res) => {
  const { amount, bankCode, language, currency } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Số tiền không hợp lệ." });
  }

  // Chuyển đổi USD sang VND nếu đơn vị tiền tệ là USD
  const exchangeRate = 23500; // Tỷ giá hối đoái USD -> VND

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");
  let orderId = moment(date).format("DDHHmmss");
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: Math.round(amount * exchangeRate)*100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Payment for order ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Locale: language || "vn",
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Sắp xếp các tham số theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo URLSearchParams từ vnp_Params
  const params = new URLSearchParams();
  Object.entries(vnp_Params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  // Tạo chữ ký bảo mật (vnp_SecureHash)
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(params.toString(), "utf-8")).digest("hex");
  params.append("vnp_SecureHash", signed);

  // Tạo URL thanh toán
  const vnpUrl = `${vnp_Url}?${params.toString()}`;

  res.status(200).json({ paymentUrl: vnpUrl });
};

exports.vnpayIpn = (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);

  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp các tham số theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo URLSearchParams từ vnp_Params
  const params = new URLSearchParams();
  Object.entries(vnp_Params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  // Tạo chữ ký bảo mật (vnp_SecureHash)
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(params.toString(), "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (rspCode === "00") {
      // Thanh toán thành công
      res.status(200).json({ RspCode: "00", Message: "Success" });
    } else {
      // Thanh toán thất bại
      res.status(400).json({ message: "Payment failed. Please try again." });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

exports.vnpayReturn = async (req, res) => {
  console.log("Request body:", req.body);

  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp các tham số theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo chữ ký bảo mật (vnp_SecureHash)
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(new URLSearchParams(vnp_Params).toString(), "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      try {
        // Lưu thông tin đơn hàng vào cơ sở dữ liệu
        const order = new Order({
          customerName: req.body.customerName,
          phoneNumber: req.body.phoneNumber,
          emailAddress: req.body.emailAddress,
          address: req.body.address,
          paymentMethod: "vnpay",
          note: req.body.note,
          agreeTerms: req.body.agreeTerms,
          items: req.body.items,
          totalPrice: req.body.totalPrice,
        });

        await order.save();

        // Xóa giỏ hàng (giả định giỏ hàng lưu trong session)
        req.session.cart = null;

        // Trả về phản hồi thành công
        return res.status(200).json({ success: true, message: "Payment successful" });
      } catch (err) {
        console.error("Error saving order:", err);
        return res.status(500).json({ success: false, message: "Failed to save order" });
      }
    } else {
      // Thanh toán thất bại
      return res.status(400).json({ success: false, message: "Payment failed" });
    }
  } else {
    // Chữ ký không hợp lệ
    return res.status(400).json({ success: false, message: "Invalid checksum" });
  }
};
