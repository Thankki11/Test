import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function AdminCombo() {
  const [menus, setMenus] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboImage, setComboImage] = useState(null);
  const [comboPreviewUrl, setComboPreviewUrl] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [combos, setCombos] = useState([]);
  const [selectedComboId, setSelectedComboId] = useState(null);

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

  const handleCreateCombo = async () => {
    // Validate input
    if (
      !comboName ||
      !comboPrice ||
      !comboImage ||
      selectedItems.length === 0
    ) {
      alert("Please fill in all fields and select at least one item.");
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
        alert("Create combo successfully!");
        // Reset form
        setComboName("");
        setComboDescription("");
        setComboPrice("");
        setComboImage(null);
        setComboPreviewUrl("");
        setSelectedItems([]);
        setQuantity(0);

        // Cập nhật UI hoặc chuyển hướng nếu cần
        fetchCombos(); // Tải lại danh sách combo
        const modal = Modal.getInstance(document.getElementById("addNewCombo"));
        modal.hide();
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

  const fetchCombos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/combos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const combosData = response.data;

      // Lấy tên món ăn từ các itemId trong mỗi combo
      const combosWithItemNames = combosData.map((combo) => {
        // Lấy tên món từ mỗi item có trong combo (itemId bây giờ là object chứa các thông tin của món ăn)
        const itemNames = combo.items.map((itemId) => itemId.name); // itemId là object, lấy name từ đó

        return { ...combo, itemNames }; // Gán thêm danh sách tên món vào combo
      });

      setCombos(combosWithItemNames);
    } catch (err) {
      console.error("Lỗi khi lấy combos:", err);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredMenus, setFilteredMenus] = useState(menus);

  const handleItemChange = (event) => {
    const value = event.target.value;
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(value)
        ? prevSelectedItems.filter((item) => item !== value)
        : [...prevSelectedItems, value]
    );
  };

  const handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    setSearchTerm(searchQuery);

    // Cập nhật danh sách lọc khi người dùng gõ
    if (searchQuery === "") {
      setFilteredMenus(menus); // Khi không tìm kiếm, hiển thị tất cả
    } else {
      const filtered = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenus(filtered);
    }
  };

  const handleEditCombo = (combo) => {
    // Set giá trị của các trường nhập liệu vào modal
    setSelectedComboId(combo._id); // Lưu ID của combo đang chỉnh sửa
    setComboName(combo.name || "");
    setComboDescription(combo.description || "");
    setComboPrice(combo.price || "");

    // Set danh sách items đã chọn
    setSelectedItems(combo.items.map((item) => item._id)); // Giả sử combo.items chứa các object có _id

    // Set combo quantity (lấy giá trị min của quantity trong các items)
    const minQuantity = Math.min(...combo.items.map((item) => item.quantity));
    setQuantity(minQuantity);

    // Set dữ liệu cho ô tìm kiếm nếu cần (tùy vào cách bạn muốn xử lý)
    setSearchTerm(""); // Nếu bạn muốn khi mở modal không có từ khóa tìm kiếm
  };

  const handleUpdateCombo = async (updatedComboData) => {};

  const handleDeleteCombo = async (comboId) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/combos/${comboId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCombos((prev) => prev.filter((combo) => combo._id !== comboId));
      alert("Combo deleted successfully!");
    } catch (err) {
      console.error("Lỗi khi xoá combo:", err);
    }
  };

  return (
    <div>
      {/* Modal tạo combo mới */}
      <div className="modal fade" id="addNewCombo">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Create New Combo
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <div className="container">
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

                  {/* Thanh tìm kiếm */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search items by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  {/* Hiển thị kết quả tìm kiếm */}
                  {searchTerm && filteredMenus.length > 0 && (
                    <ul className="list-group mt-2">
                      {filteredMenus.map((menu) => (
                        <li key={menu._id} className="list-group-item">
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
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Nếu không có kết quả tìm kiếm */}
                  {searchTerm && filteredMenus.length === 0 && (
                    <p className="mt-2">No items found...</p>
                  )}
                </div>
                <div className="mb-3">
                  {selectedItems.length > 0 && (
                    <div className="mt-3">
                      <label style={{ fontWeight: "bold", color: "green" }}>
                        Selected Items:
                      </label>
                      <ul className="list-group">
                        {menus
                          .filter((menu) => selectedItems.includes(menu._id))
                          .map((menu) => (
                            <li
                              key={menu._id}
                              className="list-group-item"
                              style={{ backgroundColor: "#e9ecef" }}
                            >
                              {menu.name} (Quantity: {menu.quantity})
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Combo Quantity
                  </label>
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

                <div className="d-flex justify-content-between mt-5">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button
                    className="d-flex justify-content-end btn-select selected"
                    onClick={handleCreateCombo}
                  >
                    Create Combo
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Modal footer --> */}
          </div>
        </div>
      </div>

      {/* Modal sửa combo */}
      <div className="modal fade" id="editCombo">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Edit Combo
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal body */}
            <div className="modal-body">
              <div className="container">
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
                    type="text"
                    className="form-control"
                    placeholder="Cannot change image"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Items for Combo</label>

                  {/* Search bar */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search items by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />

                  {/* Search result */}
                  {searchTerm && filteredMenus.length > 0 && (
                    <ul className="list-group mt-2">
                      {filteredMenus.map((menu) => (
                        <li key={menu._id} className="list-group-item">
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
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* No search result */}
                  {searchTerm && filteredMenus.length === 0 && (
                    <p className="mt-2">No items found...</p>
                  )}
                </div>
                <div className="mb-3">
                  {selectedItems.length > 0 && (
                    <div className="mt-3">
                      <label style={{ fontWeight: "bold", color: "green" }}>
                        Selected Items:
                      </label>
                      <ul className="list-group">
                        {menus
                          .filter((menu) => selectedItems.includes(menu._id))
                          .map((menu) => (
                            <li
                              key={menu._id}
                              className="list-group-item"
                              style={{ backgroundColor: "#e9ecef" }}
                            >
                              {menu.name} (Quantity: {menu.quantity})
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Combo Quantity
                  </label>
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

                <div className="d-flex justify-content-between mt-5">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button
                    className="d-flex justify-content-end btn-select selected"
                    onClick={() => {
                      const updatedCombo = {
                        name: comboName,
                        description: comboDescription,
                        price: comboPrice,
                        items: selectedItems,
                        quantity: quantity,
                      };
                      handleUpdateCombo(updatedCombo);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-center mb-3">Manage Combos</h2>

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
            const modal = new Modal(document.getElementById("addNewCombo"));
            modal.show();
          }}
        >
          Add Combo
        </button>
      </div>

      <div className="container">
        <div className="card">
          <div className="card-body" style={{ minHeight: "500px" }}>
            <h4 style={{ fontWeight: "bold" }}>Combos List</h4>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Image</th>
                  <th style={{ width: "15%" }}>Name</th>
                  <th style={{ width: "20%" }}>Description</th>
                  <th style={{ width: "25%" }}>Items</th>
                  <th style={{ width: "10%" }}>Price</th>
                  <th style={{ width: "10%" }}>Quantity</th>
                  <th style={{ width: "15%" }}>Created At</th>
                  <th style={{ width: "5%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {combos.map((combo) => (
                  <tr key={combo._id}>
                    <td>
                      <img
                        src={`http://localhost:3001${combo.imageUrl}`}
                        alt={combo.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{combo.name}</td>
                    <td>{combo.description}</td>
                    <td>
                      <ul className="mb-0">
                        {combo.itemNames?.map((name, index) => (
                          <li key={index}>
                            {index + 1}. {name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>${combo.price.toLocaleString()}</td>
                    <td>{combo.quantity}</td>
                    <td>{new Date(combo.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-select selected"
                          style={{
                            padding: "0px 0px",
                            margin: "0px 0px",
                            width: "50px",
                            paddingLeft: "5px",
                          }}
                          onClick={() => {
                            handleEditCombo(combo);
                            const modal = new Modal(
                              document.getElementById("editCombo")
                            );
                            modal.show();
                          }}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn-select"
                          style={{
                            padding: "0px 0px",
                            margin: "0px 0px",
                            width: "50px",
                            paddingLeft: "5px",
                          }}
                          onClick={() => handleDeleteCombo(combo._id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {combos.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No combos found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCombo;
