import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

//Components
import ReservationForm from "../../components/ReservationForm";
import ReservationsModal from "./adminComponents/reservation/ReservationsModal";
import AreasAndTables from "./adminComponents/reservation/AreasAndTables";
import AddTableModal from "./adminComponents/reservation/AddTableModal";

function AdminReservation() {
  //Lọc theo ngày
  const [showAll, setShowAll] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  //Lưu thông tin của bàn đã chọn, ngày
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  //Lưu thông tin các đơn đặt bàn
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);

  //Lưu lựa chọn auto hoặc thủ công khi chọn bàn cho đơn
  const [tableSelectOption, setTableSelectOption] = useState("auto");

  //Lưu thông tin chi tiết của 1 đơn đặt bàn
  const [reservationDetail, setReservationDetail] = useState(null);

  //Chỉnh sửa thông tin của lần đặt bàn
  const handleUpdateReservation = async (id, updatedData) => {
    try {
      console.log(id);
      const { _id, __v, createdAt, ...dataToSend } = updatedData;
      console.log(updatedData);
      const response = await axios.put(
        `http://localhost:3001/api/reservations/update/${id}`, // URL của API cập nhật
        dataToSend // Dữ liệu bạn muốn gửi để cập nhật
      );

      // Kiểm tra thành công và thông báo
      if (response.status === 200) {
        alert("Reservation updated successfully!");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation");
    }
  };

  const handleReservationDetail = (detail) => {
    console.log(detail);
    setReservationDetail(detail);
  };

  //Thứ tự hiển thị modal
  useEffect(() => {
    // Lấy cả hai modal
    const detailModal = document.getElementById("detailReservationModal");
    const addModal = document.getElementById("addReservationModal");
    const confirmModal = document.getElementById("confirmReservationModal");

    const handleHidden = () => {
      // Khi một trong hai modal đóng, mở lại modal viewReservations
      const viewModalElement = document.getElementById("viewReservationsModal");
      if (viewModalElement) {
        const viewModal = new Modal(viewModalElement);
        viewModal.show();
      }
    };

    // Thêm event listener cho cả hai modal
    detailModal?.addEventListener("hidden.bs.modal", handleHidden);
    addModal?.addEventListener("hidden.bs.modal", handleHidden);
    confirmModal?.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      // Cleanup listener khi component unmount
      detailModal?.removeEventListener("hidden.bs.modal", handleHidden);
      addModal?.removeEventListener("hidden.bs.modal", handleHidden);
      confirmModal?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  //xem dữ liệu toàn bộ hoặc theo ngàyngày
  useEffect(() => {
    if (!showAll) {
      const today = new Date().toISOString().split("T")[0];
      setFromDate(today);
      setToDate(today);
    } else {
      setFromDate("");
      setToDate("");
    }
  }, [showAll]);

  // Lọc đơn đặt bàn khi fromDate, toDate thay đổi
  useEffect(() => {
    const filterReservations = () => {
      if (showAll) {
        setFilteredReservations(reservations);
      } else {
        setFilteredReservations(
          reservations.filter((reservation) => {
            const reservationDate = reservation.date; // Giả sử date là định dạng YYYY-MM-DD
            return reservationDate >= fromDate && reservationDate <= toDate;
          })
        );
      }
    };

    filterReservations(); // Lọc dữ liệu khi thay đổi ngày bắt đầu/kết thúc hoặc khi thay đổi showAll
  }, [fromDate, toDate, showAll, reservations]);

  // Hàm nhận bàn và ngày được chọn
  const handleTableSelect = (table, date) => {
    setSelectedTable(table);
    setSelectedDate(date);
  };

  return (
    <>
      {/* Modal xem thông tin chi tiết của bàn*/}
      {selectedTable && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          id="tableDetail"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" style={{ fontSize: "30px" }}>
                  Table {selectedTable.tableNumber} Detail
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTable(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>Table number: {selectedTable.tableNumber}</p>
                <p>Area: {selectedTable.seatingArea}</p>
                <p>Type: {selectedTable.tableType}</p>
                <p>Capacity: {selectedTable.capacity}</p>
                <p>Note: {selectedTable.note || "No note"}</p>
                <p>
                  Created at:{" "}
                  {new Date(selectedTable.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-3">
                  <button className="btn-select">Delete table</button>
                  <button>Edit table</button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTable(null)}
                  className="btn-select"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {selectedTable && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setSelectedTable(null)}
        ></div>
      )}

      {/* Modal xem các đơn đặt bàn  */}
      <div className="modal fade" id="viewReservationsModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <div className="d-flex gap-3 align-items-center">
                <h4 className="modal-title" style={{ fontSize: "30px" }}>
                  View Reservations
                </h4>
                <p className=" mb-0">Default is showing today</p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <ReservationsModal
                onReservationDetail={handleReservationDetail}
              />
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

      {/* Modal tạo đơn đặt bàn mới */}
      <div className="modal fade" id="addReservationModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title">Add new Reservation</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <ReservationForm isInModal="true" />
            </div>

            {/* <!-- Modal footer --> */}
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn-select"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem detail của đơn đặt bàn */}
      <div className="modal fade" id="detailReservationModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontSize: "30px" }}>
                Reservation Details{" "}
                {reservationDetail?._id &&
                  `#${reservationDetail._id.substring(0, 8)}`}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              {reservationDetail ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Gọi hàm xử lý cập nhật ở đây
                    handleUpdateReservation(
                      reservationDetail._id,
                      reservationDetail
                    );
                  }}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Customer:</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={reservationDetail.customerName || ""}
                          onChange={(e) =>
                            setReservationDetail({
                              ...reservationDetail,
                              customerName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Email:</strong>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={reservationDetail.emailAddress || ""}
                          onChange={(e) =>
                            setReservationDetail({
                              ...reservationDetail,
                              emailAddress: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Phone:</strong>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          value={reservationDetail.phoneNumber || ""}
                          onChange={(e) =>
                            setReservationDetail({
                              ...reservationDetail,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Number of Guests:</strong>
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={reservationDetail.numberOfGuest || ""}
                          onChange={(e) =>
                            setReservationDetail({
                              ...reservationDetail,
                              numberOfGuest: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Seating Area:</strong>
                        </label>
                        <select
                          className="form-select"
                          value={reservationDetail.seatingArea || ""}
                          onChange={(e) =>
                            setReservationDetail({
                              ...reservationDetail,
                              seatingArea: e.target.value,
                            })
                          }
                        >
                          <option value="indoor">Indoor</option>
                          <option value="outdoor">Outdoor</option>
                          <option value="vip">VIP</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Reservation Date:</strong>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={
                            new Date(reservationDetail.dateTime)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) => {
                            const newDate = new Date(
                              reservationDetail.dateTime
                            );
                            const [year, month, day] =
                              e.target.value.split("-");
                            newDate.setFullYear(year, month - 1, day);
                            setReservationDetail({
                              ...reservationDetail,
                              dateTime: newDate.toISOString(),
                            });
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Reservation Time:</strong>
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          value={new Date(reservationDetail.dateTime)
                            .toTimeString()
                            .substring(0, 5)}
                          onChange={(e) => {
                            const newDate = new Date(
                              reservationDetail.dateTime
                            );
                            const [hours, minutes] = e.target.value.split(":");
                            newDate.setHours(hours, minutes);
                            setReservationDetail({
                              ...reservationDetail,
                              dateTime: newDate.toISOString(),
                            });
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="label mb-0">
                          <strong>Created At:</strong>
                        </label>
                        <p style={{ fontSize: "14px" }}>
                          {new Date(reservationDetail.createdAt).toLocaleString(
                            "en-GB"
                          )}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="label mb-0">
                          <strong>Status:</strong>
                        </label>
                        <p style={{ fontSize: "14px" }}>
                          {reservationDetail.status}
                        </p>
                      </div>
                    </div>

                    {reservationDetail.note && (
                      <div className="col-12 mt-3">
                        <div className="mb-3">
                          <label className="form-label">
                            <strong>Note:</strong>
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={reservationDetail.note || ""}
                            onChange={(e) =>
                              setReservationDetail({
                                ...reservationDetail,
                                note: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-primary">
                      Update Reservation
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* <!-- Modal footer --> */}
            <div className="modal-footer  d-flex justify-content-between">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn-select"
              >
                Close
              </button>
              <p></p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn bàn cho đơn đặt bàn */}
      <div className="modal fade" id="confirmReservationModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontSize: "24px" }}>
                Confirm{" "}
                {reservationDetail?.customerName
                  ? `for #${reservationDetail._id.substring(0, 8)}`
                  : ""}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {reservationDetail ? (
                <div className="row">
                  {/* Thông tin cơ bản */}
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h2 style={{ fontSize: "20px" }}>
                          Reservation Infomation
                        </h2>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <p>
                            <strong>Name:</strong>{" "}
                            {reservationDetail.customerName}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {reservationDetail.phoneNumber}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Number of guest:</strong>{" "}
                            {reservationDetail.numberOfGuest}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Time:</strong>{" "}
                            {new Date(
                              reservationDetail.dateTime
                            ).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>
                              Area: {reservationDetail.seatingArea}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* If manual selected, show extra content */}
                    {tableSelectOption === "manual" && (
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h2 style={{ fontSize: "20px" }}>Table Selecction</h2>
                        </div>
                        <div className="card-body">
                          <div className="mt-3">
                            <p>
                              👉 This is where the manual table selection
                              interface will go.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lựa chọn bàn */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h2 style={{ fontSize: "20px" }}>Table selection</h2>
                      </div>
                      <div className="card-body text-center">
                        <div className="d-grid gap-3">
                          {/* Button Automatic */}
                          <button
                            className={`btn py-3 ${
                              tableSelectOption === "auto"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTableSelectOption("auto")}
                          >
                            <i className="fas fa-magic me-2"></i>
                            <h2
                              style={{ fontSize: "15px", marginBottom: "0px" }}
                            >
                              Automatic Selection
                            </h2>
                            <br />
                            <small>
                              (The system will automatically choose the most
                              suitable table)
                            </small>
                          </button>

                          {/* Button Manual */}
                          <button
                            className={`btn py-3 ${
                              tableSelectOption === "manual"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTableSelectOption("manual")}
                          >
                            <i className="fas fa-hand-pointer me-2"></i>
                            <h2
                              style={{ fontSize: "15px", marginBottom: "0px" }}
                            >
                              Manual Selection
                            </h2>

                            <br />
                            <small>
                              (Manually choose a table from the restaurant
                              layout)
                            </small>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer d-flex justify-content-between">
              {/* Button đóng modal */}
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn-select"
              >
                Close
              </button>

              {/* Confirm Button  */}
              <button className="btn-select selected">Confirm</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tạo bàn mới */}
      <div className="modal fade" id="addTableModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Add new table
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <AddTableModal />
            </div>

            {/* Modal Footer */}
            <div className="modal-footer d-flex justify-content-between">
              {/* Button đóng modal */}
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn-select"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Giao diện start */}
      <div className="section">
        <div className="mb-5">
          <h2>Admin Reservations</h2>
        </div>
        {/* Thông tin về các bàn trong ngày đã chọn: có thể làm thống kê  */}
        <div>
          <div className="row">
            <div className="col-4">
              <p>Total table: 50</p>
              <p>Total table registered: 20</p>
              <p>Total table empty:5</p>
            </div>
            <div className="col-8">
              <div
                className="d-flex justify-content-end"
                style={{ gap: "20px" }}
              >
                {/* Thêm khu vực mới */}
                <button> Add new area</button>
                {/* Thêm bàn mới */}
                <button
                  onClick={() => {
                    const modal = new Modal(
                      document.getElementById("addTableModal")
                    );
                    modal.show();
                  }}
                >
                  {" "}
                  Add new table
                </button>
              </div>
              <div className="d-flex justify-content-end mt-3">
                {/* Hiển thị danh sách các yêu cầu đặt bàn */}
                <button
                  onClick={() => {
                    const modal = new Modal(
                      document.getElementById("viewReservationsModal")
                    );
                    modal.show();
                  }}
                >
                  View Reservations
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="section-fluid">
          <AreasAndTables onTableSelect={handleTableSelect} />
        </div>
      </div>
    </>
  );
}

export default AdminReservation;
