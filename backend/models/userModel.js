const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Biểu thức chính quy kiểm tra 10 chữ số
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: function () {
      return !this.isOAuth; // Chỉ yêu cầu phone nếu không phải từ OAuth
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.isOAuth; // Chỉ yêu cầu password nếu không phải từ OAuth
    },
  },
  avatar: {
    type: String,
    default: "http://localhost:3001/uploads/users/default-avatar.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isOAuth: {
    type: Boolean,
    default: false, // Đánh dấu tài khoản là từ OAuth
  },
  provider: {
    type: String, // Lưu thông tin provider (google hoặc facebook)
    default: null,
  },
  address: {
    type: String, // Thêm trường address
    default: "", // Đặt giá trị mặc định là chuỗi rỗng
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);