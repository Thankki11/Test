import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Số đơn hàng mỗi trang
  //Trang hiển thị các orders cần confirm
  const [modalPage, setModalPage] = useState(1);
  const modalOrdersPerPage = 5;
  const ordersWithPrice48 = orders.filter((order) => order.totalPrice === 48);

  //thông tin order cần chỉnh sửa
  const [orderDetail, setOrderDetail] = useState();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/orders/getOrders"
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
  const filteredOrders = orders.filter((order) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(keyword) ||
      order.phoneNumber.toLowerCase().includes(keyword) ||
      order.emailAddress.toLowerCase().includes(keyword) ||
      order.address.toLowerCase().includes(keyword)
    );
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
  const handleConfirm = (id) => {
    window.confirm("Do you want to CONFIRM this order");
  };

  //Xóa đơn (chỉ xóa đơn chưa xác nhận)
  const handleDelete = (id) => {
    window.confirm("Do you want to DELETE this order");
  };

  //Sửa đơn (chỉ sửa đơn chưa xác nhận)
  const handleEdit = (id) => {
    // Tìm order từ danh sách có sẵn
    const order = orders.find((item) => item._id === id);

    if (!order) {
      alert("Không tìm thấy đơn đặt bàn!");
      return;
    }

    // Lưu lại thông tin đơn đặt bàn chi tiết và id được chọn
    setOrderDetail(order);

    // Đóng modal danh sách order trước
    const viewModal = Modal.getInstance(
      document.getElementById("confirmOrdersModal")
    );
    if (viewModal) viewModal.hide();

    // Sau đó mở modal detail
    const detailModal = new Modal(document.getElementById("detailOrderModal"));
    detailModal.show();
  };

  return (
    <>
      {/* modal xem chi tiết order */}
      <div className="modal fade" id="detailOrderModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <div className="d-flex gap-3 align-items-center">
                <h4 className="modal-title" style={{ fontSize: "30px" }}>
                  Order Detail
                </h4>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">Hello</div>

            {/* <!-- Modal footer --> */}
            <div className="modal-footer d-flex justify-content-between">
              <button data-bs-dismiss="modal" className="btn-select">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal confirm order */}
      <div className="modal fade" id="confirmOrdersModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <div className="d-flex gap-3 align-items-center">
                <h4 className="modal-title" style={{ fontSize: "30px" }}>
                  Confirm orders
                </h4>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Email Address</th>
                    <th>Address</th>
                    <th>Payment Method</th>
                    <th>Note</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Confirm</th>
                  </tr>
                </thead>
                <tbody>
                  {currentModalOrders.map((order) => (
                    <tr key={order._id}>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <div className="d-flex">
                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            title="Cancel"
                            onClick={() => handleDelete(order._id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
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
                          <button
                            className="btn btn-sm btn-outline-danger me-2 text-center"
                            onClick={() => handleEdit(order._id)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.8rem",
                            }}
                          >
                            <i className="fa-solid fa-info"></i>
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

                      <td>
                        <button
                          style={{
                            backgroundColor: "orange",
                            color: "white",
                            border: "transparent",
                          }}
                          onClick={() => handleConfirm(order._id)}
                        >
                          Confirm
                        </button>
                      </td>

                      {console.log("Order object:", order)}
                    </tr>
                  ))}
                  {currentOrders.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center">
                        {searchKeyword
                          ? "No matching orders found."
                          : "No orders available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination buttons */}
              {ordersWithPrice48.length > 0 && (
                <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                  <button
                    onClick={() =>
                      setModalPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={modalPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {modalPage} of {modalTotalPages}
                  </span>
                  <button
                    onClick={() =>
                      setModalPage((prev) =>
                        Math.min(prev + 1, modalTotalPages)
                      )
                    }
                    disabled={modalPage === modalTotalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* <!-- Modal footer --> */}
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
          <button
            onClick={() => {
              const modal = new Modal(
                document.getElementById("confirmOrdersModal")
              );
              modal.show();
            }}
          >
            Confirm Orders
          </button>
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
                    {console.log("Order object:", order)}
                  </tr>
                ))}
                {currentOrders.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center">
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
                  className=""
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
                  className=""
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
