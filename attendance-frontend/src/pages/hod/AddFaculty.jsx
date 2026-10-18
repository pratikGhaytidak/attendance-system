import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFaculty.css";

function AddFaculty() {
  const navigate = useNavigate();
  const dept_nm = localStorage.getItem("department_name");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department_id: localStorage.getItem("department_id") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://gcekattendance.in/api/hod/add_faculty.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          navigate("/hod-dashboard");
        } else {
          alert(data.error || "Error adding faculty");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="addfaculty-container">
      <div className="addfaculty-card">
        <div className="addfaculty-header">
          <h2>👨‍🏫 Add New Faculty</h2>
          <p>Add faculty member to {dept_nm || "your department"}</p>
        </div>

        <form onSubmit={handleSubmit} className="addfaculty-form" autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Enter faculty name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Department</label>
            <div className="input-wrapper disabled">
              <span className="input-icon">🏛️</span>
              <input type="text" value={dept_nm || "Loading..."} disabled />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                autoComplete="new-email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "➕ Add Faculty"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFaculty;