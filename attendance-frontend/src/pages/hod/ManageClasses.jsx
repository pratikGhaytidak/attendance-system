import React, { useEffect, useState } from "react";
import "./ManageClasses.css";

function ManageClasses() {
    const departmentId = localStorage.getItem("department_id");

    const [classes, setClasses] = useState([]);
    const [facultyList, setFacultyList] = useState([]);

    const [formData, setFormData] = useState({
        year: "",
        academic_year: "",
        class_teacher_id: "",
    });

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchClasses = async () => {
        if (!departmentId) {
            setMessage("Department ID not found");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(
                `http://localhost/attendance-system/attendance-backend/api/hod/getClassesByDepartment.php?department_id=${departmentId}`
            );

            const data = await res.json();

            if (data.status) {
                setClasses(data.data || []);
            } else {
                setClasses([]);
                setMessage(data.message || "Failed to fetch classes");
            }
        } catch (error) {
            console.error("Fetch classes error:", error);
            setClasses([]);
            setMessage("Server error while fetching classes");
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculty = async () => {
        if (!departmentId) {
            setMessage("Department ID not found");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost/attendance-system/attendance-backend/api/hod/getFacultyByDepartment.php?department_id=${departmentId}`
            );

            const data = await res.json();

            if (Array.isArray(data)) {
                setFacultyList(data);
            } else if (data.status) {
                setFacultyList(data.data || []);
            } else {
                setFacultyList([]);
                setMessage(data.message || "Failed to fetch faculty");
            }
        } catch (error) {
            console.error("Fetch faculty error:", error);
            setFacultyList([]);
            setMessage("Server error while fetching faculty");
        }
    };

    useEffect(() => {
        if (departmentId) {
            fetchClasses();
            fetchFaculty();
        }
    }, [departmentId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            year: "",
            academic_year: "",
            class_teacher_id: "",
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.year || !formData.academic_year) {
            setMessage("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                id: editId,
                department_id: departmentId,
                year: formData.year,
                academic_year: formData.academic_year,
                class_teacher_id: formData.class_teacher_id || null,
            };

            const url = editId
                ? "http://localhost/attendance-system/attendance-backend/api/hod/updateClass.php"
                : "http://localhost/attendance-system/attendance-backend/api/hod/addClass.php";

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.status) {
                setMessage(
                    data.message ||
                        (editId
                            ? "Class updated successfully"
                            : "Class added successfully")
                );
                resetForm();
                fetchClasses();
            } else {
                setMessage(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Submit error:", error);
            setMessage("Server error while saving class");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormData({
            year: item.year,
            academic_year: item.academic_year,
            class_teacher_id: item.class_teacher_id || "",
        });
    };

    const handleDelete = async (id) => {
        // call delete api
    };

    const handleCancel = () => {
        resetForm();
        setMessage("");
    };

    return (
        <div className="manage-classes-container">
            <h2>Manage Classes</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} className="manage-classes-form">
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
                    <label>Academic Year</label>
                    <input
                        type="text"
                        name="academic_year"
                        value={formData.academic_year}
                        onChange={handleChange}
                        placeholder="2026-27"
                    />
                </div>

                <div>
                    <label>Class Teacher</label>
                    <select
                        name="class_teacher_id"
                        value={formData.class_teacher_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Class Teacher</option>
                        {facultyList.map((faculty) => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">
                    {editId ? "Update Class" : "Add Class"}
                </button>

                {editId && (
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h3>All Classes</h3>

            {loading ? (
                <p>Loading...</p>
            ) : classes.length === 0 ? (
                <p>No classes found</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Year</th>
                            <th>Academic Year</th>
                            <th>Class Teacher</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.year}</td>
                                <td>{item.academic_year}</td>
                                <td>{item.class_teacher_name || "Not Assigned"}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageClasses;