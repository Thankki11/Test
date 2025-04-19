import React, { useState, useEffect } from "react";

function ConfirmReservationModal({ reservationDetail }) {
  const [confirmReservation, setConfirmReservation] =
    useState(reservationDetail);
  const [tableSelectOption, setTableSelectOption] = useState("auto");

  useEffect(() => {
    setConfirmReservation(reservationDetail);
  }, [reservationDetail]);

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
                      </div>
                    </div>

                    {/* If manual selected, show extra content */}
                    {tableSelectOption === "manual" && (
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h2 style={{ fontSize: "20px" }}>Table Selection</h2>
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
              <button className="btn-select selected">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmReservationModal;
