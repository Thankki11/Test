import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Table from "../components/Table";
import CustomForm from "../components/CustomForm";
import PageHeader from "../components/PageHeader/PageHeader";
import img1 from "../assets/images/menus/menu-slider-1.jpg";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "bootstrap";

function CheckOut() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Mỗi sản phẩm sẽ có trường `discount`
  const [combos, setCombos] = useState([]); // Danh sách combo
  const [vouchers, setVouchers] = useState([]); // Danh sách voucher
  const [availableVouchers, setAvailableVouchers] = useState([]); // Danh sách voucher có sẵn
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Voucher đã áp dụng
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

  // Hàm fetch dữ liệu voucher từ API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/vouchers");
        setVouchers(response.data); // Lưu danh sách voucher vào state
      } catch (err) {
        alert("Failed to load vouchers.");
      }
    };
    fetchVouchers();
  }, []);

  const selectedData = [
    ...items,
    ...combos, // Kết hợp cả items và combos
  ]
    .filter((itemOrCombo) => selectedItems.includes(itemOrCombo._id)) // Lọc các item/combo được chọn
    .map((itemOrCombo) => ({
      ...itemOrCombo,
      // Tính subtotal cho từng item/combo (tính giảm giá nếu có)
      discounted: appliedVoucher
        ? appliedVoucher.type === "PERCENT"
          ? itemOrCombo.price *
            itemOrCombo.quantity *
            (appliedVoucher.value / 100) // Giảm giá phần trăm cho cả item và combo
          : 0 // Giảm giá cố định cho item/combo (ở đây giả sử là 0)
        : itemOrCombo.price * itemOrCombo.quantity, // Nếu không có voucher, giữ nguyên giá
      total: itemOrCombo.price * itemOrCombo.quantity, // Tổng tiền cho từng item hoặc combo
    }));

  //Kiểm tra voucher có hợp lệ hay không
  const isVoucherApplicable = (voucher) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);

    // Kiểm tra ngày hiệu lực
    const isDateValid = currentDate >= startDate && currentDate <= endDate;

    // Kiểm tra giá trị đơn hàng tối thiểu
    const isMinOrderValid = subtotal >= voucher.min_order_value;

    // Kiểm tra voucher có active không
    const isActive = voucher.isActive;

    // Kiểm tra nếu voucher có áp dụng cho sản phẩm cụ thể
    const isProductSpecific =
      voucher.applied_products && voucher.applied_products.length > 0;

    // Nếu voucher áp dụng cho sản phẩm cụ thể, kiểm tra xem có sản phẩm nào trong giỏ hàng khớp không
    const hasMatchingProduct = isProductSpecific
      ? selectedItems.some((itemId) => {
          const item = items.find((i) => i._id === itemId);
          return item && voucher.applied_products.includes(item._id);
        })
      : true;

    return isDateValid && isMinOrderValid && isActive && hasMatchingProduct;
  };

  // Tính tổng tiền trước khi áp voucher
  const subtotal = selectedData.reduce((sum, item) => sum + item.total, 0);

  // Tính tổng tiền sau khi áp voucher
  const discountedTotal = appliedVoucher
    ? appliedVoucher.type === "PERCENT"
      ? subtotal * (1 - appliedVoucher.value / 100) // Giảm giá theo %
      : Math.max(0, subtotal - appliedVoucher.value) // Giảm giá cố định, đảm bảo không âm
    : subtotal; // Không có voucher

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Unit Price ($)",
      accessor: "price",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    {
      header: "Discounted ($)",
      accessor: "discounted",
      cell: (value, row) => {
        // Kiểm tra nếu discountType là FIXED
        if (!appliedVoucher) {
          return `-`;
        } else {
          if (appliedVoucher.type === "FIXED") {
            return "Applied Fixed"; // Hiển thị "Applied Fixed"
          } else {
            return `$${value.toFixed(2)}`; // Hiển thị số tiền giảm giá nếu discountType không phải FIXED
          }
        }
      },
    },
    {
      header: "Subtotal ($)",
      accessor: "total",
      cell: (value) => `$${value.toFixed(2)}`,
    },
  ];

  const totalAmount = selectedData.reduce((sum, item) => sum + item.total, 0);

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

  const handleSetVoucherCode = (content) => {
    setVoucherCode(content); // Cập nhật giá trị của voucherCode
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      alert("Please enter a voucher code");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item to apply voucher");
      return;
    }

    const foundVoucher = vouchers.find((v) => v.voucherCode === voucherCode);

    if (!foundVoucher) {
      alert("Voucher code not found");
      return;
    }

    // Kiểm tra xem voucher có thể áp dụng hay không
    const isApplicable = isVoucherApplicable(foundVoucher);

    if (!isApplicable) {
      alert("Voucher is not eligible. Please check the conditions.");
      return;
    }

    // Nếu voucher hợp lệ, áp dụng voucher
    setAppliedVoucher({
      code: foundVoucher.voucherCode,
      type: foundVoucher.discount_type,
      value: foundVoucher.discount_value,
    });
  };

  const handleSubmit = async (data) => {
    const phoneRegex = /^[0-9]{10}$/; // Biểu thức chính quy kiểm tra 10 chữ số
    if (!phoneRegex.test(data.phoneNumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn đặt hàng không?");
    if (!confirm) return;

    try {
      // Kết hợp items và combos vào cùng một mảng
      const allItems = [
        ...items.filter((item) => selectedItems.includes(item._id)),
        ...combos.filter((combo) => selectedItems.includes(combo._id)),
      ];

      const order = {
        ...data,
        items: allItems.map((itemOrCombo) => ({
          menuItemId: itemOrCombo._id,
          name: itemOrCombo.name,
          quantity: itemOrCombo.quantity,
          price: itemOrCombo.price,
          category:
            itemOrCombo.type === "combo" ? "combo" : itemOrCombo.category,
          type: itemOrCombo.type === "combo" ? itemOrCombo.type : "items",
        })),
        totalPrice: discountedTotal.toFixed(2), // Sử dụng tổng tiền sau giảm giá
        createdAt: new Date().toISOString(),
      };

      const token = localStorage.getItem("token");

      console.log("Order data:", order);

      if (data.paymentMethod === "vnpay") {
        // Gửi đơn hàng tới API
        const orderRes = await axios.post(
          "http://localhost:3001/api/orders/add-order",
          order,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Gọi API tạo URL thanh toán
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
          deleteCartItems();
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
        deleteCartItems();

        window.dispatchEvent(new Event("cartUpdated"));

        alert("Đặt hàng thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const deleteCartItems = () => {
    // Xóa các sản phẩm và combo đã đặt khỏi giỏ hàng
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    if (cart.items) {
      // Xóa các item đã chọn
      cart.items = cart.items.filter(
        (item) => !selectedItems.includes(item._id)
      );
    }

    if (cart.combos) {
      // Xóa các combo đã chọn
      cart.combos = cart.combos.filter(
        (combo) => !selectedItems.includes(combo._id)
      );
    }

    // Cập nhật lại giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleSelect = (id, type) => {
    setSelectedItems((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id];

      console.log(
        `Danh sách ${type === "combo" ? "combo" : "món ăn"} đã chọn:`,
        newSelected
      );
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
        combos: [],
      };
      setItems(savedCart.items); // Lưu danh sách items
      setCombos(savedCart.combos); // Lưu danh sách combos
    };

    fetchUserInfo();
    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateCart = (updatedItems, updatedCombos) => {
    setItems(updatedItems); // Cập nhật lại danh sách items
    setCombos(updatedCombos); // Cập nhật lại danh sách combos

    const updatedCart = {
      cartId: "67fb8e201f70bf74520565e7",
      items: updatedItems, // Cập nhật items
      combos: updatedCombos, // Cập nhật combos
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu vào localStorage
    window.dispatchEvent(new Event("cartUpdated")); // Gửi sự kiện để thông báo giỏ hàng đã cập nhật
  };

  const increaseQuantity = (id, type) => {
    // Cập nhật item trong giỏ hàng
    let updatedItems = [...items];
    let updatedCombos = [...combos];

    if (type === "item") {
      updatedItems = updatedItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else if (type === "combo") {
      updatedCombos = updatedCombos.map((combo) =>
        combo._id === id
          ? {
              ...combo,
              quantity: combo.quantity + 1,
            }
          : combo
      );
    }

    // Cập nhật lại giỏ hàng với cả items và combos
    updateCart(updatedItems, updatedCombos);

    // Thông báo cập nhật giỏ hàng
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = (id, type) => {
    let updatedItems = [...items];
    let updatedCombos = [...combos];

    if (type === "item") {
      updatedItems = updatedItems.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else if (type === "combo") {
      updatedCombos = updatedCombos.map((combo) =>
        combo._id === id && combo.quantity > 1
          ? { ...combo, quantity: combo.quantity - 1 }
          : combo
      );
    }

    // Cập nhật lại giỏ hàng với cả items và combos
    updateCart(updatedItems, updatedCombos);

    // Thông báo cập nhật giỏ hàng
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const deleteItem = (id, type) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const updatedItems = [...items, ...combos].filter(
        (itemOrCombo) => itemOrCombo._id !== id
      );

      updateCart(updatedItems);
    }
  };

  const deleteCombo = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this combo?"
    );

    if (confirmDelete) {
      // Lọc combo bị xóa khỏi giỏ hàng
      const updatedCombos = combos.filter((combo) => combo._id !== id);

      // Cập nhật lại giỏ hàng với cả items và combos
      updateCart(items, updatedCombos);

      // Thông báo cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handlePayment = () => {
    // Logic thanh toán
    console.log("Proceeding to payment...");
  };

  return (
    <>
      <div className="modal fade" id="viewVouchers">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Select Voucher
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Voucher Code</th>
                    <th style={{ width: "55%" }}>Description</th>
                    <th style={{ width: "10%" }}>End Date</th>
                    <th style={{ width: "20%" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => {
                    const canApply = isVoucherApplicable(voucher);
                    const isSelected =
                      appliedVoucher?.code === voucher.voucherCode;

                    return (
                      <tr key={voucher._id}>
                        <td>{voucher.voucherCode}</td>
                        <td>{voucher.name}</td>
                        <td>
                          {new Date(voucher.end_date).toLocaleDateString()}
                        </td>
                        <td>
                          {canApply ? (
                            <button
                              onClick={() => {
                                if (!isSelected) {
                                  handleSetVoucherCode(voucher.voucherCode);
                                  setAppliedVoucher({
                                    code: voucher.voucherCode,
                                    type: voucher.discount_type,
                                    value: voucher.discount_value,
                                  });
                                } else {
                                  // Nếu đã chọn rồi thì click lại sẽ bỏ chọn
                                  setAppliedVoucher(null);
                                  setVoucherCode("");
                                }
                              }}
                              className={`btn-voucher ${
                                isSelected ? "" : "selected"
                              }`}
                              disabled={!canApply || !voucher.isActive} // Disable button if voucher is not active
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          ) : (
                            <span
                              className="text-center"
                              style={{ color: "red", fontWeight: "bold" }}
                            >
                              {voucher.isActive
                                ? "Not eligible"
                                : "Voucher is inactive"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* <!-- Modal footer --> */}
          </div>
        </div>
      </div>

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

                {items.length === 0 && combos.length === 0 ? (
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
                      Your cart is currently empty. Please add some items or
                      combos to proceed with checkout.
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
                  <div>
                    {/* Hiển thị danh sách items và combos */}
                    {(items.length > 0 || combos.length > 0) && (
                      <div
                        style={{
                          maxHeight: "75vh",
                          overflowY: "auto",
                          border: "1px solid #ccc",
                          paddingRight: "10px",
                        }}
                      >
                        {/* Hiển thị danh sách items */}
                        {items.length > 0 && (
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
                                    onIncrease={() =>
                                      increaseQuantity(item._id, "item")
                                    }
                                    onDecrease={() =>
                                      decreaseQuantity(item._id, "item")
                                    }
                                    onDelete={() =>
                                      deleteItem(item._id, "item")
                                    }
                                    extraElement={
                                      <button
                                        onClick={() =>
                                          handleSelect(item._id, "item")
                                        }
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
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Hiển thị danh sách combos */}
                        {combos.length > 0 && (
                          <div
                            style={{
                              maxHeight: "75vh",
                              overflowY: "auto",
                              border: "1px solid #ccc",
                              paddingRight: "10px",
                            }}
                          >
                            {combos.map((combo) => (
                              <div
                                key={combo._id}
                                className="form-check d-flex align-items-start mb-3"
                              >
                                <div className="ms-3 w-100">
                                  <CartItem
                                    item={combo}
                                    onIncrease={() =>
                                      increaseQuantity(combo._id, "combo")
                                    }
                                    onDecrease={() =>
                                      decreaseQuantity(combo._id, "combo")
                                    }
                                    onDelete={() =>
                                      deleteCombo(combo._id, "combo")
                                    }
                                    extraElement={
                                      <button
                                        onClick={() =>
                                          handleSelect(combo._id, "combo")
                                        }
                                        className={`btn-select ${
                                          selectedItems.includes(combo._id)
                                            ? "selected"
                                            : ""
                                        }`}
                                      >
                                        {selectedItems.includes(combo._id)
                                          ? "Selected"
                                          : "Unselect"}
                                      </button>
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-8">
                <div className="card">
                  <div className="card-body">
                    <div className=" d-flex justify-content-center align-items-center">
                      <h2 style={{ fontSize: "35px" }}>2. Apply Voucher</h2>
                    </div>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <input
                        type="text"
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        style={{
                          width: "450px",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <button
                        onClick={() => handleApplyVoucher(selectedItems[0])}
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          const modal = new Modal(
                            document.getElementById("viewVouchers")
                          );
                          modal.show();
                        }}
                      >
                        Vouchers
                      </button>
                    </div>
                    <div className="ms-3 mt-3">
                      {appliedVoucher ? (
                        <div>
                          <p>
                            <strong>Voucher Code:</strong> {appliedVoucher.code}
                          </p>
                          <p>
                            <strong>Discount Type:</strong>{" "}
                            {appliedVoucher.type === "PERCENT"
                              ? "Percentage"
                              : "Fixed Amount"}
                          </p>
                          <p>
                            <strong>Discount Value:</strong>{" "}
                            {appliedVoucher.value}
                          </p>
                        </div>
                      ) : (
                        <p>No voucher applied</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card mt-3">
                  <div className="card-body">
                    <div className=" d-flex justify-content-center align-items-center">
                      <h2 style={{ fontSize: "35px" }}>3. Review Your Order</h2>
                    </div>
                    <ul>
                      <li>
                        <Table columns={columns} data={selectedData} />
                      </li>
                      <li>
                        <h2 style={{ fontSize: "18px", marginTop: "20px" }}>
                          Subtotal: ${subtotal.toFixed(2)}
                        </h2>
                        {appliedVoucher && (
                          <h2
                            style={{
                              fontSize: "18px",
                              marginTop: "20px",
                              color: "green",
                            }}
                          >
                            Discount: ${(subtotal - discountedTotal).toFixed(2)}
                          </h2>
                        )}
                        <h2 style={{ fontSize: "18px", marginTop: "20px" }}>
                          Final Total: ${discountedTotal.toFixed(2)}
                        </h2>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12" style={{ paddingTop: "100px" }}>
                  {selectedItems.length > 0 ? (
                    <>
                      <h2 className="text-center" style={{ fontSize: "35px" }}>
                        4. Billing details
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
