import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./UpdateStudent.css";

function UpdateStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    roll_no: "",
    password: "",
    year: "",
    batch: "",
    department_id: "",
  });

  useEffect(() => {
    if (location.state?.student) {
      const student = location.state.student;
      setFormData({
        id: student.id || "",
        name: student.name || "",
        email: student.email || "",
        roll_no: student.roll_no || "",
        password: "",
        year: student.year || "",
        batch: student.batch || "",
        department_id: student.department_id || "",
      });
    } else if (id) {
      fetchStudentById(id);
    }

    fetchDepartments();
  }, [id, location.state]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("https://gcekattendance.in/api/department/getDepartments.php");
      const data = await res.json();
      setDepartments(data.data || data || []);
    } catch (error) {
      console.error("Department fetch error:", error);
    }
  };

  const fetchStudentById = async (studentId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://gcekattendance.in/api/student/getStudentById.php?id=${studentId}`
      );
      const data = await res.json();

      if (data.status) {
        const student = data.data;
        setFormData({
          id: student.id || "",
          name: student.name || "",
          email: student.email || "",
          roll_no: student.roll_no || "",
          password: "",
          year: student.year || "",
          batch: student.batch || "",
          department_id: student.department_id || "",
        });
      } else {
        setMessage(data.message || "Failed to fetch student data");
      }
    } catch (error) {
      console.error("Student fetch error:", error);
      setMessage("Server error while fetching student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.name ||
      !formData.email ||
      !formData.roll_no ||
      !formData.year ||
      !formData.batch ||
      !formData.department_id
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "https://gcekattendance.in/api/faculty/updateStudent.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.status) {
        setMessage("Student updated successfully");
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Server error while updating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-student-container">
      <h2>Update Student</h2>

      {message && <p className="student-message">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="update-student-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Roll No</label>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep old password"
            />
          </div>

          <div>
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange}>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label>Batch</label>
            <select name="batch" value={formData.batch} onChange={handleChange}>
              <option value="">Select Batch</option>
              <option value="1">Batch 1</option>
              <option value="2">Batch 2</option>
              <option value="3">Batch 3</option>
              <option value="4">Batch 4</option>
            </select>
          </div>

          <div>
            <label>Department</label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Update Student</button>
        </form>
      )}
    </div>
  );
}

export default UpdateStudent;