import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTableModal = ({ onTableCreated }) => {
  const [seatingAreas, setSeatingAreas] = useState([]);
  const [nextTableNumber, setNextTableNumber] = useState(null);
  const tableTypes = ["Standard", "VIP", "Family", "Bar"];

  const [formData, setFormData] = useState({
    tableNumber: "",
    seatingArea: "",
    newSeatingArea: "",
    tableType: "Standard",
    capacity: 4,
    note: "",
    showNewAreaInput: false,
  });

  // Gọi API lấy khu vực và số bàn tiếp theo
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Lấy khu vực ngồi
        const areaRes = await axios.get(
          "http://localhost:3001/api/tables/get/seating-areas"
        );
        setSeatingAreas(areaRes.data.data || []);

        // Lấy số bàn tiếp theo
        const numberRes = await axios.get(
          "http://localhost:3001/api/tables/get/next-table-number"
        );
        setNextTableNumber(numberRes.data.nextTableNumber);

        setFormData((prev) => ({
          ...prev,
          tableNumber: numberRes.data.nextTableNumber,
        }));

        const response = await axios.get(
          "http://localhost:3001/api/tables/get/all"
        );
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tableData = {
      tableNumber: nextTableNumber,
      seatingArea: formData.showNewAreaInput
        ? formData.newSeatingArea
        : formData.seatingArea,
      tableType: formData.tableType,
      capacity: parseInt(formData.capacity),
      note: formData.note,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/tables/create",
        tableData
      );

      console.log("✅ Tạo bàn thành công:", response.data.data);
      alert("Tạo bàn thành công!");

      // Làm mới dữ liệu: số bàn và khu vực ngồi
      const areaRes = await axios.get(
        "http://localhost:3001/api/tables/get/seating-areas"
      );
      setSeatingAreas(areaRes.data.data || []);

      const numberRes = await axios.get(
        "http://localhost:3001/api/tables/get/next-table-number"
      );
      setNextTableNumber(numberRes.data.nextTableNumber);

      // Reset form
      setFormData({
        tableNumber: numberRes.data.nextTableNumber,
        seatingArea: "",
        newSeatingArea: "",
        tableType: "Standard",
        capacity: 4,
        note: "",
        showNewAreaInput: false,
      });

      //Gọi callback Thông báo tới component cha
      if (onTableCreated) {
        onTableCreated();
      }
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo bàn:",
        error.response?.data || error.message
      );
      alert("Không thể tạo bàn. Có thể số bàn đã tồn tại hoặc lỗi server.");
    }
  };

  return (
    <div className="modal fade" id="addTableModal">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* <!-- Modal Header --> */}
          <div className="modal-header">
            <h4 className="modal-title" style={{ fontSize: "30px" }}>
              Add new table
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* <!-- Modal body --> */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Table Number</label>
                <div className="form-control-plaintext">
                  <strong>
                    {nextTableNumber !== null
                      ? `#${nextTableNumber}`
                      : "Đang tải..."}
                  </strong>
                </div>
              </div>

              <div className="form-group">
                <label>Seating Area</label>
                <select
                  className="form-control"
                  name="seatingArea"
                  value={formData.seatingArea}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({
                      ...prev,
                      showNewAreaInput: e.target.value === "add-new",
                    }));
                  }}
                  required
                >
                  <option value="">----Select Area----</option>
                  {seatingAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                  <option value="add-new">+ Add new Area</option>
                </select>

                {formData.showNewAreaInput && (
                  <input
                    type="text"
                    className="form-control mt-2"
                    name="newSeatingArea"
                    placeholder="Nhập tên khu vực mới"
                    value={formData.newSeatingArea}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Table Type</label>
                <select
                  className="form-control"
                  name="tableType"
                  value={formData.tableType}
                  onChange={handleChange}
                  required
                >
                  {tableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  max="20"
                />
              </div>

              <div className="form-group">
                <label>Note</label>
                <input
                  type="text"
                  className="form-control"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Eg: Near garden, Near window..."
                />
              </div>
              <div className=" d-flex justify-content-between  mt-5">
                <button data-bs-dismiss="modal" className="btn-select">
                  Close
                </button>
                <button type="submit" className="btn-select selected">
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;
