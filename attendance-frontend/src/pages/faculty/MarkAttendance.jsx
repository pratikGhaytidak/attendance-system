import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./MarkAttendance.css";

function MarkAttendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject_id, departmentId, year } = useParams();

  const [facultyName, setFacultyName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const facultyId = localStorage.getItem("faculty_id");
  const passedDate = location.state?.date;
  const date = passedDate || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const name = localStorage.getItem("name");
    setFacultyName(name || "Faculty");

    fetch(`http://localhost/attendance-system/attendance-backend/api/student/getStudents.php?department_id=${departmentId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        const studentList = data.data || data || [];
        setStudents(studentList);
        const initial = {};
        studentList.forEach((stu) => {
          const id = stu.id || stu.student_id;
          initial[id] = false;
        });
        setAttendance(initial);
      })
      .catch((err) => console.error(err));
  }, [departmentId, year]);

  // Toggle checkbox for a student
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // Handle row click – toggle checkbox
  const handleRowClick = (studentId, e) => {
    // Prevent toggling if clicking inside the checkbox cell (to avoid double toggle)
    if (e.target.type === 'checkbox') return;
    toggleAttendance(studentId);
  };

  // Handle direct checkbox change
  const handleCheckboxChange = (studentId, e) => {
    e.stopPropagation(); // Stop event from bubbling to row
    toggleAttendance(studentId);
  };

  const selectAllAttendance = () => {
    const allSelected = students.every((stu) => attendance[stu.id]);

    const updated = {};

    students.forEach((stu) => {
      updated[stu.id] = !allSelected;
    });

    setAttendance(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = students.map((stu) => ({
      student_id: stu.id,
      subject_id: subject_id,
      faculty_id: facultyId,
      date: date,
      status: attendance[stu.id] ? "Present" : "Absent",
    }));

    fetch("http://localhost/attendance-system/attendance-backend/api/attendance/markAttendance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Attendance Saved ✅");
        navigate("/dashboard");
      })
      .catch((err) => console.error(err));
  };


  const presentCount = students.filter((stu) => attendance[stu.id]).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <div className="attendance-header">
          <h1>📋 Mark Attendance</h1>
          <div className="faculty-info">
            <span className="faculty-name">👨‍🏫 {facultyName}</span>
            <span className="attendance-date">📅 {date}</span>
          </div>
        </div>


        <div className="table-wrapper">
          <div className="select-all-wrapper">
            <button
              type="button"
              className="select-all-btn"
              onClick={selectAllAttendance}
            >
              ✅ Select All
            </button>
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Batch</th>
                <th>Present</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((stu) => (
                  <tr
                    key={stu.id}
                    onClick={(e) => handleRowClick(stu.id, e)}
                    className={attendance[stu.id] ? "present-row" : ""}
                  >
                    <td>{stu.roll_no}</td>
                    <td>{stu.name?.replace(/\s+/g, " ").trim()}</td>
                    <td>{stu.batch}</td>
                    <td className="checkbox-cell">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={attendance[stu.id] || false}
                          onChange={(e) => handleCheckboxChange(stu.id, e)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="attendance-summary">
        <div className="summary present-summary">
          ✅ Present: {presentCount}
        </div>

        <div className="summary absent-summary">
          ❌ Absent: {absentCount}
        </div>

        <div className="summary total-summary">
          👥 Total: {students.length}
        </div>
      </div>
        </div>

      

      <div className="form-actions">
        <button className="submit-btn" onClick={handleSubmit}>
          ✅ Submit Attendance
        </button>
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          ↩ Cancel
        </button>
      </div>
    </div>
    </div >
  );
}

export default MarkAttendance;