import { useEffect, useState } from "react";
import "./DisplayAllStudents.css"; // Make sure this is the scoped CSS file

function DisplayAllStudents() {
  const [students, setStudents] = useState([]);
  const [groupedStudents, setGroupedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const departmentID = localStorage.getItem("department_id");

    if (!departmentID) {
      setError("Department ID not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(
      //`https://gcekattendance.in/api/hod/get_students_by_department.php?department_id=${departmentID}`
      //`http://attenzo.site.jehttps://gcekattendance.in/api/hod/get_students_by_department.php?department_id=${departmentID}`
      `https://gcekattendance.in/api/hod/get_students_by_department.php?department_id=${departmentID}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setStudents(data.data);
          const grouped = {};
          data.data.forEach((student) => {
            if (!grouped[student.year]) {
              grouped[student.year] = [];
            }
            grouped[student.year].push(student);
          });
          setGroupedStudents(grouped);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong while fetching data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="displaystudents-app">
        <div className="students-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="displaystudents-app">
        <div className="students-container">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <h3>{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="displaystudents-app">
      <div className="students-container">
        <div className="students-card">
          <div className="students-header">
            <h2>📚 Department Students</h2>
            <p>Total students: {students.length}</p>
          </div>

          {Object.keys(groupedStudents).map((year) => (
            <div key={year} className="year-section">
              <div className="year-header">
                <span className="year-badge">Year {year}</span>
                <span className="student-count">
                  {groupedStudents[year].length} students
                </span>
              </div>

              <div className="table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Batch</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedStudents[year].map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.roll_no}</td>
                        <td>{student.batch}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DisplayAllStudents;