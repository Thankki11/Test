import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import * as bootstrap from "bootstrap";


function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    discount: "",
    expirationDate: "",
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
    <div className="container">
      <h2 className="text-center mb-3">Manage Vouchers</h2>

      {/* Form thêm voucher */}
      <div className="mb-4">
        <h4>Add New Voucher</h4>
        <input
          type="text"
          placeholder="Code"
          value={newVoucher.code}
          onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={newVoucher.discount}
          onChange={(e) => setNewVoucher({ ...newVoucher, discount: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={newVoucher.expirationDate}
          onChange={(e) =>
            setNewVoucher({ ...newVoucher, expirationDate: e.target.value })
          }
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={handleAddVoucher}>
          Add Voucher
        </button>
      </div>

      {/* Danh sách voucher */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount (%)</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id}>
              <td>{voucher.code}</td>
              <td>{voucher.discount}</td>
              <td>{new Date(voucher.expirationDate).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-danger"
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
  );
}

export default AdminVouchers;