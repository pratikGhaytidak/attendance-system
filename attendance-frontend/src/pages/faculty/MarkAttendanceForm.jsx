
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MarkAttendanceForm.css";

function MarkAttendanceForm() {
  const navigate = useNavigate();


  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: "",
    type: "lecture",
    date: new Date().toISOString().split("T")[0]
  });

  // 🔥 Get faculty data (later from login)
  const facultyId = localStorage.getItem("faculty_id");
  const facultyName = localStorage.getItem("name") || "Faculty";

  // ✅ Fetch subjects of faculty
  useEffect(() => {
    if (!facultyId) return;

    fetch(`https://gcekattendance.in/api/subject/getSubjects.php?faculty_id=${facultyId}`)
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
      })
      .catch(err => console.log(err));
  }, [facultyId]);

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject_id) {
      alert("Please select subject");
      return;
    }

    // 🔥 Find selected subject details
    const selectedSubject = subjects.find(
      (sub) => sub.id === formData.subject_id
    );

    // ✅ Navigate to attendance page with all data
    navigate(
      `/mark-attendance/${formData.subject_id}/${selectedSubject.department_id}/${selectedSubject.year}`,
      {
        state: {
          subject_name: selectedSubject.name,
          type: formData.type,
          date: formData.date,   // ✅ already passing
          faculty_name: facultyName
        }
      }
    );
  };
  const getDayName = (dateString) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateObj = new Date(dateString);
    return days[dateObj.getDay()];
  };

  return (
    <div className="attendance-form">
      <h1>Take Attendance</h1>

      <form onSubmit={handleSubmit}>
        {/* Faculty */}
        {/* <p><strong>Faculty:</strong> {facultyName}</p> */}
        <div className="form-header">
          <div className="header-row">
            <h2>{facultyName} 👨‍🏫</h2>

            <div className="date-section">
              <span className="day">
                {getDayName(formData.date)}
              </span>
            </div>


            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="date-picker"
            />
          </div>
        </div>

        {/* Subject Dropdown */}
        <label>Select Subject:</label>
        <select
          value={formData.subject_id}
          onChange={(e) =>
            setFormData({ ...formData, subject_id: e.target.value })
          }
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Type */}
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
        >
          <option value="lecture">Lecture</option>
          <option value="practical">Practical</option>
        </select>

        {/* Date */}
        <p><strong>Date:</strong> {formData.date}</p>

        {/* Submit */}
        <button type="submit">Start Attendance</button>
      </form>
    </div>
  );
}

export default MarkAttendanceForm;