import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TextField } from "@mui/material";

import { Modal } from "bootstrap";

function ReservationsModal({ onReservationDetail }) {
  const [allReservations, setAllReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);

  //Các nút filter
  const [showAll, setShowAll] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  //Biến quản lý để xem chi tiết reservation
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [reservationDetail, setReservationDetail] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/reservations/get"
      );
      setAllReservations(response.data);
      filterReservations(response.data, false, "", "");
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, []);

  // Hàm chuyển đổi ISO string sang date string (YYYY-MM-DD)
  const formatDateFromISO = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  };

  //Hàm xử lý lọc filter
  const filterReservations = (
    reservations,
    showAllFlag,
    showPendingFlag,
    startDate,
    endDate
  ) => {
    let filtered = [...reservations];

    // Bước 1: Lọc theo ngày (nếu không chọn showAll)
    if (!showAllFlag) {
      const today = new Date().toISOString().split("T")[0];
      const start = startDate || today;
      const end = endDate || today;

      filtered = filtered.filter((reservation) => {
        const resDate = formatDateFromISO(reservation.dateTime);
        return resDate >= start && resDate <= end;
      });
    }

    // Bước 2: Lọc pending (nếu chọn showPending)
    if (showPendingFlag) {
      filtered = filtered.filter(
        (reservation) => reservation.status === "pending"
      );
    }

    setFilteredReservations(filtered);
  };

  //Xử lý khi các filter thay đổi
  useEffect(() => {
    filterReservations(allReservations, showAll, showPending, fromDate, toDate);
  }, [allReservations, showAll, showPending, fromDate, toDate]);

  useEffect(() => {
    fetchReservations();

    const handleReservationCreated = () => {
      fetchReservations();
    };

    window.addEventListener("reservationsUpdated", handleReservationCreated);

    return () => {
      window.removeEventListener(
        "reservationsUpdated",
        handleReservationCreated
      );
    };
  }, [fetchReservations]);

  //Bấm nút để xem chi tiết về đơn đặt
  const handleEdit = async (id) => {
    try {
      setSelectedReservationId(id);

      // Gọi API lấy thông tin chi tiết
      const response = await axios.get(
        `http://localhost:3001/api/reservations/get/${id}`
      );
      console.log(response.data.data);
      setReservationDetail(response.data.data);
      onReservationDetail(response.data.data);

      // Đóng modal viewReservations trước
      const viewModal = Modal.getInstance(
        document.getElementById("viewReservationsModal")
      );
      viewModal.hide();

      // Sau đó mở modal detail
      const detailModal = new Modal(
        document.getElementById("detailReservationModal")
      );
      detailModal.show();
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      alert("Failed to load reservation details");
    }
  };

  //Bấm nút để xem chi tiết về đơn đặt
  const handleAddNew = async (id) => {
    // Đóng modal viewReservations trước
    const viewModal = Modal.getInstance(
      document.getElementById("viewReservationsModal")
    );
    viewModal.hide();

    // Sau đó mở modal detail
    const detailModal = new Modal(
      document.getElementById("addReservationModal")
    );
    detailModal.show();
  };

  //Bấm nút để xóa đơn
  const handleDelete = async (id) => {
    try {
      // Tìm reservation cần xóa để hiển thị thông tin xác nhận
      const reservationToDelete = allReservations.find((r) => r._id === id);

      if (!reservationToDelete) {
        alert("Reservation not found!");
        return;
      }

      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm(
        `Are you sure you want to DELETE this reservation?\n\n` +
          `Customer: ${reservationToDelete.customerName}\n` +
          `Date: ${formatDateFromISO(reservationToDelete.dateTime)}\n` +
          `Time: ${new Date(reservationToDelete.dateTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}\n` +
          `Guests: ${reservationToDelete.numberOfGuest}\n` +
          `Status: ${reservationToDelete.status}`
      );

      if (isConfirmed) {
        // Gọi API xóa
        await axios.delete(
          `http://localhost:3001/api/reservations/delete/${id}`
        );

        // Cập nhật state (xóa khỏi danh sách)
        setAllReservations((prev) => prev.filter((r) => r._id !== id));

        alert("Reservation deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation. Please try again.");
    }
  };

  //Bấm nút để hủy đơn đã xác nhận
  const handleCancel = async (id) => {
    try {
      // Tìm reservation cần hủy
      const reservationToCancel = allReservations.find((r) => r._id === id);

      if (!reservationToCancel) {
        console.error("Reservation not found");
        return;
      }

      // Kiểm tra nếu reservation chưa được confirmed thì không cho hủy
      if (reservationToCancel.status !== "confirmed") {
        alert("Only confirmed reservations can be cancelled!");
        return;
      }

      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm(
        `Are you sure you want to cancel this reservation?\n\n` +
          `Customer: ${reservationToCancel.customerName}\n` +
          `Date: ${formatDateFromISO(reservationToCancel.dateTime)}\n` +
          `Time: ${new Date(reservationToCancel.dateTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}\n` +
          `Guests: ${reservationToCancel.numberOfGuest}`
      );

      if (isConfirmed) {
        // Gọi API để hủy reservation
        const response = await axios.put(
          `http://localhost:3001/api/reservations/update/${id}`,
          { status: "cancelled" }
        );

        // Cập nhật state
        setAllReservations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r))
        );

        console.log("Cancelled reservation:", response.data);
        alert("Reservation cancelled successfully!");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("Failed to cancel reservation. Please try again.");
    }
  };

  //Bấm nút confirm
  const confirmReservation = async (id) => {
    try {
      // Tìm reservation cần xác nhận
      const reservationToConfirm = allReservations.find((r) => r._id === id);

      if (!reservationToConfirm) {
        console.error("Reservation not found");
        return;
      }

      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm(
        `Are you sure you want to confirm this reservation?\n\n` +
          `Customer: ${reservationToConfirm.customerName}\n` +
          `Date: ${formatDateFromISO(reservationToConfirm.dateTime)}\n` +
          `Time: ${new Date(reservationToConfirm.dateTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}\n` +
          `Guests: ${reservationToConfirm.numberOfGuest}`
      );

      if (isConfirmed) {
        // Gọi API để cập nhật trạng thái
        const response = await axios.put(
          `http://localhost:3001/api/reservations/update/${id}`,
          { status: "confirmed" }
        );

        // Cập nhật state với reservation đã được xác nhận
        setAllReservations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "confirmed" } : r))
        );

        // Log thông tin reservation đã xác nhận
        console.log("Confirmed reservation:", response.data);

        // Có thể thêm thông báo thành công ở đây
        alert("Reservation confirmed successfully!");
      }
    } catch (error) {
      console.error("Error confirming reservation:", error);
      alert("Failed to confirm reservation. Please try again.");
    }
  };

  const handleConfirm = (id) => {
    confirmReservation(id);
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
    if (!showAll) {
      setFromDate("");
      setToDate("");
    }
  };

  const toggleShowPending = () => {
    setShowPending((prev) => !prev);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Bắt đầu giao diện chính */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="d-flex gap-3 align-items-center">
          <TextField
            id="from-date"
            label="From date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={fromDate || today}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={showAll}
          />
          <TextField
            id="to-date"
            label="To date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={toDate || today}
            onChange={(e) => setToDate(e.target.value)}
            disabled={showAll}
          />
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="showAll"
              checked={showAll}
              onChange={toggleShowAll}
            />
            <label className="form-check-label" htmlFor="showAll">
              Show all
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPending"
              checked={showPending}
              onChange={toggleShowPending}
            />
            <label className="form-check-label" htmlFor="showPending">
              Show pending only
            </label>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <p className="text-center" style={{ marginBottom: "0px" }}>
            Showing {filteredReservations.length} of {allReservations.length}{" "}
            reservations
          </p>
          <button
            style={{ fontSize: "12px", height: "auto", width: "auto" }}
            onClick={() => handleAddNew()}
          >
            Add new reservation
          </button>
        </div>
      </div>
      <div>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Action</th>
              <th>Time</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Number of Guests</th>
              <th>Status</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => {
              const reservationDate = formatDateFromISO(reservation.dateTime);
              const reservationTime = new Date(
                reservation.dateTime
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <tr key={reservation._id}>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      title="Cancel"
                      onClick={() => handleDelete(reservation._id)}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleEdit(reservation._id)}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      <i className="fa-solid fa-info"></i>
                    </button>
                  </td>
                  <td>{reservationTime}</td>
                  <td>{reservationDate}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.emailAddress}</td>
                  <td>{reservation.phoneNumber}</td>
                  <td>{reservation.numberOfGuest}</td>
                  <td>
                    <span
                      style={{
                        color:
                          reservation.status === "confirmed"
                            ? "green"
                            : reservation.status === "pending"
                            ? "orange"
                            : reservation.status === "cancelled"
                            ? "red"
                            : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    {reservation.status === "pending" ? (
                      <button
                        style={{
                          backgroundColor: "orange",
                          color: "white",
                          border: "transparent",
                        }}
                        onClick={() => handleConfirm(reservation._id)}
                      >
                        Confirm
                      </button>
                    ) : reservation.status === "confirmed" ? (
                      <button
                        style={{
                          backgroundColor: "darkred",
                          color: "white",
                          border: "transparent",
                        }}
                        onClick={() => handleCancel(reservation._id)}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ReservationsModal;
