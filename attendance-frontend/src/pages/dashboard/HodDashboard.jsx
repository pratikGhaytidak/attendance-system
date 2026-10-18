import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './HodDashboard.css';

function HodDashboard() {
    const navigate = useNavigate();

    const facultyId = localStorage.getItem("faculty_id");
    const departmentID = parseInt(localStorage.getItem("department_id"));

    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [hodInfo, setHodInfo] = useState({
        hod_name: "",
        department_name: ""
    });

    // 🔹 Fetch HOD Details
    const fetchHodDetails = async () => {
        if (!facultyId) return;

        try {
            const res = await fetch(
                `https://gcekattendance.in/api/hod/getHodDetails.php?faculty_id=${facultyId}`
            );
            const data = await res.json();

            setHodInfo({
                hod_name: data.hod_name,
                department_name: data.department_name
            });
        } catch (err) {
            console.log("HOD fetch error:", err);
        }
    };

    // 🔹 Fetch Faculty (Only Active from API)
    const fetchFaculty = async () => {
        if (!departmentID) {
            setError("Department ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `https://gcekattendance.in/api/hod/getFacultyByDepartment.php?department_id=${departmentID}`
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            console.log("Faculty API:", data);

            // ✅ Handle new API format
            if (data.status) {
                setFacultyList(data.data);
            } else {
                setFacultyList([]);
                throw new Error(data.message || "No data found");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load faculty.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (departmentID) {
            fetchFaculty();
        }
        fetchHodDetails();
    }, [departmentID]);

    // 🔹 Avatar initials
    const getInitials = (name) => {
        if (!name) return "?";
        return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="hoddashboard-app">
            <div className="hod-dashboard">

                {/* 🔹 Header */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title">HOD Dashboard</h1>
                    <div className="header-underline"></div>
                </div>

                {/* 🔹 Info Cards */}
                <div className="info-grid">

                    <div className="info-card">
                        <p className="info-label">HOD Name</p>
                        <p className="info-value">{hodInfo.hod_name || "—"}</p>
                    </div>

                    <div className="info-card">
                        <p className="info-label">Department</p>
                        <p className="info-value">{hodInfo.department_name || "—"}</p>
                    </div>

                    <div
                        className="info-card clickable"
                        onClick={() => navigate("/manage-faculty")}
                    >
                        <p className="info-label">Manage Faculties</p>
                        <p className="info-value">{facultyList.length}</p>
                    </div>

                    <div
                        className="info-card clickable"
                        onClick={() => navigate("/display-students")}
                    >
                        <p className="info-label">Manage Students</p>
                        <p className="info-value">View</p>
                    </div>

                </div>

                {/* 🔹 Faculty Section */}
                <h2 className="faculty-heading">Active Faculty in Your Department</h2>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button className="retry-button" onClick={fetchFaculty}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="faculty-grid">
                        {facultyList.length > 0 ? (
                            facultyList.map((faculty) => (
                                <div key={faculty.id} className="faculty-card">
                                    <div className="faculty-avatar">
                                        {getInitials(faculty.name)}
                                    </div>

                                    <div className="faculty-info">
                                        <h2 className="faculty-name">
                                            {faculty.name || "Unnamed"}
                                        </h2>
                                        <p className="faculty-id-small">
                                            ID: {faculty.id}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                No active faculty found in this department.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HodDashboard;