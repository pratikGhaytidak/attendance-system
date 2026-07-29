import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AssignSubject.css";

function AssignSubject() {
  const navigate = useNavigate();

  const dept_nm = localStorage.getItem("department_name");
  const department_id = parseInt(localStorage.getItem("department_id"));

  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    faculty_id: "",
    subject_id: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Faculty & Subjects
  useEffect(() => {
    if (!department_id) return;

    // Faculty fetch
    fetch(
      `http://localhost/attendance-system/attendance-backend/api/hod/getFacultyByDepartment.php?department_id=${department_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Faculty API:", data);

        if (Array.isArray(data)) {
          setFaculties(data); // fallback if API returns array
        } else if (data.status) {
          setFaculties(data.data);
        } else {
          setFaculties([]);
        }
      })
      .catch((err) => {
        console.error("Faculty fetch error:", err);
        setFaculties([]);
      });

    // Subject fetch
    fetch(
      `http://localhost/attendance-system/attendance-backend/api/hod/getSubjectByDepartment.php?department_id=${department_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Subject API:", data);

        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (data.status) {
          setSubjects(data.data);
        } else {
          setSubjects([]);
        }
      })
      .catch((err) => {
        console.error("Subject fetch error:", err);
        setSubjects([]);
      });

  }, [department_id]);

  // 🔹 Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost/attendance-system/attendance-backend/api/hod/assign_subject.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          navigate("/faculty-subject");
        } else {
          alert(data.error || "Error assigning subject");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="assign-container">
      <div className="assign-card">
        <div className="assign-header">
          <h2>📌 Assign Subject to Faculty</h2>
          <p>
            Map subjects with faculty members of{" "}
            {dept_nm || "your department"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="assign-form">
          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <div className="disabled-field">
              <span className="field-icon">🏛️</span>
              <input type="text" value={dept_nm || "Loading..."} disabled />
            </div>
          </div>

          {/* Faculty Dropdown */}
          <div className="form-group">
            <label>Select Faculty</label>
            <div className="select-wrapper">
              <span className="select-icon">👨‍🏫</span>
              <select
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Faculty --</option>
                {Array.isArray(faculties) &&
                  faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="form-group">
            <label>Select Subject</label>
            <div className="select-wrapper">
              <span className="select-icon">📚</span>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Subject --</option>
                {Array.isArray(subjects) &&
                  subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Assigning..." : "➕ Assign Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignSubject;