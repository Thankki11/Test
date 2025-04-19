import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField } from "@mui/material";

function AreasAndTables({ tables }) {
  const [value, setValue] = useState("1");
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

  const handleDetailClick = (table) => {
    setSelectedTable(table);
  };

  return (
    <>
      {/* Modal hiển thị chi tiết table */}
      <div className="modal fade" id="tableDetailModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
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
                <>
                  <p>Area: {selectedTable.seatingArea}</p>
                  <p>Type: {selectedTable.tableType}</p>
                  <p>Capacity: {selectedTable.capacity}</p>
                  <p>Note: {selectedTable.note || "No note"}</p>
                  <p>
                    Created at:{" "}
                    {new Date(selectedTable.createdAt).toLocaleString()}
                  </p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
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
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {areas.map((area, index) => (
                <Tab key={area} label={area} value={(index + 1).toString()} />
              ))}
            </TabList>
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
