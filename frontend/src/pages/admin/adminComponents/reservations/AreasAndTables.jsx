import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField, Tabs } from "@mui/material";

function AreasAndTables({ tables, reservations }) {
  const [value, setValue] = useState("1");

  const todayStr = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [areas, setAreas] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null); // 👈 Table được chọn

  useEffect(() => {
    const uniqueAreas = [
      ...new Set(tables.map((table) => table.seatingArea.trim())),
    ];
    setAreas(uniqueAreas);
  }, [tables]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTablesByArea = (area) => {
    return tables.filter((table) => table.seatingArea.trim() === area);
  };

  const formatDate = (date) => date.toISOString().split("T")[0]; // Trả về "YYYY-MM-DD"

  const handleDetailClick = (table) => {
    setSelectedTable(table);
    console.log(table);
  };

  return (
    <>
      {/* Modal hiển thị chi tiết table */}
      <div className="modal fade" id="tableDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          {" "}
          {/* Thêm modal-lg để rộng hơn */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontSize: "30px" }}>
                Table {selectedTable?.tableNumber} Detail
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedTable ? (
                <div className="row">
                  <div className="col-md-4">
                    <h5 style={{ fontSize: "30px" }}></h5>
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th>Area</th>
                          <td>{selectedTable.seatingArea}</td>
                        </tr>
                        <tr>
                          <th>Table type</th>
                          <td>{selectedTable.tableType}</td>
                        </tr>
                        <tr>
                          <th>Capacity</th>
                          <td>{selectedTable.capacity}</td>
                        </tr>
                        <tr>
                          <th>Note</th>
                          <td>{selectedTable.note || "Currently no note"}</td>
                        </tr>
                        <tr>
                          <th>Date created</th>
                          <td>
                            {new Date(selectedTable.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button>Click me</button>
                  </div>

                  <div className="col-md-8">
                    <h5 style={{ fontSize: "30px" }}>Booking history</h5>
                    {selectedTable.bookingHistory?.length > 0 ? (
                      <div
                        className="table-responsive"
                        style={{
                          maxHeight: "400px", // Giới hạn chiều cao tối đa
                          overflowY: "auto", // Cho phép cuộn dọc khi cần
                          border: "1px solid #dee2e6", // Thêm viền cho đẹp
                          borderRadius: "4px", // Bo góc
                        }}
                      >
                        <table className="table table-striped mb-0">
                          {" "}
                          {/* mb-0 để xóa margin bottom */}
                          <thead
                            style={{
                              position: "sticky", // Giữ tiêu đề khi cuộn
                              top: 0,
                              backgroundColor: "white", // Nền trắng cho tiêu đề
                              zIndex: 1, // Đảm bảo hiển thị trên nội dung
                            }}
                          >
                            <tr>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Reservation ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTable.bookingHistory
                              .sort(
                                (a, b) =>
                                  new Date(b.startTime) - new Date(a.startTime)
                              )
                              .map((booking) => {
                                const bookingDateStr =
                                  booking.startTime.split("T")[0]; // "2025-07-17"
                                const isToday = bookingDateStr === todayStr;

                                return (
                                  <tr
                                    key={booking._id}
                                    style={
                                      isToday ? { backgroundColor: "red" } : {}
                                    }
                                  >
                                    <td>
                                      {new Date(
                                        booking.startTime
                                      ).toLocaleDateString()}
                                    </td>
                                    <td>
                                      {new Date(
                                        booking.startTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}{" "}
                                      -{" "}
                                      {new Date(
                                        booking.endTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </td>
                                    <td>
                                      {booking.reservationId.toString()}...
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No booking history</p>
                    )}
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-start">
              <button
                type="button"
                className="btn-select"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Giao diện chính */}
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
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              style={{ width: "600px" }}
            >
              {areas.map((area, index) => (
                <Tab key={area} label={area} value={(index + 1).toString()} />
              ))}
            </Tabs>
            <TextField
              id="date"
              label="Choose date"
              type="date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          {areas.map((area, index) => (
            <TabPanel key={area} value={(index + 1).toString()}>
              <div className="row">
                {getTablesByArea(area).map((table) => (
                  <div key={table._id} className="col-4 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title" style={{ fontSize: "30px" }}>
                          Table {table.tableNumber}
                        </h5>
                        <p
                          className="card-text"
                          style={{ fontFamily: "josefinSans" }}
                        >
                          Type: {table.tableType}
                          <br />
                          Capacity: {table.capacity}
                        </p>
                        <button
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#tableDetailModal"
                          onClick={() => handleDetailClick(table)} // 👈 Gán table được chọn
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </>
  );
}

export default AreasAndTables;
