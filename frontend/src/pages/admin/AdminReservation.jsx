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
