import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import * as bootstrap from "bootstrap";
import imageCompression from "browser-image-compression";

function AdminChefs() {
  const [chefs, setChefs] = useState([]);
  const [newChef, setNewChef] = useState({
    name: "",
    specialty: "",
    experience: "",
    contact: "",
    awards: "",
    description: "",
    imageBuffer: null,
    fileName: "",
    previewUrl: "",
  });
  const [editChef, setEditChef] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/chefs");
      setChefs(response.data);
    } catch (err) {
      console.error("Error fetching chefs:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const chefData = {
        ...newChef,
        imageUrl: newChef.imageBuffer, // Dùng ảnh base64
      };
      await axios.post("http://localhost:3001/api/chefs", chefData);
      alert("Chef created successfully");
      setNewChef({
        name: "",
        specialty: "",
        experience: "",
        contact: "",
        awards: "",
        description: "",
        imageBuffer: null,
        fileName: "",
        previewUrl: "",
      });
      fetchChefs();
      bootstrap.Modal.getInstance(
        document.getElementById("addChefModal")
      ).hide();
    } catch (err) {
      console.error("Error creating chef:", err);
    }
  };

  const handleSave = async () => {
    try {
      const chefData = {
        ...editChef,
        imageUrl: editChef.imageBuffer
          ? editChef.imageBuffer
          : editChef.imageUrl,
      };
      await axios.put(
        `http://localhost:3001/api/chefs/${editChef._id}`,
        chefData
      );
      alert("Chef updated successfully");
      setEditChef(null);
      fetchChefs();
      bootstrap.Modal.getInstance(
        document.getElementById("editChefModal")
      ).hide();
    } catch (err) {
      console.error("Error updating chef:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this chef?")) {
      try {
        await axios.delete(`http://localhost:3001/api/chefs/${id}`);
        alert("Chef deleted successfully");
        fetchChefs();
      } catch (err) {
        console.error("Error deleting chef:", err);
      }
    }
  };

  const filteredChefs = chefs.filter(
    (chef) =>
      chef.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chef.specialty.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="text-center mb-3">Manage Chefs</h2>
      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name or specialty..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          onClick={() => {
            setNewChef({
              name: "",
              specialty: "",
              experience: "",
              contact: "",
              awards: "",
              description: "",
              imageBuffer: null,
              fileName: "",
              previewUrl: "",
            });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            new Modal(document.getElementById("addChefModal")).show();
          }}
        >
          Add Chef
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Chefs list
            </span>
          </div>
          {/* Danh sách chef */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="text-center">Name</th>
                <th className="text-center">Specialty</th>
                <th className="text-center">Experience</th>
                <th className="text-center">Contact</th>
                <th className="text-center">Awards</th>
                <th className="text-center">Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChefs.map((chef) => (
                <tr key={chef._id}>
                  <td className="text-center">{chef.name}</td>
                  <td className="text-center">{chef.specialty}</td>
                  <td className="text-center">{chef.experience} years</td>
                  <td>+{chef.contact}</td>
                  <td>
                    {chef.awards
                      ?.split("\n") // Nếu bạn lưu bằng dấu xuống dòng, hoặc dùng .split(',') nếu phân cách bằng dấu phẩy
                      .map((award, idx) => (
                        <div key={idx}>{award}</div>
                      ))}
                  </td>
                  <td>{chef.description}</td>
                  <td className="text-center">
                    <button
                      className="btn-select selected"
                      onClick={() => {
                        setEditChef(chef);
                        new Modal(
                          document.getElementById("editChefModal")
                        ).show();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-select"
                      onClick={() => handleDelete(chef._id)}
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

      {/* Modal Thêm Chef */}
      <div className="modal fade" id="addChefModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Chef</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {[
                "name",
                "specialty",
                "experience",
                "contact",
                "awards",
                "description",
              ].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>

                  {["description", "awards"].includes(field) ? (
                    <textarea
                      className="form-control"
                      value={newChef[field]}
                      onChange={(e) =>
                        setNewChef({ ...newChef, [field]: e.target.value })
                      }
                    />
                  ) : field === "contact" ? (
                    <div className="input-group">
                      <span className="input-group-text">+</span>
                      <input
                        className="form-control"
                        type="number"
                        value={newChef[field]}
                        onChange={(e) =>
                          setNewChef({
                            ...newChef,
                            [field]: e.target.value.replace(/^\+/, ""),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <input
                      className="form-control"
                      type={field === "experience" ? "number" : "text"}
                      value={newChef[field]}
                      onChange={(e) =>
                        setNewChef({ ...newChef, [field]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              {/* Upload Image */}
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewChef((prev) => ({
                          ...prev,
                          imageBuffer: reader.result,
                          fileName: file.name,
                          previewUrl: URL.createObjectURL(file),
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {newChef.previewUrl && (
                  <img
                    src={newChef.previewUrl}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button data-bs-dismiss="modal">Cancel</button>
              <button onClick={handleCreate}>Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa Chef */}
      <div className="modal fade" id="editChefModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            {editChef && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Chef</h5>
                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  {[
                    "name",
                    "specialty",
                    "experience",
                    "contact",
                    "awards",
                    "description",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>

                      {["description", "awards"].includes(field) ? (
                        <textarea
                          className="form-control"
                          value={editChef[field]}
                          onChange={(e) =>
                            setEditChef({
                              ...editChef,
                              [field]: e.target.value,
                            })
                          }
                        />
                      ) : field === "contact" ? (
                        <div className="input-group">
                          <span className="input-group-text">+</span>
                          <input
                            className="form-control"
                            type="number"
                            value={editChef[field]}
                            onChange={(e) =>
                              setEditChef({
                                ...editChef,
                                [field]: e.target.value.replace(/^\+/, ""),
                              })
                            }
                          />
                        </div>
                      ) : (
                        <input
                          className="form-control"
                          type={field === "experience" ? "number" : "text"}
                          value={editChef[field]}
                          onChange={(e) =>
                            setEditChef({
                              ...editChef,
                              [field]: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}
                  {/* Upload New Image */}
                  <div className="mb-3">
                    <label className="form-label">
                      Change Image (Optional)
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditChef((prev) => ({
                              ...prev,
                              imageBuffer: reader.result,
                              previewUrl: URL.createObjectURL(file),
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {(editChef.previewUrl || editChef.imageUrl) && (
                      <img
                        src={editChef.previewUrl || editChef.imageUrl}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button data-bs-dismiss="modal">Cancel</button>
                  <button onClick={handleSave}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChefs;
