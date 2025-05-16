import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminCombo() {
  const [menus, setMenus] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboImage, setComboImage] = useState(null);
  const [comboPreviewUrl, setComboPreviewUrl] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    // Tính quantity nhỏ nhất của các items menu được chọn
    if (selectedItems.length > 0) {
      const minQty = Math.min(
        ...selectedItems.map((id) => {
          const menu = menus.find((m) => m._id === id);
          return menu ? menu.quantity : Infinity;
        })
      );
      setQuantity(minQty);
    } else {
      setQuantity(0);
    }
  }, [selectedItems, menus]);

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/menus");
      setMenus(res.data);
    } catch (err) {
      alert("Error fetching menus");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setComboImage(file);
    setComboPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleItemChange = (e) => {
    const { value, checked } = e.target;
    setSelectedItems((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleCreateCombo = async () => {
    // Validate input
    if (
      !comboName ||
      !comboPrice ||
      !comboImage ||
      selectedItems.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một món");
      return;
    }

    try {
      // Tạo FormData cho cả ảnh và thông tin combo
      const formData = new FormData();
      formData.append("name", comboName);
      formData.append("description", comboDescription || "");
      formData.append("price", comboPrice);
      selectedItems.forEach((itemId) => {
        formData.append("items", itemId); // Gửi từng item riêng lẻ
      });
      formData.append("image", comboImage); // File ảnh

      // Gọi API tạo combo
      const response = await axios.post(
        "http://localhost:3001/api/combos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Tạo combo thành công!");
        // Reset form
        setComboName("");
        setComboDescription("");
        setComboPrice("");
        setComboImage(null);
        setComboPreviewUrl("");
        setSelectedItems([]);
        setQuantity(0);

        // Cập nhật UI hoặc chuyển hướng nếu cần
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi tạo combo");
      }
    } catch (err) {
      console.error("Lỗi khi tạo combo:", err);
      alert(
        err.response?.data?.message ||
          "Lỗi hệ thống khi tạo combo. Vui lòng thử lại"
      );
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Create New Combo</h2>
      <div className="card p-4">
        <div className="mb-3">
          <label className="form-label">Combo Name</label>
          <input
            type="text"
            className="form-control"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={comboDescription}
            onChange={(e) => setComboDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Combo Price</label>
          <input
            type="number"
            className="form-control"
            value={comboPrice}
            onChange={(e) => setComboPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Combo Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
          {comboPreviewUrl && (
            <img
              src={comboPreviewUrl}
              alt="Combo Preview"
              style={{
                width: "120px",
                marginTop: "10px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Select Items for Combo</label>
          <div className="row">
            {menus.map((menu) => (
              <div className="col-md-4" key={menu._id}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={menu._id}
                    checked={selectedItems.includes(menu._id)}
                    onChange={handleItemChange}
                    id={`menu-item-${menu._id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`menu-item-${menu._id}`}
                  >
                    {menu.name} (Quantity: {menu.quantity})
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Combo Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            readOnly
            disabled
          />
          <div className="form-text">
            Quantity is the minimum quantity among selected items.
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleCreateCombo}>
          Create Combo
        </button>
      </div>
    </div>
  );
}

export default AdminCombo;
