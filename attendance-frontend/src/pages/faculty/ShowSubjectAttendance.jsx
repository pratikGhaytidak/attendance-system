import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ShowSubjectAttendance.css";

function ShowSubjectAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `https://gcekattendance.in/api/attendance/getAttendanceBySubject.php?subject_id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setAttendance(data.data || []);

          if (data.data.length > 0) {
            setSubjectName(data.data[0].subject_name);
          }
        } else {
          setError("Failed to fetch attendance");
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Server Error");
        setLoading(false);
      });
  }, [id]);

  /* Group Data Student Wise */
  const grouped = {};

  attendance.forEach((item) => {
    if (!grouped[item.student_id]) {
      grouped[item.student_id] = {
        name: item.student_name,
        roll_no: item.roll_no,
        present: 0,
        absent: 0,
        total: 0,
      };
    }

    grouped[item.student_id].total++;

    if (item.status.toLowerCase() === "present") {
      grouped[item.student_id].present++;
    } else {
      grouped[item.student_id].absent++;
    }
  });

  const finalData = Object.values(grouped);

  return (
    <div className="subject-attendance-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{subjectName} Attendance</h1>

      {loading ? (
        <div className="loading-box">Loading...</div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : (
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {finalData.map((stu, index) => {
                const percent = (
                  (stu.present / stu.total) *
                  100
                ).toFixed(1);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stu.name}</td>
                    <td>{stu.roll_no}</td>
                    <td>{stu.total}</td>
                    <td className="present">{stu.present}</td>
                    <td className="absent">{stu.absent}</td>
                    <td>{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowSubjectAttendance;