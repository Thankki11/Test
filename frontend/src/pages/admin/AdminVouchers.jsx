import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import * as bootstrap from "bootstrap";

function AdminVouchers() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    name: "",
    voucherCode: "",
    description: "",
    discount_type: "",
    discount_value: "",
    min_order_value: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/vouchers");
      setVouchers(response.data);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    }
  };

  const handleAddVoucher = async () => {
    try {
      await axios.post("http://localhost:3001/api/vouchers", newVoucher);
      alert("Voucher added successfully");
      setNewVoucher({ code: "", discount: "", expirationDate: "" });
      fetchVouchers();
    } catch (err) {
      console.error("Error adding voucher:", err);
    }
  };

  const handleNewVoucherChange = (e) => {
    const { name, value } = e.target;

    setNewVoucher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateVoucher = async () => {
    const {
      name,
      voucherCode,
      description,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
    } = newVoucher;

    // Kiểm tra các trường bắt buộc
    {
      if (
        !name ||
        !voucherCode ||
        !discount_value ||
        !min_order_value ||
        !start_date ||
        !end_date
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Kiểm tra giá trị discount_value
      if (discount_value < 0) {
        alert("Discount value cannot be negative.");
        return;
      }

      // Kiểm tra giảm giá phần trăm không thể lớn hơn 100%
      if (discount_type === "PERCENT" && discount_value > 100) {
        alert("Discount percentage cannot be greater than 100%.");
        return;
      }

      // Kiểm tra min_order_value không thể là số âm
      if (min_order_value < 0) {
        alert("Minimum order value cannot be negative.");
        return;
      }

      // Kiểm tra ngày bắt đầu và ngày kết thúc
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      if (startDate >= endDate) {
        alert("Start date must be before end date.");
        return;
      }
    }

    try {
      // Gửi yêu cầu tạo voucher
      const response = await axios.post("http://localhost:3001/api/vouchers", {
        name,
        voucherCode,
        description,
        discount_type,
        discount_value: parseFloat(discount_value), // Chuyển discount_value thành số thực
        min_order_value: parseFloat(min_order_value), // Chuyển min_order_value thành số thực
        start_date,
        end_date,
      });

      alert("Voucher created successfully");

      // Reset form sau khi tạo voucher thành công
      setNewVoucher({
        name: "",
        voucherCode: "",
        description: "",
        discount_type: "",
        discount_value: "",
        min_order_value: "",
        start_date: "",
        end_date: "",
      });

      // Tải lại danh sách voucher (nếu có)
      fetchVouchers(); // Hàm này có thể là một API call để tải lại danh sách voucher

      // Đóng modal (nếu có)
      const modal = Modal.getInstance(document.getElementById("addNewVoucher"));
      modal.hide();
    } catch (error) {
      if (error.response && error.response.data) {
        // Lấy thông báo từ backend (message)
        const message = error.response.data.message;

        // Hiển thị thông báo lỗi cho người dùng
        alert(message || "An unexpected error occurred.");
      } else {
        // Nếu không có phản hồi từ backend (ví dụ: lỗi mạng)
        alert("An error occurred while creating the voucher.");
      }
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await axios.delete(`http://localhost:3001/api/vouchers/${id}`);
        alert("Voucher deleted successfully");
        fetchVouchers();
      } catch (err) {
        console.error("Error deleting voucher:", err);
      }
    }
  };

  return (
    <div>
      <div className="modal fade" id="addNewVoucher">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Add new voucher
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newVoucher.name}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>Voucher Code</label>
                  <input
                    type="text"
                    name="voucherCode"
                    value={newVoucher.voucherCode}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newVoucher.description}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label>Discount Type</label>
                  <select
                    name="discount_type"
                    value={newVoucher.discount_type}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  >
                    <option value="">-- Select Discount Type --</option>
                    <option value="PERCENT">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    name="discount_value"
                    value={newVoucher.discount_value}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>Minimum Order Value</label>
                  <input
                    type="number"
                    name="min_order_value"
                    value={newVoucher.min_order_value}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={newVoucher.start_date}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={newVoucher.end_date}
                    onChange={handleNewVoucherChange}
                    className="form-control"
                  />
                </div>

                <div className="d-flex justify-content-between mt-5">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateVoucher}
                    className="btn-select selected"
                  >
                    Create Voucher
                  </button>
                </div>
              </form>
            </div>

            {/* <!-- Modal footer --> */}
          </div>
        </div>
      </div>

      <h2 className="text-center mb-3">Manage Vouchers</h2>

      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, category or description..."
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
        />

        <button
          onClick={() => {
            const modal = new Modal(document.getElementById("addNewVoucher"));
            modal.show();
          }}
        >
          Add voucher
        </button>
      </div>

      <div className="container">
        {/* Danh sách voucher */}
        <div className="card">
          <div className="card-body" style={{ minHeight: "500px" }}>
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              Vouchers List
            </span>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Min Order Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Description</th>

                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td>{voucher.voucherCode}</td>
                    <td>{voucher.name}</td>
                    <td>{voucher.discount_type}</td>
                    <td>
                      {voucher.discount_type === "PERCENT"
                        ? `${voucher.discount_value}%`
                        : `$${voucher.discount_value.toLocaleString()}`}
                    </td>
                    <td>${voucher.min_order_value.toLocaleString()}</td>
                    <td>{new Date(voucher.start_date).toLocaleDateString()}</td>
                    <td>{new Date(voucher.end_date).toLocaleDateString()}</td>
                    <td>{voucher.description}</td>

                    <td>{new Date(voucher.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn-selected btn-sm"
                        onClick={() => handleDeleteVoucher(voucher._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminVouchers;
