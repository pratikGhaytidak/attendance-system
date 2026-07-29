import React, { useEffect, useState } from "react";
import "./PrincipalStudentViewer.css";

function PrincipalStudentViewer() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentId, setDepartmentId] = useState("");
  const [year, setYear] = useState("");

  const fetchStudents = () => {
    setLoading(true);
    let url = "http://localhost/attendance_system/api/principal/getStudents.php?";
    if (departmentId) url += `department_id=${departmentId}&`;
    if (year) url += `year=${year}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStudents(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Get filter display text
  const getFilterDescription = () => {
    const dept = departmentId ? (departmentId === "60" ? "IT" : "Mechanical") : "All Departments";
    const yr = year ? `${year}${getYearSuffix(year)} Year` : "All Years";
    return `${dept} • ${yr}`;
  };

  const getYearSuffix = (y) => {
    const suffixes = { 1: "st", 2: "nd", 3: "rd", 4: "th" };
    return suffixes[y] || "th";
  };

  return (
    <div className="principal-student-app">
      <div className="psv-page">
        {/* Header */}
        <div className="psv-header">
          <h1>Student Viewer</h1>
          <div className="header-underline"></div>
          <p>View students by department and year</p>
        </div>

        {/* Filters */}
        <div className="psv-filters">
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">All Departments</option>
            <option value="60">Information Technology</option>
            <option value="80">Mechanical</option>
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <button onClick={fetchStudents} className="filter-btn">Filter</button>
        </div>

        {/* Total Count Display */}
        {!loading && (
          <div className="psv-count-container">
            <div className="psv-count-badge">
              <span className="count-number">{students.length}</span>
              <span className="count-label">
                {students.length === 1 ? "Student" : "Students"}
              </span>
            </div>
            <div className="psv-filter-info">
              <span className="filter-icon">🔍</span> {getFilterDescription()}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="psv-loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="psv-table-wrapper">
            <table className="psv-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Batch</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id}>
                      <td data-label="ID">{s.id}</td>
                      <td data-label="Name">{s.name}</td>
                      <td data-label="Roll No">{s.roll_no}</td>
                      <td data-label="Department">{s.department_name}</td>
                      <td data-label="Year">{s.year}</td>
                      <td data-label="Batch">{s.batch}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-row">No students found</td>
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

export default PrincipalStudentViewer;