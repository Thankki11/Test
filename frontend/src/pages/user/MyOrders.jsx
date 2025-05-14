import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import emptyCart from "../../assets/images/empty-cart.png";
import { NavLink } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:3001/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

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
      {" "}
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
            {orders.length === 0 ? (
              <div className="container text-center mt-5 mb-5">
                <div>
                  <img
                    src={emptyCart}
                    alt="Empty cart"
                    className="d-block mx-auto mb-4"
                    style={{ maxWidth: "250px" }}
                  />
                </div>
                <div>
                  <h2 style={{ fontSize: "40px" }}>
                    Your orders is{" "}
                    <span
                      style={{
                        color: "#b8860b",
                        fontWeight: "bold",
                      }}
                    >
                      empty!
                    </span>
                  </h2>
                  <p>You haven't bought anything yet, go shopping!</p>
                  <Link to="/menus">
                    <button className="mt-3">Go shopping</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="container">
                <div className="text-center mt-5">
                  <h2 style={{ fontSize: "40px" }}>My Orders</h2>
                </div>
                <table className="table table-striped mt-4">
                  <thead>
                    <tr>
                      <th className="text-center align-middle">Order#</th>
                      <th className="text-center align-middle">Total Price</th>
                      <th className="text-center align-middle">Address</th>
                      <th className="text-center align-middle">Status</th>
                      <th className="text-center align-middle">Date Created</th>
                      <th className="text-center align-middle">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr key={order._id}>
                          <td className="text-center align-middle">
                            {index + 1}{" "}
                          </td>
                          <td className="text-center align-middle">
                            ${order.totalPrice}
                          </td>
                          <td className="text-center align-middle">
                            {order.address}
                          </td>
                          <td className="text-center align-middle">
                            {order.status}
                          </td>
                          <td className="text-center align-middle">
                            {new Date(order.date).toLocaleString()}
                          </td>
                          <td className="text-center align-middle">
                            <Link
                              to={`/order-detail/${order._id}`}
                              className="btn btn-sm"
                              title="View Order Details"
                            >
                              <button>View</button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="row"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
