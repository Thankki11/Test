import axios from "axios";
import { useEffect, useState } from "react";

import { Modal } from "bootstrap";

function DetailReservationModal({ reservationDetail, onReservationUpdated }) {
  const [editableReservation, setEditableReservation] =
    useState(reservationDetail);
  const [seatingAreas, setSeatingAreas] = useState([]);

  // Cập nhật reservationDetail khi props thay đổi
  useEffect(() => {
    setEditableReservation(reservationDetail);
  }, [reservationDetail]);

  // Fetch danh sách khu vực ngồi
  useEffect(() => {
    const fetchSeatingAreas = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/tables/get/seating-areas"
        );
        setSeatingAreas(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch khu vực ngồi:", error);
      }
    };

    fetchSeatingAreas();
  }, []);

  const handleUpdateReservation = async (id, updatedData) => {
    try {
      const { _id, __v, createdAt, ...dataToSend } = updatedData;
      const response = await axios.put(
        `http://localhost:3001/api/reservations/update/${id}`,
        dataToSend
      );
      if (response.status === 200) {
        alert("Reservation updated successfully!");
        onReservationUpdated?.();

        //Đóng modal này, mở modal cha
        Modal.getInstance(
          document.getElementById("detailReservationModal")
        )?.hide();
        document.activeElement.blur(); // tránh warning accessibility
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation");
    }
  };

  return (
    <div className="modal fade" id="detailReservationModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ fontSize: "30px" }}>
              Reservation Details{" "}
              {editableReservation?._id &&
                `#${editableReservation._id.substring(0, 8)}`}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            {editableReservation ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateReservation(
                    editableReservation._id,
                    editableReservation
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
                        value={editableReservation.customerName || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
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
                        value={editableReservation.emailAddress || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
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
                        value={editableReservation.phoneNumber || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
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
                        value={editableReservation.numberOfGuest || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
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
                        value={editableReservation.seatingArea || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
                            seatingArea: e.target.value,
                          })
                        }
                      >
                        {seatingAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Table type:</strong>
                      </label>
                      <select
                        className="form-select"
                        value={editableReservation.tableType || ""}
                        onChange={(e) =>
                          setEditableReservation({
                            ...editableReservation,
                            tableType: e.target.value,
                          })
                        }
                      >
                        <option value="Standard">Standard</option>
                        <option value="Vip">Vip</option>
                        <option value="Family">Family</option>
                        <option value="Bar">Bar</option>
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
                          new Date(editableReservation.dateTime)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) => {
                          const newDate = new Date(
                            editableReservation.dateTime
                          );
                          const [year, month, day] = e.target.value.split("-");
                          newDate.setFullYear(year, month - 1, day);
                          setEditableReservation({
                            ...editableReservation,
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
                        value={new Date(editableReservation.dateTime)
                          .toTimeString()
                          .substring(0, 5)}
                        onChange={(e) => {
                          const newDate = new Date(
                            editableReservation.dateTime
                          );
                          const [hours, minutes] = e.target.value.split(":");
                          newDate.setHours(hours, minutes);
                          setEditableReservation({
                            ...editableReservation,
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
                        {new Date(editableReservation.createdAt).toLocaleString(
                          "en-GB"
                        )}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="label mb-0">
                        <strong>Status:</strong>
                      </label>
                      <p
                        style={{
                          fontSize: "14px",
                          color:
                            editableReservation.status === "confirmed"
                              ? "green"
                              : editableReservation.status === "pending"
                              ? "orange"
                              : editableReservation.status === "cancelled" ||
                                editableReservation.status === "table deleted"
                              ? "red"
                              : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {editableReservation.status}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="label mb-0">
                        <strong>Table number selected:</strong>
                      </label>
                      <p style={{ fontSize: "14px" }}>
                        {editableReservation.selectedTable
                          ? editableReservation.selectedTable.tableNumber
                          : "No table selected"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="label mb-0">
                        <strong>Table capacity:</strong>
                      </label>
                      <p style={{ fontSize: "14px" }}>
                        {editableReservation.selectedTable
                          ? editableReservation.selectedTable.capacity
                          : "No table selected"}
                      </p>
                    </div>
                  </div>

                  {editableReservation.note && (
                    <div className="col-12 mt-3">
                      <div className="mb-3">
                        <label className="form-label">
                          <strong>Note:</strong>
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={editableReservation.note || ""}
                          onChange={(e) =>
                            setEditableReservation({
                              ...editableReservation,
                              note: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className=" d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn-select selected">
                    Update
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

          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default DetailReservationModal;
