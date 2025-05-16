import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [itemsWithDetails, setItemsWithDetails] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:3001/api/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedOrder = response.data;
        setOrder(fetchedOrder);

        const itemDetailsPromises = fetchedOrder.items.map(async (item) => {
          try {
            // Thử lấy menu trước
            try {
              const itemRes = await axios.get(
                `http://localhost:3001/api/menus/${item.menuItemId}`
              );
              return { ...item, menuItem: itemRes.data };
            } catch (menuError) {
              // Nếu không phải menu, thử lấy combo
              try {
                const comboRes = await axios.get(
                  `http://localhost:3001/api/combos/${item.menuItemId}`
                );
                return { ...item, comboDetails: comboRes.data };
              } catch (comboError) {
                console.error(
                  `Item ${item.menuItemId} not found as menu or combo`
                );
                return item;
              }
            }
          } catch (error) {
            console.error(`Error fetching item ${item.menuItemId}:`, error);
            return item;
          }
        });

        const detailedItems = await Promise.all(itemDetailsPromises);
        setItemsWithDetails(detailedItems);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  // Style dùng inline
  const linkStyle = {
    padding: "8px 12px",
    borderRadius: "4px",
    display: "block",
    textDecoration: "none",
    color: "#333",
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#ede7d8",
    color: "#b8860b",
    fontWeight: "bold",
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-3">
          {" "}
          <div className="card p-3 shadow-sm">
            <ul className="nav flex-column">
              <li className="nav-item mb-2" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/user-info"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  Account Information
                </NavLink>
              </li>
              <li className="nav-item mb-2" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/edit-profile"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  Edit Profile
                </NavLink>
              </li>
              <li className="nav-item" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/my-orders"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  My Orders
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-9">
          <div className="card p-4 shadow-sm mb-5">
            <div className="container mt-5">
              <div className="d-flex mb-4 align-items-center justify-content-between">
                <Link to="/my-orders">
                  <button>Go back</button>
                </Link>
                <h1 className="mb-0" style={{ fontSize: "28px" }}>
                  Order #{order._id}
                </h1>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>
                    <strong>Total Price:</strong> {order.totalPrice}$
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Payment method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Note:</strong> {order.note || "No note"}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <p>
                    <strong>Full Name:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Phone number:</strong> {order.phoneNumber}
                  </p>
                </div>
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Ordered Items:</h4>
              {/* phần hiển thị item nằm sau đây */}
            </div>

            <h2 className="mt-5 mb-3" style={{ fontSize: "30px" }}>
              Items:
            </h2>
            <div className="row">
              {itemsWithDetails.map((item) => (
                <div className="col-md-3 mb-4" key={item.menuItemId}>
                  <div className="card h-100">
                    <img
                      src={
                        // Kiểm tra xem item.menuItem và item.menuItem.imageUrl có tồn tại không
                        item.menuItem && item.menuItem.imageUrl
                          ? `http://localhost:3001${
                              item.menuItem.imageUrl.startsWith("/uploads")
                                ? item.menuItem.imageUrl
                                : "/uploads/" + item.menuItem.imageUrl
                            }`
                          : "https://via.placeholder.com/300x300?text=No+Image" // Ảnh mặc định nếu không có imageUrl
                      }
                      className="card-img-top"
                      alt={item.menuItem ? item.menuItem.name : "Menu Item"} // Kiểm tra item.menuItem trước khi sử dụng
                      style={{ height: "200px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <h5 className="card-title" style={{ fontSize: "30px" }}>
                        {item.menuItem ? item.menuItem.name : "Menu Item"}{" "}
                        {/* Kiểm tra menuItem trước khi truy cập */}
                      </h5>
                      <p className="card-text">
                        {item.menuItem
                          ? item.menuItem.description
                          : "No description available"}
                      </p>
                      <p className="card-text">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p
                        className="card-text fw-bold"
                        style={{ color: "#b8860b" }}
                      >
                        Total price: ${item.price} x {item.quantity} = $
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
