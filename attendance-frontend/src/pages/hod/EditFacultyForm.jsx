import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditFacultyForm.css";

function EditFacultyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("Id is accessing",id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department_id: "",
    status: "active"
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🔹 Fetch faculty data (prefill)
  useEffect(() => {
    if (!id) return;

    fetch(`https://gcekattendance.in/api/hod/getFacultyById.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Edit API Response:", data);

        if (data.status) {
          setFormData({
            name: data.data.name || "",
            email: data.data.email || "",
            password: "", // keep empty always
            role: data.data.role || "faculty",
            department_id: data.data.department_id || "",
            status: data.data.status || "active"
          });
        } else {
          alert(data.message || "Faculty not found");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching faculty data");
      })
      .finally(() => setFetching(false));
  }, [id]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Submit updated data
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://gcekattendance.in/api/hod/updateFaculty.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        ...formData
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.status) {
          navigate("/manage-faculty");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      })
      .finally(() => setLoading(false));
  };

  // 🔹 Loading state
  if (fetching) {
    return (
      <div className="edit-container">
        <h2>Loading faculty data...</h2>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>✏️ Edit Faculty</h2>

        <form onSubmit={handleSubmit}>
          
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password (leave blank to keep same)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="faculty">Faculty</option>
              <option value="hod">HOD</option>
            </select>
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department ID</label>
            <input
              type="number"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditFacultyForm;