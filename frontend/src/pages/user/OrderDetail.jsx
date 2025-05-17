import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

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

        setOrder(response.data);
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
                  <p>
                    <strong>Order date:</strong>
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Ordered Items:</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id.$oid}>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
