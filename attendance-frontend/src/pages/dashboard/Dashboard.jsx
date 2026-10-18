import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import RecentAttendance from "../../components/RecentAttendance";

function FacultyDashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const facultyId = localStorage.getItem("faculty_id");
  const [recentAttendance, setRecentAttendance] = useState([]);


  useEffect(() => {
    fetch(`https://gcekattendance.in/api/subject/getSubjects.php?faculty_id=${facultyId}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    if (!facultyId) return; // ✅ safety check

    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `https://gcekattendance.in/api/attendance/getAttendanceByFaculty.php?faculty_id=${facultyId}`
        );

        const data = await res.json();
        const records = data.data || [];

        // console.log("Attendance API:", records);

        // ✅ Grouping logic
        const grouped = {};

        records.forEach((item) => {
          const key = `${item.date}_${item.subject_id}`;

          if (!grouped[key]) {
            grouped[key] = {
              date: item.date,
              subject: item.subject_name || item.subject_id, // ✅ supports future JOIN
              present: 0,
              absent: 0,
            };
          }

          if (item.status === "Present") {
            grouped[key].present++;
          } else {
            grouped[key].absent++;
          }
        });

        // ✅ Convert to array + sort latest first
        const result = Object.values(grouped).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setRecentAttendance(result.slice(0, 5)); // ✅ latest 5 only
      } catch (err) {
        console.log(err);
      }
    };

    fetchAttendance();
  }, []);

  // useEffect(() => {
  //   const facultyId = localStorage.getItem("faculty_id");

  //   if (!facultyId) return;

  //   fetch(`https://gcekattendance.in/api/faculty/getClassTeacher.php?faculty_id=${facultyId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.isClassTeacher) {
  //         localStorage.setItem("isClassTeacher", "true");
  //         localStorage.setItem("class_department", data.department_id);
  //         localStorage.setItem("class_year", data.year);
  //         localStorage.setItem("class_department_name", data.department_name);
  //       } else {
  //         localStorage.setItem("isClassTeacher", "false");
  //         localStorage.removeItem("class_department");
  //         localStorage.removeItem("class_year");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    if (!facultyId) return;

    fetch(`https://gcekattendance.in/api/faculty/getClassTeacher.php?faculty_id=${facultyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isClassTeacher) {
          localStorage.setItem("isClassTeacher", "true");
          localStorage.setItem("class_department", data.department_id);
          localStorage.setItem("class_year", data.year);
          localStorage.setItem("class_batch", data.batch);
          localStorage.setItem("class_department_name", data.department_name);
          localStorage.setItem("class_academic_year", data.academic_year);
        } else {
          localStorage.setItem("isClassTeacher", "false");
          localStorage.removeItem("class_department");
          localStorage.removeItem("class_year");
          localStorage.removeItem("class_batch");
          localStorage.removeItem("class_department_name");
          localStorage.removeItem("class_academic_year");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard">

      {/* Title */}
      <h1 className="dashboard-title">Faculty Dashboard</h1>

      {/* 🔥 Cards */}
      <div className="card-container">
        <div className="card">
          <h3>Total Classes</h3>
          <p>5</p>
        </div>

        <div className="card">
          <h3>Today's Lectures</h3>
          <p>3</p>
        </div>

        <div className="card">
          <h3>Present Today</h3>
          <p>69</p>
        </div>

        <div className="card">
          <h3>Absent Today</h3>
          <p>11</p>
        </div>
      </div>

      {/* 🔥 Take Attendance Button{/* */}
      <div className="cotrol-buttons">
        <div className="action-section">
          <button
            className="action-btn"
            onClick={() => navigate("/mark-attendance-form")}
          >
            Take Attendance
          </button>
        </div>

        <div className="action-section">
          <button
            className="view-attendance-btn"
            onClick={() => navigate("/view-attendance")}
          >
            View Attendance
          </button>
        </div>
      </div>

      {/* <div className="subjects-section">
        <h2>Your Subjects</h2>
        <div className="subjects-container">
          {subjects.length > 0 ? (
            subjects.map((sub) => (
              <div key={sub.id} className="subject-card">
                <h3>{sub.name}</h3>
              </div>
            ))
          ) : (
            <p>No subjects found</p>
          )}
        </div>
      </div> */}
      <div className="subjects-section">
        <h2>Your Subjects</h2>

        <div className="subjects-container">
          {subjects.length > 0 ? (
            subjects.map((sub) => (
              <div
                key={sub.id}
                className="subject-card clickable"
                onClick={() => navigate(`/subject/${sub.id}`, {
                  state: {
                    department_id: sub.department_id,
                    year: sub.year,
                    name: sub.name
                  }
                })}

              >
                <h3>{sub.name}</h3>
              </div>
            ))
          ) : (
            <p>No subjects found</p>
          )}
        </div>
      </div>

      {/* 🔥 Today's Schedule */}
      <div className="schedule">
        <h2>Today's Schedule</h2>
        <ul>
          <li>10:00 AM - DBMS</li>
          <li>12:00 PM - Operating System</li>
          <li>2:00 PM - Computer Networks</li>
        </ul>
      </div>

      {/* 🔥 Recent Attendance */}
      <RecentAttendance />
      {/* <div className="table-container">
        <h2>Recent Attendance</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>

          <tbody>
            {recentAttendance.length > 0 ? (
              recentAttendance.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.subject}</td>

                  <td className="present">{item.present}</td>
                  <td className="absent">{item.absent}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No attendance data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

    </div >
  );
}

export default FacultyDashboard;