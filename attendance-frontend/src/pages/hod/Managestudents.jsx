import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ManageStudents.css"; // Make sure this is the scoped CSS file

function ManageStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentId = localStorage.getItem("class_department");
  const year = localStorage.getItem("class_year");

  useEffect(() => {
    if (!departmentId || !year) {
      setLoading(false);
      setError("No class assigned to this faculty");
      return;
    }

    fetch(`http://localhost/attendance_system/api/student/getStudents.php?department_id=${departmentId}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load students");
        setLoading(false);
      });
  }, [departmentId, year]);

  return (
    <div className="managestudent-app">
      <div className="ms-container">

        {/* Header */}
        <div className="ms-header-wrapper">
          <div className="ms-header">
            <button onClick={() => navigate(-1)} className="ms-back-btn">
              ← Back
            </button>
            <h1 className="ms-title">Manage Students</h1>
          </div>
        </div>

        {/* Meta */}
        <p className="ms-meta">
          Dept: {departmentId || "—"} | Year: {year || "—"}
        </p>

        {/* Content */}
        {loading ? (
          <div className="ms-status">Loading...</div>
        ) : error ? (
          <div className="ms-status ms-error">{error}</div>
        ) : (
          <div className="ms-grid">
            {students.length > 0 ? (
              students.map((stu) => (
                <div
                  key={stu.id}
                  className="ms-card"
                  onClick={() =>
                    navigate(`/update-student/${stu.id}`, { state: stu })
                  }
                >
                  <h3 className="ms-name">
                    {stu.name?.replace(/\s+/g, " ").trim() || "Unnamed"}
                  </h3>

                  <div className="ms-info">
                    <p><span>Roll No:</span> {stu.roll_no || "—"}</p>
                    <p><span>Batch:</span> {stu.batch || "—"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="ms-status">No students found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;