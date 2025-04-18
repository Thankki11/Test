import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

//MUI
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField } from "@mui/material";

//Components
import ReservationForm from "../../components/ReservationForm";
import ReservationsModal from "./adminComponents/reservation/ReservationsModal";

function AdminReservation() {
  //MUI
  const [value, setValue] = React.useState("1");
  //Lọc theo ngày
  const [showAll, setShowAll] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  //Lưu thông tin các đơn đặt bàn
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);

  //Lưu thông tin chi tiết của 1 đơn đặt bàn
  const [reservationDetail, setReservationDetail] = useState(null);

  const handleReservationDetail = (detail) => {
    setReservationDetail(detail);
  };

  //Thứ tự hiển thị modal
  useEffect(() => {
    // Lấy cả hai modal
    const detailModal = document.getElementById("detailReservationModal");
    const addModal = document.getElementById("addReservationModal");

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

    return () => {
      // Cleanup listener khi component unmount
      detailModal?.removeEventListener("hidden.bs.modal", handleHidden);
      addModal?.removeEventListener("hidden.bs.modal", handleHidden);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Modal xem thông tin chi tiết của bàn gồm danh sách các đơn đã được đặt ở bàn đó theo ngày */}
      <div className="modal  fade" id="tableDetail">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Table 1 Detail
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <p>Table number: 5</p>
              <p>Area: Indoor Area A</p>
              <p>Sức chứa: 4</p>
              <p>Status: Working/Bảo trì</p>
              {/* Bảng chứa danh sách các đơn đã đặt tại bàn này theo ngày */}
              {/* Tính năng chưa làm: Sắp xếp đơn theo thời gian tăng dần */}
            </div>

            {/* <!-- Modal footer --> */}
            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="d-flex gap-3">
                <button className="btn-select">Delete table</button>
                <button> Edit table</button>
              </div>
              <button type="button" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem các đơn đặt bàn  */}
      <div className="modal fade" id="viewReservationsModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                View Reservations
              </h4>
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
            <div className="modal-footer">
              <button data-bs-dismiss="modal">Close</button>
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem detail của đơn đặt bàn */}
      <div className="modal fade" id="detailReservationModal" tabIndex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            {/* <!-- Modal Header --> */}
            <div class="modal-header">
              <h5 className="modal-title" style={{ fontSize: "30px" }}>
                Reservation Details{" "}
                {reservationDetail?._id &&
                  `#${reservationDetail._id.substring(0, 8)}`}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div class="modal-body">
              {reservationDetail ? (
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Customer:</strong>{" "}
                      {reservationDetail.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {reservationDetail.emailAddress}
                    </p>
                    <p>
                      <strong>Phone:</strong> {reservationDetail.phoneNumber}
                    </p>
                    <p>
                      <strong>Number of Guests:</strong>{" "}
                      {reservationDetail.numberOfGuest}
                    </p>
                    <p>
                      <strong>Seating Area:</strong>{" "}
                      {reservationDetail.seatingArea}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      <strong>Reservation Date:</strong>{" "}
                      {new Date(reservationDetail.dateTime).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                    <p>
                      <strong>Reservation Time:</strong>{" "}
                      {new Date(reservationDetail.dateTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(reservationDetail.createdAt).toLocaleString(
                        "en-GB"
                      )}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge bg-${
                          reservationDetail.status === "confirmed"
                            ? "success"
                            : reservationDetail.status === "pending"
                            ? "warning"
                            : reservationDetail.status === "cancelled"
                            ? "danger"
                            : "secondary"
                        }`}
                      >
                        {reservationDetail.status}
                      </span>
                    </p>
                  </div>

                  {reservationDetail.note && (
                    <div className="col-12 mt-3">
                      <p>
                        <strong>Note:</strong>
                      </p>
                      <p>{reservationDetail.note}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* <!-- Modal footer --> */}
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
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
            <div className="col-6">
              <p>Total table: 50</p>
              <p>Total table registered: 20</p>
              <p>Total table empty:5</p>
            </div>
            <div className="col-6">
              <div className="d-flex " style={{ gap: "20px" }}>
                {/* Thêm bàn mới */}
                <button> Add new table</button>

                {/* Hiển thị danh sách các yêu cầu đặt bàn chưa được xác nhận */}
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
              <div className="d-flex justify-content-end mt-5">
                <p style={{ fontSize: "30px" }}>Curent view: 23/2/2025</p>
              </div>
            </div>
          </div>
        </div>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Indoor Area A" value="1" />
                <Tab label="Indoor Area B" value="2" />
                <Tab label="Outdoor Area A" value="3" />
              </TabList>
              <TextField
                id="date"
                label="Choose date"
                type="date"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            {/* Detail các bàn: Sửa, xóa thông tin bàn. Xem, sửa, xóa thông tin đặt bàn */}
            {/* Nếu trong detail có các đơn đặt bàn chưa được xác nhận, thì card sẽ được highlight */}
            <TabPanel value="1">
              {" "}
              <div className="row">
                <div className="col-4">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-title">Table 1</p>
                      <p>
                        Nếu có đơn đặt bàn của bàn này chưa được xác nhận thì
                        highlight card này
                      </p>
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#tableDetail"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-title">Table 2</p>
                      <button>Detail</button>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-title">Table 3</p>
                      <button>Detail</button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    </>
  );
}

export default AdminReservation;
