import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TextField } from "@mui/material";

function ReservationsModal() {
  const [allReservations, setAllReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const filterReservations = (
    reservations,
    showAllFlag,
    startDate,
    endDate
  ) => {
    if (showAllFlag) {
      setFilteredReservations(reservations);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const start = startDate || today;
    const end = endDate || today;

    const filtered = reservations.filter((reservation) => {
      const resDate = formatDateFromISO(reservation.dateTime);
      return resDate >= start && resDate <= end;
    });

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    filterReservations(allReservations, showAll, fromDate, toDate);
  }, [allReservations, showAll, fromDate, toDate]);

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

  const handleCancel = (id) => {
    console.log("Cancel reservation with ID:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit reservation with ID:", id);
  };

  const handleConfirm = (id) => {
    console.log("Confirm reservation with ID:", id);
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
    if (!showAll) {
      setFromDate("");
      setToDate("");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
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
        </div>
        <div className="d-flex gap-3 align-items-center">
          <p className="text-center" style={{ marginBottom: "0px" }}>
            Showing {filteredReservations.length} of {allReservations.length}{" "}
            reservations
          </p>
          <button
            style={{ fontSize: "12px", height: "auto", width: "auto" }}
            data-bs-toggle="modal"
            data-bs-target="#addReservationModal"
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
                      onClick={() => handleCancel(reservation._id)}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleEdit(reservation._id)}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      <i class="fa-solid fa-info"></i>
                    </button>
                  </td>
                  <td>{reservationTime}</td>
                  <td>{reservationDate}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.emailAddress}</td>
                  <td>{reservation.phoneNumber}</td>
                  <td>{reservation.numberOfGuest}</td>
                  <td>{reservation.status}</td>
                  <td>
                    {reservation.status === "pending" ? (
                      <button
                        style={{
                          backgroundColor: "darkgreen",
                          color: "white",
                          border: "transparent",
                        }}
                        onClick={() => handleConfirm(reservation._id)}
                      >
                        Confirm
                      </button>
                    ) : (
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
                    )}
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
