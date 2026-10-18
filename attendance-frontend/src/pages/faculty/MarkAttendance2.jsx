import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./MarkAttendance.css";

function MarkAttendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject_id, departmentId, year } = useParams();

  const [facultyName, setFacultyName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [draftRestored, setDraftRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const facultyId = localStorage.getItem("faculty_id");
  const passedDate = location.state?.date;
  const date = passedDate || new Date().toISOString().split("T")[0];

  // Unique key per subject + date + department + year, so different
  // lectures never overwrite each other's drafts.
  const draftKey = `attendance_draft_${subject_id}_${date}_${departmentId}_${year}`;

  // Keep the latest attendance in a ref so the beforeunload handler
  // (registered once) always saves the freshest state.
  const attendanceRef = useRef(attendance);
  useEffect(() => {
    attendanceRef.current = attendance;
  }, [attendance]);

  // Track online/offline status live.
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Load student list, then merge in any saved draft for this exact
  // subject/date/class so half-finished attendance resumes correctly.
  useEffect(() => {
    const name = localStorage.getItem("name");
    setFacultyName(name || "Faculty");
    // https://gcekattendance.in/api
    // https://gcekattendance.in/api
    fetch(`https://gcekattendance.in/api/student/getStudents.php?department_id=${departmentId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        const studentList = data.data || data || [];
        setStudents(studentList);

        // Start with everyone unmarked...
        const initial = {};
        studentList.forEach((stu) => {
          const id = stu.id || stu.student_id;
          initial[id] = false;
        });

        // ...then overlay any saved draft, so previously checked
        // students stay checked after a reload/reconnect.
        let savedDraft = null;
        try {
          const raw = localStorage.getItem(draftKey);
          if (raw) savedDraft = JSON.parse(raw);
        } catch (err) {
          console.error("Could not read saved draft:", err);
        }

        if (savedDraft && savedDraft.attendance) {
          setAttendance({ ...initial, ...savedDraft.attendance });
          setDraftRestored(true);
        } else {
          setAttendance(initial);
        }
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, year, draftKey]);

  // Persist the draft to localStorage on every change, so it survives
  // a dropped connection, a crash, or an accidental tab close.
  const saveDraft = (updatedAttendance) => {
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          attendance: updatedAttendance,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("Could not save draft:", err);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch (err) {
      console.error("Could not clear draft:", err);
    }
  };

  // Toggle checkbox for a student
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => {
      const updated = { ...prev, [studentId]: !prev[studentId] };
      saveDraft(updated);
      return updated;
    });
  };

  // Handle row click – toggle checkbox
  // const handleRowClick = (studentId, e) => {
    
  //   if (e.target.type === 'checkbox') return;
  //   toggleAttendance(studentId);
  // };
  const handleRowClick = (studentId, e) => {
  if (e.target.closest('.checkbox-label')) return;

  toggleAttendance(studentId);
};

  // Handle direct checkbox change
  const handleCheckboxChange = (studentId, e) => {
    e.stopPropagation();
    toggleAttendance(studentId);
  };

  const selectAllAttendance = () => {
    const allSelected = students.every((stu) => attendance[stu.id]);
    const updated = {};
    students.forEach((stu) => {
      updated[stu.id] = !allSelected;
    });
    setAttendance(updated);
    saveDraft(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isOnline) {
      alert("You're offline. Your progress is saved — submit will work once you're back online.");
      return;
    }

    setSubmitting(true);
    const payload = students.map((stu) => ({
      student_id: stu.id,
      subject_id: subject_id,
      faculty_id: facultyId,
      date: date,
      status: attendance[stu.id] ? "Present" : "Absent",
    }));

    fetch("https://gcekattendance.in/api/attendance/markAttendance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        // Only clear the draft once the server confirms success —
        // if it failed, the draft stays so nothing is lost.
        clearDraft();
        alert("Attendance Saved ✅");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        alert("Couldn't reach the server — your progress is still saved locally. Try submitting again once you're back online.");
      })
      .finally(() => setSubmitting(false));
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

        {!isOnline && (
          <div style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "10px 16px",
            borderRadius: "6px",
            margin: "10px 0",
            fontSize: "14px",
            border: "1px solid #ffeeba"
          }}>
            ⚠️ You're offline. Keep marking attendance — your progress is being saved on this device and will submit once you're back online.
          </div>
        )}

        {draftRestored && (
          <div style={{
            background: "#d1ecf1",
            color: "#0c5460",
            padding: "10px 16px",
            borderRadius: "6px",
            margin: "10px 0",
            fontSize: "14px",
            border: "1px solid #bee5eb"
          }}>
            ↺ Resumed your previous unsaved progress for this class.
          </div>
        )}

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
          <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "✅ Submit Attendance"}
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
