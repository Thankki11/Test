import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

//Components
import ReservationsModal from "./adminComponents/reservations/ViewReservations/ReservationsModal";
import AreasAndTables from "./adminComponents/reservations/AreasAndTables";
import AddTableModal from "./adminComponents/reservations/AddNewTable";

function AdminReservation() {
  //Lưu danh sách các bàn
  const [tables, setTables] = useState([]);
  //Lưu danh sách các đơn đặt bàn
  const [reservations, setReservations] = useState([]);

  //Lưu thông tin chi tiết của 1 đơn đặt bàn
  const [reservationDetail, setReservationDetail] = useState(null);

  useEffect(() => {
    fetchTables(); // Gọi fetchTables khi component load
    fetchReservations(); // Gọi fetchReservations khi component load
  }, []);

  //Start: Lấy dữ liệu từ CSDL
  //Lấy dữ liệu các bàn
  const fetchTables = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/tables/get/all"
      );
      setTables(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  //Lấy dữ liệu các đơn đặt bàn
  const fetchReservations = async () => {
    try {
      console.log("Đang lấy dữ liệu từ trang cha");
      const response = await axios.post(
        "http://localhost:3001/api/reservations/get"
      );
      setReservations(response.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  //End: Lấy dữ liệu từ CSDL

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

  return (
    <>
      {/* Modal xem các đơn đặt bàn  */}
      <ReservationsModal
        reservations={reservations}
        tables={tables}
        onReloadReservations={fetchReservations}
        onReloadTables={fetchTables}
      />

      {/* Modal Tạo bàn mới */}
      <AddTableModal onTableCreated={fetchTables} />

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
          <AreasAndTables tables={tables} />
        </div>
      </div>
    </>
  );
}

export default AdminReservation;
