import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AddStudent.module.css';

function AddStudent() {
    const dept_nm = localStorage.getItem("class_department_name");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        roll_no: "",
        department_id: "",
        year: "",
        batch: "",
        password: "",
        email: "",
        student_image: null,
    });

    const yearMap = {
        "1": "First Year",
        "2": "Second Year",
        "3": "Third Year",
        "4": "Final Year"
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isClassTeacher = localStorage.getItem("isClassTeacher");
        const dept = localStorage.getItem("class_department");
        const yr = localStorage.getItem("class_year");

        if (isClassTeacher !== "true") {
            alert("Unauthorized Access");
            navigate("/dashboard");
        } else {
            setFormData((prev) => ({
                ...prev,
                department_id: dept,
                year: yr,
            }));
        }
    }, [navigate]);

    const handleChange = (e) => {
        if (e.target.name === "student_image") {
            setFormData({
                ...formData,
                student_image: e.target.files[0],
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const facultyId = localStorage.getItem("faculty_id");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("roll_no", formData.roll_no);
        data.append("department_id", formData.department_id);
        data.append("year", formData.year);
        data.append("batch", formData.batch);
        data.append("password", formData.password);
        data.append("email", formData.email);
        data.append("faculty_id", facultyId);

        if (formData.student_image) {
            data.append("student_image", formData.student_image);
        }

        fetch("https://gcekattendance.in/api/student/addStudent.php", {
            method: "POST",
            body: data,
        })
            .then((res) => res.text())
            .then((text) => {
                console.log("Server response:", text);

                const jsonStart = text.indexOf("{");
                const jsonEnd = text.lastIndexOf("}");

                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const cleanText = text.substring(jsonStart, jsonEnd + 1);

                    try {
                        const data = JSON.parse(cleanText);
                        alert(data.message);

                        if (data.status === "success") {
                            setFormData({
                                name: "",
                                roll_no: "",
                                department_id: localStorage.getItem("class_department") || "",
                                year: localStorage.getItem("class_year") || "",
                                batch: "",
                                password: "",
                                email: "",
                                student_image: null,
                            });

                            navigate("/dashboard");
                        }
                    } catch (err) {
                        console.error("JSON Parse Error:", err);
                        console.error("Raw server response:", text);
                        alert("Server returned invalid JSON. Check console.");
                    }
                } else {
                    console.error("No JSON found in response:", text);
                    alert("Server is returning HTML or PHP error. Check console.");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Something went wrong");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="addstudent-app"> 
        <div className={styles['form-container']}>
            <div className={styles['form-card']}>
                <h2>Add Student</h2>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter student name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Roll No</label>
                    <input
                        type="text"
                        name="roll_no"
                        placeholder="Enter roll number"
                        value={formData.roll_no}
                        onChange={handleChange}
                        required
                    />

                    <label>Department</label>
                    <input
                        type="text"
                        value={dept_nm}
                        disabled
                    />

                    <label>Year</label>
                    <input
                        type="text"
                        value={yearMap[formData.year] || formData.year}
                        disabled
                    />

                    <label>Batch</label>
                    <input
                        type="text"
                        name="batch"
                        placeholder="Enter batch (e.g. 2023-27)"
                        value={formData.batch}
                        onChange={handleChange}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        autoComplete="new-email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <label>Student Image</label>
                    <input
                        type="file"
                        name="student_image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Student"}
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default AddStudent;