require("dotenv").config();

module.exports = {
  vnp_TmnCode: process.env.VNP_TMNCODE,
  vnp_HashSecret: process.env.VNP_HASHSECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_Api: process.env.VNP_API,
  vnp_ReturnUrl: process.env.VNP_RETURNURL,
};