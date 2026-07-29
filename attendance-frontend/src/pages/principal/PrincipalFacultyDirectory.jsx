import React, { useEffect, useState } from "react";
import "./PrincipalFacultyDirectory.css";

function PrincipalFacultyDirectory() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("active");

  const fetchFaculty = (type = "active") => {
    setLoading(true);
    fetch(`http://localhost/attendance-system/attendance-backend/api/principal/getFacultyByDepartment.php?status=${type}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFaculty(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaculty("active");
  }, []);

  return (
    <div className="principal-faculty-app">
      <div className="pfd-page">
        <div className="pfd-header">
          <h1>Faculty Directory</h1>
          <div className="header-underline"></div>
          <p>Department‑wise faculty overview</p>
        </div>

        <div className="pfd-toggle">
          <button
            className={`toggle-btn ${status === "active" ? "active" : ""}`}
            onClick={() => {
              setStatus("active");
              fetchFaculty("active");
            }}
          >
            Active Faculty
          </button>
          <button
            className={`toggle-btn ${status === "inactive" ? "active" : ""}`}
            onClick={() => {
              setStatus("inactive");
              fetchFaculty("inactive");
            }}
          >
            Past Faculty
          </button>
        </div>

        {loading ? (
          <div className="pfd-loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="pfd-table-wrapper">
            <table className="pfd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {faculty.length > 0 ? (
                  faculty.map((f) => (
                    <tr key={f.id}>
                      <td data-label="ID">{f.id}</td>
                      <td data-label="Name">{f.name}</td>
                      <td data-label="Email">{f.email}</td>
                      <td data-label="Department">{f.department_name}</td>
                      <td data-label="Status">
                        <span className={`status-badge ${f.status}`}>
                          {f.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No faculty members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrincipalFacultyDirectory;