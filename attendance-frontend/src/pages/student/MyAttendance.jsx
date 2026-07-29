import React, { useEffect, useState } from "react";
import "./MyAttendance.css";

function StudentAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = () => {
    const studentId = localStorage.getItem("student_id");
    console.log("student_id is",studentId);
    if (!studentId) {
      setError("Student ID missing. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(` http://localhost/attendance_system/api/student/getStudentAttendance.php?student_id=${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid data");

        console.log("Raw attendance data:", data); // Debug: see what the API returns

        // Group by subject and compute stats
        const subjectMap = new Map();

        data.forEach((record) => {
          const subjectName = record.name;
          if (!subjectMap.has(subjectName)) {
            subjectMap.set(subjectName, {
              name: subjectName,
              records: [],
              presentCount: 0,
              total: 0,
            });
          }
          const subject = subjectMap.get(subjectName);
          
          // Normalize status: accept "Present", "present", "P", "1", true
          const statusRaw = record.status;
          let isPresent = false;
          if (typeof statusRaw === "string") {
            isPresent = statusRaw.toLowerCase() === "present" || statusRaw === "P";
          } else if (typeof statusRaw === "number") {
            isPresent = statusRaw === 1;
          } else if (typeof statusRaw === "boolean") {
            isPresent = statusRaw;
          }
          
          subject.records.push({ date: record.date, status: isPresent ? "Present" : "Absent" });
          subject.total++;
          if (isPresent) subject.presentCount++;
        });

        // Convert to array and calculate percentage
        const subjectsArray = Array.from(subjectMap.values()).map((sub) => ({
          ...sub,
          percentage: sub.total === 0 ? 0 : ((sub.presentCount / sub.total) * 100).toFixed(1),
        }));

        console.log("Processed subjects:", subjectsArray); // Debug: check percentages
        setSubjects(subjectsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load attendance.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Helper for progress bar color (unchanged)
  const getProgressColor = (percent) => {
    if (percent >= 75) return "#10b981";
    if (percent >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const totalSubjects = subjects.length;
  const overallAttendance = subjects.length
    ? (subjects.reduce((sum, sub) => sum + parseFloat(sub.percentage), 0) / subjects.length).toFixed(1)
    : 0;

  return (
    <div className="attendance-dashboard">
      <div className="dashboard-header">
        <h1>📖 My Attendance</h1>
        <p>Track your presence across all subjects</p>
      </div>

      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <span>Fetching your attendance...</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-card">
          <span>⚠️ {error}</span>
          <button onClick={fetchAttendance}>Retry</button>
        </div>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{totalSubjects}</div>
            <div className="stat-label">Subjects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallAttendance}%</div>
            <div className="stat-label">Overall Attendance</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="subjects-grid">
          {subjects.length === 0 ? (
            <div className="empty-message">
              🕊️ No attendance records found.
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.name} className="subject-card">
                <div className="card-header">
                  <h3>{subject.name}</h3>
                  <span className="percent-badge" style={{ background: getProgressColor(subject.percentage) }}>
                    {subject.percentage}%
                  </span>
                </div>

                <div className="progress-container">
                  <div
                    className="progress-fill"
                    style={{ width: `${subject.percentage}%`, backgroundColor: getProgressColor(subject.percentage) }}
                  ></div>
                </div>

                <div className="attendance-stats">
                  <span>✅ Present: {subject.presentCount}</span>
                  <span>❌ Absent: {subject.total - subject.presentCount}</span>
                  <span>📅 Total: {subject.total}</span>
                </div>

                <div className="date-chips">
                  {subject.records.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`chip ${rec.status === "Present" ? "present" : "absent"}`}
                    >
                      {rec.date}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default StudentAttendance;