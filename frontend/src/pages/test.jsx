import React, { useState } from "react";
import { TextField } from "@mui/material";

const Test = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    emailAddress: "",
    phoneNumber: "",
    numberOfGuest: 1,
    tableNumber: 1,
    seatingArea: "Indoor Area A",
    status: "pending",
    datetime: "",
    note: "",
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu trước khi gửi
    const reservationData = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    console.log("Reservation Data:", reservationData);
    // Gọi API ở đây
    handleCloseModal();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        style={{
          fontSize: "12px",
          height: "auto",
          width: "auto",
        }}
        className="btn btn-primary"
      >
        Add new reservation
      </button>

      {/* Bootstrap Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">New Reservation</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="numberOfGuest"
                    value={formData.numberOfGuest}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Table Number</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Seating Area</label>
                  <select
                    className="form-select"
                    name="seatingArea"
                    value={formData.seatingArea}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Indoor Area A">Indoor Area A</option>
                    <option value="Indoor Area B">Indoor Area B</option>
                    <option value="Outdoor Area">Outdoor Area</option>
                    <option value="VIP Room">VIP Room</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Date & Time</label>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Note</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </>
  );
};

export default Test;
