import { useEffect, useState } from "react";

function RecentAttendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    if (!facultyId) {
      setError("Faculty not logged in");
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `https://gcekattendance.in/api/attendance/getAttendanceByFaculty.php?faculty_id=${facultyId}`
        );

        const json = await res.json();
        const records = json.data || [];

        console.log("Attendance API:", records);

        // ✅ Grouping logic (date + subject)
        const grouped = {};

        records.forEach((item) => {
          const key = `${item.date}_${item.subject_id}`;

          if (!grouped[key]) {
            grouped[key] = {
              date: item.date,
              subject: item.subject_name || item.subject_id,
              present: 0,
              absent: 0,
            };
          }

          if (item.status === "present") {
            grouped[key].present++;
          } else {
            grouped[key].absent++;
          }
        });

        // ✅ Convert + sort latest first
        const result = Object.values(grouped).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setData(result.slice(0, 5)); // latest 5
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch attendance");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return <p>Loading attendance...</p>;
  }

  // ✅ Error UI
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="table-container">
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
          {data.length > 0 ? (
            data.map((item, index) => (
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
    </div>
  );
}

export default RecentAttendance;