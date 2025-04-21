import React, { useState, useEffect } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

function ConfirmReservationModal({
  reservationDetail,
  tables,
  onReservationUpdated,
}) {
  const [confirmReservation, setConfirmReservation] =
    useState(reservationDetail);
  const [tableList, setTableList] = useState(tables);
  const [tableSelectOption, setTableSelectOption] = useState("auto");

  // Chọn bàn
  const [selectedTable, setSelectedTable] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    setConfirmReservation(reservationDetail);
  }, [reservationDetail]);

  useEffect(() => {
    setTableList(tables);
  }, [tables]);

  //Lọc danh sách các bàn để lấy ra bàn phù hợp: Table Type, Area, Thời gian
  useEffect(() => {
    if (tableList.length > 0 && confirmReservation) {
      const reservationStartTime = new Date(confirmReservation.dateTime);
      const reservationEndTime = new Date(
        reservationStartTime.getTime() + 2 * 60 * 60 * 1000
      ); // +2 giờ

      const filteredTables = tableList.filter((table) => {
        // Kiểm tra khu vực và loại bàn
        const isMatchAreaAndType =
          table.seatingArea.toLowerCase() ===
            confirmReservation.seatingArea.toLowerCase() &&
          table.tableType.toLowerCase() ===
            confirmReservation.tableType.toLowerCase() &&
          table.capacity >= confirmReservation.numberOfGuest;

        if (!isMatchAreaAndType) return false;

        // Kiểm tra xem bàn có bookingHistory không
        if (!table.bookingHistory || table.bookingHistory.length === 0) {
          return true; // Bàn trống hoàn toàn
        }

        // Kiểm tra trùng lịch
        const hasTimeConflict = table.bookingHistory.some((booking) => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);

          // Kiểm tra xem khoảng thời gian có trùng nhau không
          return (
            reservationStartTime < bookingEnd &&
            reservationEndTime > bookingStart
          );
        });

        return !hasTimeConflict; // Chỉ trả về true nếu không bị trùng
      });

      console.log("Danh sách bàn phù hợp (không trùng giờ):", filteredTables);
      setAvailableTables(filteredTables);
    }
  }, [confirmReservation, tableList]);

  const handleConfirm = async () => {
    //Lấy bàn đầu tiên trong danh sách các bàn có thể chọn
    if (tableSelectOption === "auto") {
      const selected = availableTables[0];
      setSelectedTable(selected);

      console.log("🆕 Reservation to save: table detail", selected);

      try {
        // Gọi API xác nhận bàn, lưu vào table
        const responseTable = await axios.put(
          `http://localhost:3001/api/tables/confirm/${selected._id}`,
          {
            confirmReservationId: confirmReservation._id,
            dateTime: confirmReservation.dateTime,
          }
        );
        console.log("Phản hồi từ api bàn", responseTable.data);
        if (responseTable) {
          // Gọi API xác nhận đặt bàn, lưu vào reservations
          const responseReservation = await axios.put(
            `http://localhost:3001/api/reservations/confirm/${confirmReservation._id}`,
            { selected }
          );
          console.log(responseReservation.data);

          //Callback để cập nhật lại danh sách
          onReservationUpdated?.();

          //Tắt modal này, mở modal cha
          Modal.getInstance(
            document.getElementById("confirmReservationModal")
          )?.hide();
          document.activeElement.blur(); // tránh warning accessibility
        }

        // Kiểm tra nếu có lỗi từ API
        if (responseTable.data.success === false) {
          throw new Error(responseTable.data.message); // Ném lỗi để vào catch
        }

        alert("Đặt bàn thành công và bàn đã được giữ trong 2 giờ.");
      } catch (error) {
        if (error.response) {
          // Kiểm tra các mã lỗi khác từ API
          if (error.response.status === 400) {
            alert(error.response.data.message); // Hiển thị thông báo lỗi từ API nếu là lỗi 400
          } else if (error.response.status === 404) {
            alert("Không tìm thấy bàn. Vui lòng thử lại.");
          } else {
            alert("Đã có lỗi xảy ra khi xác nhận đặt bàn.");
          }
        } else {
          console.error("Lỗi không xác định:", error);
          alert("Lỗi hệ thống, vui lòng thử lại sau.");
        }
      }
    }

    if (tableSelectOption === "manual") {
      if (!selectedTable) {
        alert("Vui lòng chọn một bàn từ danh sách");
        return;
      }

      console.log("🆕 Reservation to save: table detail", selectedTable);

      try {
        // Gọi API xác nhận bàn, lưu vào table
        const responseTable = await axios.put(
          `http://localhost:3001/api/tables/confirm/${selectedTable._id}`,
          {
            confirmReservationId: confirmReservation._id,
            dateTime: confirmReservation.dateTime,
          }
        );

        console.log("Phản hồi từ api bàn", responseTable.data);
        if (responseTable) {
          // Gọi API xác nhận đặt bàn, lưu vào reservations
          const responseReservation = await axios.put(
            `http://localhost:3001/api/reservations/confirm/${confirmReservation._id}`,
            { selected: selectedTable }
          );
          console.log(responseReservation.data);

          //Callback để cập nhật lại danh sách
          onReservationUpdated?.();

          //Tắt modal này, mở modal cha
          Modal.getInstance(
            document.getElementById("confirmReservationModal")
          )?.hide();
          document.activeElement.blur();
        }

        if (responseTable.data.success === false) {
          throw new Error(responseTable.data.message);
        }

        alert("Đặt bàn thành công và bàn đã được giữ trong 2 giờ.");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            alert(error.response.data.message);
          } else if (error.response.status === 404) {
            alert("Không tìm thấy bàn. Vui lòng thử lại.");
          } else {
            alert("Đã có lỗi xảy ra khi xác nhận đặt bàn.");
          }
        } else {
          console.error("Lỗi không xác định:", error);
          alert("Lỗi hệ thống, vui lòng thử lại sau.");
        }
      }
    }
  };

  return (
    <>
      <div className="modal fade" id="confirmReservationModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontSize: "24px" }}>
                Confirm{" "}
                {confirmReservation?.customerName
                  ? `for #${confirmReservation._id.substring(0, 8)}`
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
              {confirmReservation ? (
                <div className="row">
                  {/* Thông tin cơ bản */}
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h2 style={{ fontSize: "20px" }}>
                          Reservation Information
                        </h2>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <p>
                            <strong>Name:</strong>{" "}
                            {confirmReservation.customerName}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {confirmReservation.phoneNumber}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Number of guests:</strong>{" "}
                            {confirmReservation.numberOfGuest}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Time:</strong>{" "}
                            {new Date(
                              confirmReservation.dateTime
                            ).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Area:</strong>{" "}
                            {confirmReservation.seatingArea}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Table Type:</strong>{" "}
                            {confirmReservation.tableType}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p>
                            <strong>Note:</strong> {confirmReservation.note}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* If manual selected, show extra content */}
                    {tableSelectOption === "manual" && (
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h2 style={{ fontSize: "20px" }}>Table Selection</h2>
                        </div>
                        <div className="card-body">
                          <div className="available-tables-container mt-3">
                            <div className="row ">
                              {availableTables.map((table) => (
                                <div className="col-6 d-flex justify-content-center mb-3">
                                  <button
                                    key={table._id}
                                    className={`btn py-2 px-3 ${
                                      selectedTable?._id === table._id
                                        ? "btn-primary"
                                        : "btn-outline-primary"
                                    }`}
                                    onClick={() => setSelectedTable(table)}
                                  >
                                    <div className="d-flex flex-column align-items-center">
                                      <span
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {table.tableNumber}
                                      </span>

                                      <small>
                                        {table.capacity} seats {table.type}
                                      </small>
                                    </div>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Table selection */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h2 style={{ fontSize: "20px" }}>
                          Table selection method
                        </h2>
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
              {/* Close Button */}
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn-select"
              >
                Close
              </button>

              {/* Confirm Button */}
              {availableTables.length == 0 ? (
                <div className="alert alert-warning d-flex align-items-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>

                  <p style={{ marginBottom: "0px" }}>No Table Available</p>
                </div>
              ) : (
                <button
                  className="btn-select selected"
                  onClick={() => handleConfirm()}
                  disabled={availableTables.length === 0}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmReservationModal;
