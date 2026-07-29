import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
    const [reportType, setReportType] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState("");
    const [reportData, setReportData] = useState([]);
    const [reportDates, setReportDates] = useState([]);
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("role");
        const facultyId = localStorage.getItem("faculty_id");
        const departmentId = localStorage.getItem("department_id");

        let apiUrl = "";

        if (role === "hod") {
            apiUrl = `http://localhost/attendance-system/attendance-backend/api/hod/getSubjectByDepartment.php?department_id=${departmentId}`;
        } else {
            apiUrl = `http://localhost/attendance-system/attendance-backend/api/subject/getSubjects.php?faculty_id=${facultyId}`;
        }

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                setSubjects(data || []);
            })
            .catch(() => {
                setMessage("Failed to load subjects");
            });
    }, []);

    const generateReport = () => {
        if (!reportType) {
            setMessage("Please select report type");
            return;
        }

        if (reportType !== "subjectWise") {
            setMessage("This report is not developed yet");
            return;
        }

        if (!subjectId) {
            setMessage("Please select subject");
            return;
        }

        setLoading(true);
        setMessage("");
        setReportData([]);
        setReportDates([]);
        setSubjectInfo(null);

        fetch(
            `http://localhost/attendance-system/attendance-backend/api/reports/subjectWiseReport.php?subject_id=${subjectId}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setReportData(data.data || []);
                    setReportDates(data.dates || []);
                    setSubjectInfo(data.subject || null);

                    if ((data.data || []).length === 0) {
                        setMessage("No attendance records found for this subject");
                    }
                } else {
                    setMessage(data.message || "Failed to generate report");
                }
            })
            .catch(() => {
                setMessage("Server error while generating report");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="reports-container">
            <h1 className="reports-title">Reports</h1>

            <div className="reports-card">
                <div className="form-group">
                    <label>Select Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setReportData([]);
                            setReportDates([]);
                            setSubjectInfo(null);
                            setMessage("");
                        }}
                    >
                        <option value="">-- Select Report --</option>
                        <option value="subjectWise">Subject-wise Attendance Report</option>
                        <option value="dateWise">Date-wise Attendance Report</option>
                        <option value="studentWise">Student-wise Attendance Report</option>
                        <option value="monthly">Monthly Attendance Report</option>
                        <option value="defaulter">Defaulter Report</option>
                    </select>
                </div>

                {reportType === "subjectWise" && (
                    <div className="form-group">
                        <label>Select Subject</label>
                        <select
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                        >
                            <option value="">-- Select Subject --</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button className="generate-btn" onClick={generateReport}>
                    {loading ? "Generating..." : "Generate Report"}
                </button>

                {message && <p className="report-message">{message}</p>}
            </div>

            {reportData.length > 0 && (
                <div className="report-table-card">
                    <div className="report-header">
                        <div>
                            <h2>Subject-wise Attendance Report</h2>

                            {subjectInfo && (
                                <div className="report-info">
                                    <p><b>Subject:</b> {subjectInfo.subject_name}</p>
                                    <p><b>Course Code:</b> {subjectInfo.course_code}</p>
                                    <p><b>Semester:</b> {subjectInfo.semester}</p>
                                    <p><b>Semester Start Date:</b> {subjectInfo.semester_start_date}</p>
                                    <p><b>Report Date:</b> {new Date().toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        <button className="print-btn" onClick={handlePrint}>
                            Print
                        </button>
                    </div>

                    <table className="  ">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Roll No</th>
                                <th>Student Name</th>

                                {reportDates.map((date) => (
                                    <th key={date}>{date}</th>
                                ))}

                                <th>Total Lectures</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Percentage</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reportData.map((row, index) => (
                                <tr key={row.student_id}>
                                    <td>{index + 1}</td>
                                    <td>{row.roll_no}</td>
                                    <td>{row.student_name}</td>

                                    {reportDates.map((date) => (
                                        <td key={date}>
                                            {row.attendance[date] === "present" ? (
                                                <span className="present-mark">P</span>
                                            ) : row.attendance[date] === "absent" ? (
                                                <span className="absent-mark">A</span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    ))}

                                    <td>{row.total_lectures}</td>
                                    <td>{row.present_count}</td>
                                    <td>{row.absent_count}</td>
                                    <td>{row.percentage}%</td>
                                    <td>
                                        <span
                                            className={
                                                row.attendance_status === "Good"
                                                    ? "status-good"
                                                    : "status-defaulter"
                                            }
                                        >
                                            {row.attendance_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Reports;