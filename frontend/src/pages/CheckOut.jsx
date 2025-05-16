import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Table from "../components/Table";
import CustomForm from "../components/CustomForm";
import PageHeader from "../components/PageHeader/PageHeader";
import img1 from "../assets/images/menus/menu-slider-1.jpg";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CheckOut() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Mỗi sản phẩm sẽ có trường `discount`
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
  });
  const [voucherCode, setVoucherCode] = useState(""); // State để lưu mã voucher
  const [discount, setDiscount] = useState(0); // State để lưu giá trị giảm giá
  const [showVoucherInput, setShowVoucherInput] = useState(false); // State để hiển thị ô nhập voucher

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      localStorage.setItem("redirectUrl", "/check-out");
      navigate("/login");
    }
  }, [navigate]);

  const selectedData = items
  .filter((item) => selectedItems.includes(item._id))
  .map((item) => ({
    ...item,
    total: item.discount
      ? item.price * item.quantity * (1 - item.discount / 100)
      : item.price * item.quantity, // Áp dụng giảm giá nếu có
  }));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Unit Price ($)",
      accessor: "price",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    {
      header: "Subtotal ($)",
      accessor: "total",
      cell: (value) => `$${value.toFixed(2)}`,
    },
  ];

  const totalAmount = selectedData.reduce((sum, item) => sum + item.total, 0);

  const discountedTotal = totalAmount - (totalAmount * discount) / 100; // Tổng tiền sau giảm giá

  const fields = [
    {
      name: "customerName",
      label: "Full Name",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "address",
      label: "Delivery Address",
      type: "text",
      placeholder: "Street, district, city...",
      required: true,
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      options: [
        { label: "Cash on Delivery (COD)", value: "cod" },
        { label: "VNPay", value: "vnpay" },
      ],
      required: true,
    },
    {
      name: "note",
      label: "Additional Notes",
      type: "text",
      placeholder: "E.g. Deliver after 6 PM, no chili...",
      required: false,
    },
    {
      name: "agreeTerms",
      label: "I agree to the terms and conditions",
      type: "checkbox",
      required: true,
    },
  ];

  const handleApplyVoucher = async (itemId) => {
    try {
      if (!voucherCode.trim()) {
        // Nếu mã voucher để trống
        const updatedItems = items.map((item) =>
          item._id === itemId ? { ...item, discount: null } : item
        );
        setItems(updatedItems);
        alert("Voucher code cannot be empty.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/vouchers/validate",
        { code: voucherCode }
      );
      const { discount } = response.data;

      // Cập nhật giảm giá cho sản phẩm được chọn
      const updatedItems = items.map((item) =>
        item._id === itemId ? { ...item, discount } : item
      );
      setItems(updatedItems);

      alert(`Voucher applied successfully! Discount: ${discount}% for item ${itemId}`);
    } catch (err) {
      console.error("Error validating voucher:", err);

      // Nếu mã voucher không hợp lệ
      const updatedItems = items.map((item) =>
        item._id === itemId ? { ...item, discount: null } : item
      );
      setItems(updatedItems);

      alert("Invalid voucher code. Please try again.");
    }
  };

  const handleSubmit = async (data) => {
    console.log("Form data:", data);

    const phoneRegex = /^[0-9]{10}$/; // Biểu thức chính quy kiểm tra 10 chữ số
    if (!phoneRegex.test(data.phoneNumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn đặt hàng không?");
    if (!confirm) return;

    try {
      const order = {
        ...data,
        items: items
          .filter((item) => selectedItems.includes(item._id))
          .map((item) => ({
            menuItemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        totalPrice: discountedTotal, // Sử dụng tổng tiền sau giảm giá
        createdAt: new Date().toISOString(),
      };
      const token = localStorage.getItem("token");

      if (data.paymentMethod === "vnpay") {
        const orderRes = await axios.post(
          "http://localhost:3001/api/orders/add-order",
          order,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Gọi API create_payment_url để lấy URL thanh toán
        const response = await axios.post(
          "http://localhost:3001/api/payment/create_payment_url",
          {
            amount: discountedTotal, // Sử dụng tổng tiền sau giảm giá
            bankCode: "VNPAY",
            paymentMethod: "vnpay",
            language: "vn",
            orderId: orderRes.data._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.paymentUrl) {
          // Xoá giỏ hàng
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));

          // Điều hướng đến VNPay
          window.location.href = response.data.paymentUrl;
        }
      } else {
        // Xử lý thanh toán COD
        await axios.post("http://localhost:3001/api/orders/add-order", order, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Xóa các sản phẩm đã đặt khỏi giỏ hàng
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        if (cart.items) {
          cart.items = cart.items.filter(
            (item) => !selectedItems.includes(item._id)
          );
          localStorage.setItem("cart", JSON.stringify(cart));
        }

        window.dispatchEvent(new Event("cartUpdated"));

        alert("Đặt hàng thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const handleSelect = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId];

      console.log("Danh sách món đã chọn:", newSelected);
      return newSelected;
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:3001/api/auth/user/info",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = response.data;
        setFormData({
          customerName: user.username || "",
          phoneNumber: user.phone || "",
          emailAddress: user.email || "",
          address: user.address || "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
      };
      setItems(savedCart.items);
    };

    fetchUserInfo();
    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateCart = (updatedItems) => {
    setItems(updatedItems);
    const updatedCart = {
      cartId: "67fb8e201f70bf74520565e7",
      items: updatedItems,
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedItems = items.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = (id) => {
    const updatedItems = items.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const updatedItems = items.filter((item) => item._id !== id);
      updateCart(updatedItems);
    }
  };

  const handlePayment = () => {
    // Logic thanh toán
    console.log("Proceeding to payment...");
  };

  return (
    <>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={"Check out"}
        subTitle={""}
        height="20vh"
        titleSize="8rem"
      />
      <div className="section">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <h2
                  className="fw-bold text-center"
                  style={{ fontSize: "35px" }}
                >
                  1. Select your stuffs to checkout
                </h2>

                {items.length === 0 ? (
                  <div>
                    <p
                      className="text-center mt-4 p-3 rounded"
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        border: "1px solid #f5c6cb",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Your cart is currently empty. Please add some items to
                      proceed with checkout.
                    </p>
                    <div
                      className="d-flex justify-content-center"
                      style={{ gap: "40px" }}
                    >
                      <Link to="/menus">
                        <button>Go to menus</button>
                      </Link>
                      <Link to="/shop">
                        <button>Go to shop</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: "75vh",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      paddingRight: "10px",
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="form-check d-flex align-items-start mb-3"
                      >
                        <div className="ms-3 w-100">
                          <CartItem
                            item={item}
                            onIncrease={increaseQuantity}
                            onDecrease={decreaseQuantity}
                            onDelete={deleteItem}
                            extraElement={
                              <>
                                <button
                                  onClick={() => handleSelect(item._id)}
                                  className={`btn-select ${
                                    selectedItems.includes(item._id)
                                      ? "selected"
                                      : ""
                                  }`}
                                >
                                  {selectedItems.includes(item._id)
                                    ? "Selected"
                                    : "Unselect"}
                                </button>
                                {showVoucherInput === item._id ? (
                                  <div style={{ marginTop: "10px" }}>
                                    <input
                                      type="text"
                                      placeholder="Enter voucher code"
                                      value={voucherCode}
                                      onChange={(e) =>
                                        setVoucherCode(e.target.value)
                                      }
                                      className="form-control mb-2"
                                    />
                                    <button
                                      onClick={() =>
                                        handleApplyVoucher(item._id)
                                      }
                                      className="btn btn-primary"
                                    >
                                      Apply Voucher
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setShowVoucherInput(item._id)
                                    }
                                    className="btn btn-secondary mt-2"
                                  >
                                    Add Voucher
                                  </button>
                                )}
                              </>
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-8">
                <div className="card">
                  <div className="card-body">
                    <div className=" d-flex justify-content-center align-items-center">
                      <h2 style={{ fontSize: "35px" }}>2. Review Your Order</h2>
                    </div>
                    <ul>
                      <li>
                        <Table columns={columns} data={selectedData} />
                      </li>
                      <li>
                        <h2 style={{ fontSize: "18px", marginTop: "20px" }}>
                          Total: ${discountedTotal.toFixed(2)}{" "}
                          {/* {discount > 0 && (
                            <span style={{ color: "green" }}>
                              (Discount applied: {discount}%)
                            </span>
                          )} */}
                        </h2>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12" style={{ paddingTop: "100px" }}>
                  {selectedItems.length > 0 ? (
                    <>
                      <h2 className="text-center" style={{ fontSize: "35px" }}>
                        3. Billing details
                      </h2>
                      <CustomForm
                        fields={fields}
                        initialValues={{
                          customerName: formData.customerName,
                          phoneNumber: formData.phoneNumber,
                          emailAddress: formData.emailAddress,
                          address: formData.address,
                        }}
                        onSubmit={handleSubmit}
                        buttonText="Place Order"
                      />
                    </>
                  ) : (
                    <p
                      className="text-center mt-4 p-3 rounded"
                      style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        border: "1px solid #ffeeba",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Please select at least one item to proceed with checkout.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
}

export default CheckOut;
