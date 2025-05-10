import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/orders/getOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: response.data.order.status } : order
        )
      );
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="container">
      <h2 className="text-center mb-3">Manage Orders</h2>

      {/* Search */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by customer, phone, email, address..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Note</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.emailAddress}</td>
                  <td>{order.address}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.note || "N/A"}</td>
                  <td>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity} x ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.totalPrice}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivering</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
