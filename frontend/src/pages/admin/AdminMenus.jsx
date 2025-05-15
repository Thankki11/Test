import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const categories = ["drink", "mainCourse", "dessert", "appetizer"];

function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [editMenu, setEditMenu] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // ✅ thêm current page
  const menusPerPage = 10; // ✅ số lượng món ăn trên mỗi trang

  const [newMenu, setNewMenu] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    price: "",
    imageBuffer: null,
    fileName: "",
    previewUrl: "",
    quantity: "200", // Added quantity field
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleOrderConfirmed = () => {
      // Gọi lại API lấy danh sách menu
      fetchMenus();
    };

    window.addEventListener("orderConfirmed", handleOrderConfirmed);

    return () => {
      window.removeEventListener("orderConfirmed", handleOrderConfirmed);
    };
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/menus");
      setMenus(response.data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  const [sortField, setSortField] = useState(null); // "name", "price"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"
  const [selectedCategory, setSelectedCategory] = useState(""); // cho bộ lọc theo category

  // Filter menus based on search keyword
  const filteredMenus = menus
    .filter((menu) => {
      const keyword = searchKeyword.toLowerCase();
      const matchesKeyword =
        menu.name?.toLowerCase().includes(keyword) ||
        menu.category?.toLowerCase().includes(keyword) ||
        menu.description?.toLowerCase().includes(keyword);

      const matchesCategory = selectedCategory
        ? menu.category === selectedCategory
        : true;

      return matchesKeyword && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });


  // ✅ Phân trang: Tính toán danh sách menu cần hiển thị
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);

  const totalPages = Math.ceil(filteredMenus.length / menusPerPage);



  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await axios.delete(`http://localhost:3001/api/menus/${id}`);
        alert("Menu deleted successfully");
        fetchMenus();
      } catch (err) {
        console.error("Error deleting menu:", err);
      }
    }
  };

  const handleEdit = (menu) => {
    setEditMenu({
      ...menu,
      quantity: menu.quantity || 0, // Đặt giá trị mặc định cho quantity nếu chưa có
      previewUrl: `http://localhost:3001${menu.imageUrl}`,
    });
  };


  const handleSave = async () => {
  try {
    const {
      name,
      description,
      category,
      price,
      fileName,
      imageBuffer,
      mimeType,
      quantity, // Đảm bảo quantity được gửi
    } = editMenu;

    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      imageBuffer,
      fileName,
      mimeType,
      quantity: parseInt(quantity), // Chuyển quantity thành số nguyên
    };

    await axios.put(`http://localhost:3001/api/menus/${editMenu._id}`, payload);

    alert("Menu updated successfully");
    setEditMenu(null);
    fetchMenus();
  } catch (err) {
    console.error("Error updating menu:", err);
  }
};


  const handleChange = (e) => {
    setEditMenu({ ...editMenu, [e.target.name]: e.target.value });
  };

  const handleNewMenuChange = (e) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", newMenu.category);

    axios
      .post("http://localhost:3001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { fileName, category, imageBuffer } = response.data;
        setNewMenu({
          ...newMenu,
          fileName,
          category,
          imageBuffer,
          previewUrl: URL.createObjectURL(file), // Hiển thị ảnh tạm thời
        });
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
      });
  };

const handleEditImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", editMenu.category || "mainCourse"); // fallback

  axios
    .post("http://localhost:3001/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      const { fileName, imageBuffer, mimeType } = response.data;

      const previewUrl = URL.createObjectURL(file);

      setEditMenu((prev) => ({
        ...prev,
        fileName,
        imageBuffer,
        mimeType,
        previewUrl,
      }));
    })
    .catch((err) => {
      console.error("Error uploading image:", err);
    });
};

  const handleCreateMenu = async () => {
  const { name, description, price, category, quantity, fileName, imageBuffer } = newMenu;

  // Kiểm tra các trường bắt buộc
  if (!name || !description || !price || !category || !quantity) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    // Gửi yêu cầu tạo món ăn
    const response = await axios.post("http://localhost:3001/api/menus", {
      name,
      description,
      price: parseFloat(price), // Chuyển giá thành số thực
      category,
      quantity: parseInt(quantity), // Chuyển số lượng thành số nguyên
      fileName,
      imageBuffer,
    });

    alert("Menu created successfully");
    setNewMenu({
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      price: "",
      quantity: "", // Reset quantity
      imageBuffer: null,
      fileName: "",
      previewUrl: "",
    });
    fetchMenus(); // Tải lại danh sách menu
    const modal = Modal.getInstance(document.getElementById("addNewMenu"));
    modal.hide(); // Đóng modal
  } catch (err) {
    console.error("Error creating menu:", err);
    alert("Failed to create menu.");
  }
};

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

  // Hàm reset quantity
  const handleResetQuantities = async () => {
    if (window.confirm("Bạn có chắc muốn đặt lại số lượng tất cả món ăn về 200?")) {
      try {
        await axios.post("http://localhost:3001/api/menus/reset-quantities");
        alert("Đã đặt lại số lượng tất cả món ăn về 200!");
        fetchMenus();
      } catch (err) {
        alert("Có lỗi xảy ra khi reset quantity!");
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId) => {
    try {
      // Sau khi xác nhận đơn hàng thành công:
      await axios.put(`http://localhost:3001/api/orders/${orderId}/status`, { status: "delivering" });
      // Gọi lại fetchMenus nếu bạn đang ở trang AdminMenus
      if (typeof fetchMenus === "function") fetchMenus();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Giả sử bạn có danh sách orders đã xác nhận (status "completed" hoặc "delivering")
  const updateMenuQuantitiesByOrders = (orders) => {
    // Lọc các đơn đã xác nhận
    const confirmedOrders = orders.filter(
      (order) => order.status === "completed" || order.status === "delivering"
    );

    // Tạo bản sao menus mới
    let updatedMenus = [...menus];

    confirmedOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Tìm menu tương ứng
        const menuIndex = updatedMenus.findIndex(
          (menu) => menu._id === item.menuItemId
        );
        if (menuIndex !== -1) {
          // Giảm quantity đi số lượng đã bán
          updatedMenus[menuIndex].quantity =
            (updatedMenus[menuIndex].quantity || 0) - item.quantity;
          if (updatedMenus[menuIndex].quantity < 0)
            updatedMenus[menuIndex].quantity = 0;
        }
      });
    });

    setMenus(updatedMenus);
  };

  return (
    <div className="container">
      {/* //Modal add new */}
      <div className="modal fade" id="addNewMenu">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Add new dish to menu
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
                    value={newMenu.name}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newMenu.description}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                  />
                  {newMenu.previewUrl && (
                    <img
                      src={newMenu.previewUrl}
                      alt="Preview"
                      style={{
                        width: "100px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                      }}
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label>Category</label>
                  <select
                    name="category"
                    value={newMenu.category}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newMenu.price}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newMenu.quantity}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  />
                </div>

                <div className=" d-flex justify-content-between  mt-5">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateMenu}
                    className="btn-select selected"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>

            {/* <!-- Modal footer --> */}
          </div>
        </div>
      </div>

      <h2 className="text-center mb-3">Manage Menus</h2>

      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, category or description..."
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1); //  reset về page 1 khi tìm kiếm
          }}
        />
      <select
        className="form-select"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setCurrentPage(1); // reset trang
        }}
        style={{ width: "200px" }}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

        <button
          onClick={() => {
            const modal = new Modal(document.getElementById("addNewMenu"));
            modal.show();
          }}
        >
          Add menu
        </button>
        {/* Nút Reset Quantity */}
        <button
         
          onClick={handleResetQuantities}
        >
          Reset Quantity
        </button>
      </div>

      <div>
        {/* Menu Table */}
        <div className="card">
  <div className="card-body" style={{ minHeight: "500px" }}>
    <div>
      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
        Menus List
      </span>
    </div>
    <div className="table-responsive">
      <table className="table table-striped table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "8%", cursor: "pointer" }} onClick={() => handleSort("name")}>
              Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th style={{ width: "25%" }}>Description</th>
            <th style={{ width: "4%", cursor: "pointer" }} onClick={() => handleSort("category")}>
              Category
            </th>
            <th style={{ width: "6%", cursor: "pointer" }} onClick={() => handleSort("price")}>
              Price {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th style={{ width: "6%" }}>Quantity</th>
            <th style={{ width: "11%", position: "sticky", right: 0, background: "#fff", zIndex: 1 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentMenus.map((menu) => (
            <tr key={menu._id}>
              <td>{menu.name}</td>
              <td>{menu.description}</td>
              <td>{menu.category}</td>
              <td>${menu.price ? Number(menu.price).toFixed(2) : "0.00"}</td>
              <td>{menu.quantity}</td>
              <td style={{ position: "sticky", right: 0, background: "#fff" }}>
                <button
                  className="btn-select selected me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editMenuModal"
                  onClick={() => handleEdit(menu)}
                >
                  Edit
                </button>
                <button
                  className="btn-select"
                  onClick={() => handleDelete(menu._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ✅ Pagination cố định dưới bảng */}
    <div className="d-flex justify-content-center align-items-center gap-3 mt-3" style={{ minHeight: "40px" }}>
      <button
        className=""
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        className=""
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>
</div>


        {/* Edit Menu Modal */}

        <div
          className="modal fade"
          id="editMenuModal"
          tabIndex="-1"
          aria-labelledby="editMenuModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ fontSize: "30px" }}
                  id="editMenuModalLabel"
                >
                  Edit Menu
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {editMenu && (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editMenu.name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={editMenu.description}
                        onChange={handleChange}
                        className="form-control"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="form-control"
                      />
                      {(editMenu.previewUrl || editMenu.imageUrl) && (
                        <img
                          src={
                            editMenu.previewUrl
                              ? editMenu.previewUrl
                              : `http://localhost:3001${editMenu.imageUrl}`
                          }
                          alt="Preview"
                          style={{
                            width: "100px",
                            marginTop: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}

                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        value={editMenu.category}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editMenu.price}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={editMenu.quantity}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-select"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-select selected"
                  onClick={handleSave}
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenus;
