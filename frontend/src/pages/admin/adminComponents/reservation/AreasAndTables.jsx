import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextField } from "@mui/material";
import axios from "axios";

function AreasAndTables({ onTableSelect }) {
  const [value, setValue] = useState("1");
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);

  //Lưu trữ ngày đang chọn
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // định dạng YYYY-MM-DD
  });

  // Fetch danh sách bàn khi component mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/tables/get/all"
        );
        console.log("Full response:", response); // Kiểm tra toàn bộ response
        console.log("Response data:", response.data); // Kiểm tra cấu trúc data

        // Sửa thành response.data.data vì API trả về {success: true, data: [...]}
        setTables(response.data.data || []); // Thêm fallback mảng rỗng

        // Lấy danh sách khu vực không trùng lặp
        const uniqueAreas = [
          ...new Set(
            response.data.data.map((table) => table.seatingArea.trim())
          ),
        ];
        setAreas(uniqueAreas);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Lọc bàn theo khu vực được chọn
  const getTablesByArea = (area) => {
    return tables.filter((table) => table.seatingArea.trim() === area);
  };

  return (
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

        {/* Hiển thị bàn theo từng khu vực */}
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
                        onClick={() => onTableSelect(table, selectedDate)} // Truyền toàn bộ object table và ngày đã chọn lên component cha
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
  );
}

export default AreasAndTables;
