const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); //Chỉ định rõ

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
require("./config/passportConfig"); // Import cấu hình Passport
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const comboRoutes = require("./routes/comboRoutes");
const app = express();

// Kết nối đến MongoDB
connectDB();
// Kết nối đến MongoDB


// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Giới hạn 10MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Thêm SESSION_SECRET vào .env
    resave: false,
    saveUninitialized: true,
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/menus", menuRoutes);
app.use("/api/carts", cartRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/auth/user", userAuthRoutes);
// app.use("/api/auth", userAuthRoutes); // Thêm route auth cho người dùng

// Thêm route upload ảnh
app.use("/api", uploadRoutes);

// Upload: Cho phép truy cập vào thư mục uploads
app.use("/uploads", express.static("uploads"));

// Thêm
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Thêm route employees
app.use("/api/employees", employeeRoutes);

// Thêm route voucher
app.use("/api/vouchers", voucherRoutes);

// Thêm route combos
app.use("/api/combos", comboRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
