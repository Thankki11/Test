import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Số đơn hàng mỗi trang
  //Trang hiển thị các orders cần confirm
  const [modalPage, setModalPage] = useState(1);
  const modalOrdersPerPage = 5;
  const ordersWithPrice48 = orders.filter((order) => order.totalPrice === 48);

  // Thông tin order cần chỉnh sửa
  const [orderDetail, setOrderDetail] = useState();

  // Lọc danh sách đơn hàng có trạng thái "pending"
  const pendingOrders = orders.filter((order) => order.status === "pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:3001/api/orders/getOrders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  //Thứ tự hiển thị modal
  useEffect(() => {
    // Lấy cả modal con
    const detailModal = document.getElementById("detailOrderModal");

    const handleHidden = () => {
      // Khi một trong modal con đóng, mở lại modal cha
      const viewModalElement = document.getElementById("confirmOrdersModal");
      if (viewModalElement) {
        const viewModal = new Modal(viewModalElement);
        viewModal.show();
      }
    };

    // Thêm event listener cho cả hai modal
    detailModal?.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      // Cleanup listener khi component unmount
      detailModal?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  // Khi search thì reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  // Filter orders theo search keyword
  const filteredOrders = orders
    .filter((order) => {
      const keyword = searchKeyword.toLowerCase();
      const matchesSearch =
        order.customerName.toLowerCase().includes(keyword) ||
        order.phoneNumber.toLowerCase().includes(keyword) ||
        order.emailAddress.toLowerCase().includes(keyword) ||
        order.address.toLowerCase().includes(keyword);

      const matchesPayment =
        selectedPaymentMethod === "" || order.status === selectedPaymentMethod;

      return matchesSearch && matchesPayment;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const valA = a[sortField];
      const valB = b[sortField];

      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // xử lý phân trang cho order confirm
  const modalIndexOfLastOrder = modalPage * modalOrdersPerPage;
  const modalIndexOfFirstOrder = modalIndexOfLastOrder - modalOrdersPerPage;
  const currentModalOrders = ordersWithPrice48.slice(
    modalIndexOfFirstOrder,
    modalIndexOfLastOrder
  );
  const modalTotalPages = Math.ceil(
    ordersWithPrice48.length / modalOrdersPerPage
  );

  //Xác nhận đơn
  const handleConfirm = async (id) => {
    if (window.confirm("Do you want to CHECK this order?")) {
      try {
        const token = localStorage.getItem("adminToken");

        await axios.put(
          `http://localhost:3001/api/orders/${id}/status`,
          { status: "delivering" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Order confirmed successfully");

        fetchOrders(); // ✅ Reload lại danh sách => đơn đã confirm sẽ không còn trong pendingOrders
        window.dispatchEvent(new CustomEvent("orderConfirmed"));
      } catch (err) {
        console.error("Error confirming order:", err);
        alert("Failed to confirm order.");
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (window.confirm(`Do you want to update this order to ${newStatus}?`)) {
      try {
        const token = localStorage.getItem("adminToken");

        // Gọi API cập nhật trạng thái đơn hàng
        await axios.put(
          `http://localhost:3001/api/orders/${orderId}/status`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Order status updated successfully");

        // Reload danh sách đơn hàng
        fetchOrders();
      } catch (err) {
        console.error("Error updating order status:", err);
        alert("Failed to update order status.");
      }
    }
  };

  // Xóa đơn hàng
  const handleDelete = async (id) => {
    if (window.confirm("Do you want to DELETE this order?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:3001/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Order deleted successfully");
        fetchOrders(); // Refresh danh sách đơn hàng
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order.");
      }
    }
  };

  // Sửa đơn hàng
  const handleEdit = (id) => {
    const order = orders.find((item) => item._id === id);

    if (!order) {
      alert("Order not found!");
      return;
    }

    setOrderDetail(order); // Lưu thông tin order vào state

    // Đóng modal Confirm Orders nếu đang mở
    const confirmModal = Modal.getInstance(
      document.getElementById("confirmOrdersModal")
    );
    if (confirmModal) {
      confirmModal.hide();
    }

    // Hiển thị modal chỉnh sửa
    const detailModal = new Modal(document.getElementById("detailOrderModal"));
    detailModal.show();
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:3001/api/orders/${orderDetail._id}`,
        orderDetail,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order updated successfully");
      fetchOrders(); // Refresh danh sách đơn hàng
      const detailModal = Modal.getInstance(
        document.getElementById("detailOrderModal")
      );
      detailModal.hide(); // Đóng modal sau khi lưu
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      {/* Modal xem chi tiết order */}
      <div className="modal fade" id="detailOrderModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Edit Order
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {orderDetail && (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderDetail.customerName}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderDetail.phoneNumber}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={orderDetail.emailAddress}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          emailAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderDetail.address}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderDetail.paymentMethod}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          paymentMethod: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={orderDetail.note}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          note: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Items</label>
                    <ul>
                      {orderDetail.items.map((item, index) => (
                        <li key={index}>
                          <input
                            type="text"
                            className="form-control mb-2"
                            value={item.name}
                            onChange={(e) => {
                              const updatedItems = [...orderDetail.items];
                              updatedItems[index].name = e.target.value;
                              setOrderDetail({
                                ...orderDetail,
                                items: updatedItems,
                              });
                            }}
                          />
                          <input
                            type="number"
                            className="form-control mb-2"
                            value={item.quantity}
                            onChange={(e) => {
                              const updatedItems = [...orderDetail.items];
                              updatedItems[index].quantity = e.target.value;
                              setOrderDetail({
                                ...orderDetail,
                                items: updatedItems,
                              });
                            }}
                          />
                          <input
                            type="number"
                            className="form-control mb-2"
                            value={item.price}
                            onChange={(e) => {
                              const updatedItems = [...orderDetail.items];
                              updatedItems[index].price = e.target.value;
                              setOrderDetail({
                                ...orderDetail,
                                items: updatedItems,
                              });
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={orderDetail.totalPrice}
                      onChange={(e) =>
                        setOrderDetail({
                          ...orderDetail,
                          totalPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="" onClick={handleSave}>
                Save
              </button>
              <button className="" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal confirm order */}
      <div className="modal fade" id="confirmOrdersModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <div className="d-flex gap-3 align-items-center">
                <h4 className="modal-title" style={{ fontSize: "30px" }}>
                  Pending Orders
                </h4>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <table
                className="table table-striped table-bordered mt-4"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Action</th>
                    <th style={{ width: "10%" }}>Customer Name</th>
                    <th style={{ width: "7%" }}>Phone Number</th>
                    <th style={{ width: "10%" }}>Email Address</th>
                    <th style={{ width: "10%" }}>Address</th>
                    <th style={{ width: "5%" }}>Payment Method</th>
                    <th style={{ width: "7%" }}>Note</th>
                    <th style={{ width: "10%" }}>Items</th>
                    <th style={{ width: "5%" }}>Total Price</th>
                    <th style={{ width: "7%" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order._id}>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <div className="d-flex">
                          {/* Nút Xóa */}
                          <button
                            className="me-2"
                            title="Delete"
                            onClick={() => handleDelete(order._id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              height: "30px",
                              paddingLeft: "10px",
                            }}
                          >
                            <i
                              className="fa fa-times"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            ></i>
                          </button>

                          {/* Nút Sửa */}
                          <button
                            className="me-2 text-center"
                            title="Edit"
                            onClick={() => handleEdit(order._id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              height: "30px",
                              paddingLeft: "10px",
                              backgroundColor: "#007bff",
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="btn-selected selected "
                            title="Confirm"
                            onClick={() => handleConfirm(order._id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                              height: "30px",
                              paddingLeft: "10px",
                            }}
                          >
                            <i className="fa fa-check"></i>
                          </button>
                        </div>
                      </td>
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
                    </tr>
                  ))}
                  {pendingOrders.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No pending orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer d-flex justify-content-between">
              <button data-bs-dismiss="modal" className="btn-select">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content chính */}
      <div className="container">
        <h2 className="text-center mb-3">Manage Orders</h2>

        {/* Search và nút confirm orders*/}
        <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
          <span style={{ fontWeight: "bold", marginRight: "10px" }}>
            Search:
          </span>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by customer, phone, email, address..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <select
            className="form-select"
            value={selectedPaymentMethod}
            onChange={(e) => {
              setSelectedPaymentMethod(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "160px" }}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="delivering">Delivering</option>
          </select>

          <button
            onClick={() => {
              const modal = new Modal(
                document.getElementById("confirmOrdersModal")
              );
              modal.show();
            }}
          >
            Pending Orders
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="text-center mt-2 mb-2">
              <h2 style={{ fontSize: "30px" }}>Confirmed orders</h2>
            </div>
            <table
              className="table table-striped table-bordered"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "7%",
                      position: "sticky",
                      right: 0,
                      background: "#fff",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortField === "date" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    style={{ width: "9%", cursor: "pointer" }}
                    onClick={() => handleSort("customerName")}
                  >
                    Customer Name{" "}
                    {sortField === "customerName" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ width: "10%" }}>Phone Number</th>
                  <th style={{ width: "12%" }}>Email Address</th>
                  <th style={{ width: "12%" }}>Address</th>
                  <th style={{ width: "6%" }}>Payment Method</th>
                  <th style={{ width: "7%" }}>Note</th>
                  <th style={{ width: "19%" }}>Items</th>
                  <th style={{ width: "6%" }}>Total Price</th>
                  <th style={{ width: "7%" }}>Status</th>

                  <th style={{ width: "7%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders
                  .filter(
                    (order) =>
                      order.status === "completed" ||
                      order.status === "delivering"
                  )
                  .map((order) => (
                    <tr key={order._id}>
                      <td
                        style={{
                          position: "sticky",
                          right: 0,
                          background: "#fff",

                          width: "100%",
                        }}
                      >
                        {new Date(order.date).toLocaleString()}
                      </td>
                      <td>{order.customerName}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.emailAddress}</td>
                      <td>{order.address}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.note || "N/A"}</td>
                      <td>
                        <ul className="mb-0 ps-3">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - {item.quantity} x ${item.price}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>${Number(order.totalPrice).toFixed(2)}</td>
                      <td>
                        <span
                          style={{
                            color:
                              order.status === "delivering"
                                ? "#ffc107"
                                : "#43a137",
                            fontWeight: "bold",
                          }}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>

                      <td>
                        {/* Chỉ hiển thị nút khi trạng thái là delivering */}
                        {order.status === "delivering" && (
                          <button
                            className="btn-selected selected p-0 m-0 w-100"
                            onClick={() =>
                              handleStatusUpdate(order._id, "completed")
                            }
                          >
                            <i className="fa fa-check"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                {currentOrders.filter(
                  (order) =>
                    order.status === "confirmed" ||
                    order.status === "delivering"
                ).length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center">
                      {searchKeyword
                        ? "No matching orders found."
                        : "No orders available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination buttons */}
            {filteredOrders.length > 0 && (
              <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminOrders;
