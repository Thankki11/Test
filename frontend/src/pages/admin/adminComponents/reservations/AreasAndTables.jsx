import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField, Tabs, Button } from "@mui/material";

function AreasAndTables({ tables, reservations }) {
  const [value, setValue] = useState("1");
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [areas, setAreas] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editedTable, setEditedTable] = useState(null); // 👈 State để lưu thông tin chỉnh sửa

  useEffect(() => {
    const uniqueAreas = [
      ...new Set(tables.map((table) => table.seatingArea.trim())),
    ];
    setAreas(uniqueAreas);
  }, [tables]);

  // Khi chọn bàn, copy dữ liệu vào editedTable
  const handleDetailClick = (table) => {
    setSelectedTable(table);
    setEditedTable({ ...table }); // Tạo bản sao để chỉnh sửa
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTablesByArea = (area) => {
    return tables.filter((table) => table.seatingArea.trim() === area);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated table data:", editedTable);
    // Ở đây bạn có thể thêm logic gửi dữ liệu lên server
  };

  return (
    <>
      {/* Modal hiển thị và chỉnh sửa chi tiết table */}
      <div className="modal fade" id="tableDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontSize: "30px" }}>
                Edit Table {selectedTable?.tableNumber}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {editedTable ? (
                <div className="row">
                  <div className="col-xl-4">
                    <form onSubmit={handleSubmit}>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Area</th>
                            <td>
                              <input
                                type="text"
                                name="seatingArea"
                                value={editedTable.seatingArea}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Table type</th>
                            <td>
                              <input
                                type="text"
                                name="tableType"
                                value={editedTable.tableType}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Capacity</th>
                            <td>
                              <input
                                type="number"
                                name="capacity"
                                value={editedTable.capacity}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Note</th>
                            <td>
                              <textarea
                                name="note"
                                value={editedTable.note}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Currently no note"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th>Date created</th>
                            <td>
                              <input
                                type="datetime-local"
                                name="createdAt"
                                value={new Date(editedTable.createdAt)
                                  .toISOString()
                                  .slice(0, 16)}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-between">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="col-xl-8">
                    <h5 style={{ fontSize: "30px" }}>Booking history</h5>
                    {selectedTable.bookingHistory?.length > 0 ? (
                      <div
                        className="table-responsive"
                        style={{
                          maxHeight: "400px",
                          overflowY: "auto",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                        }}
                      >
                        <table className="table table-striped mb-0">
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              backgroundColor: "white",
                              zIndex: 1,
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
                                  booking.startTime.split("T")[0];
                                const isToday = bookingDateStr === todayStr;

                                return (
                                  <tr
                                    key={booking._id}
                                    style={
                                      isToday
                                        ? { backgroundColor: "#ffdddd" }
                                        : {}
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
          </div>
        </div>
      </div>

      {/* Giao diện chính (giữ nguyên) */}
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
                          onClick={() => handleDetailClick(table)}
                        >
                          Edit Table
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
