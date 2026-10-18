import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SubjectPage.css"; // Import the CSS file

function SubjectPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjectName = location.state?.name || "Unknown Subject";
  const departmentId = location.state?.department_id;
  const year = location.state?.year;

  useEffect(() => {
    if (!departmentId || !year) {
      setLoading(false);
      setError("Department or year information is missing. Please go back and select a subject again.");
      return;
    }

    fetch(`https://gcekattendance.in/api/student/getStudents.php?department_id=${departmentId}&year=${year}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load students. Please try again.");
        setLoading(false);
      });
  }, [departmentId, year]);

  return (
    <div className="subject-page">
      <div className="subject-header">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Back
        </button>

        <h1 className="subject-title">{subjectName}</h1>

        <button
          className="view-attendance-btn"
          onClick={() => navigate(`/show-subject-attendance/${id}`)}>
          View Attendance
        </button>
      </div>

      {departmentId && year && (
        <div className="subject-meta">
          Department ID: {departmentId} | Year: {year}
        </div>
      )}

      <h2 className="students-heading">Students Enrolled</h2>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="students-container">
          {students.length > 0 ? (
            students.map((stu) => (
              <div key={stu.id} className="student-card">
                <p><strong>{stu.name?.replace(/\s+/g, " ").trim() || "Unnamed"}</strong></p>
                <p>Roll No: {stu.roll_no || "—"}</p>
                <p>Batch: {stu.batch || "—"}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No students found for this subject.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SubjectPage;