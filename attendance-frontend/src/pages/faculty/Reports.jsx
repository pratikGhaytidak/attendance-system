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
            apiUrl = `https://gcekattendance.in/api/hod/getSubjectByDepartment.php?department_id=${departmentId}`;
        } else {
            apiUrl = `https://gcekattendance.in/api/subject/getSubjects.php?faculty_id=${facultyId}`;
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
            `https://gcekattendance.in/api/reports/subjectWiseReport.php?subject_id=${subjectId}`
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

    const handleExportExcel = async () => {
        try {
            if (!reportData.length) {
                setMessage("Generate a report before exporting");
                return;
            }

            if (reportDates.length > 40) {
                setMessage("The template supports a maximum of 40 lecture dates");
                return;
            }

            setMessage("");

            const response = await fetch(
                "/templates/lecture_attendance-template.xlsx"
            );

            if (!response.ok) {
                throw new Error("Failed to load Excel template");
            }

            const ExcelJS = (await import("exceljs")).default;
            const workbook = new ExcelJS.Workbook();

            await workbook.xlsx.load(await response.arrayBuffer());

            // Use the first sheet as the template.
            const worksheet = workbook.worksheets[0];

            if (!worksheet) {
                throw new Error("No worksheet found in the template");
            }

            // Keep only one worksheet.
            workbook.worksheets
                .filter((sheet) => sheet.id !== worksheet.id)
                .forEach((sheet) => workbook.removeWorksheet(sheet.id));

            worksheet.name = "Attendance";

            // Update subject heading.
            if (subjectInfo?.subject_name) {
                worksheet.getCell("B5").value =
                    subjectInfo.subject_name;
            }

            // Clear old student values and lecture entries.
            // Keep the existing formatting and summary formulas.
            for (let row = 13; row <= 35; row++) {
                worksheet.getCell(`A${row}`).value = null;
                worksheet.getCell(`B${row}`).value = null;
                worksheet.getCell(`C${row}`).value = null;

                for (let col = 5; col <= 44; col++) {
                    worksheet.getRow(row).getCell(col).value = null;
                }
            }

            // Clear old lecture dates and numbers.
            for (let col = 5; col <= 44; col++) {
                worksheet.getRow(11).getCell(col).value = null;
                worksheet.getRow(12).getCell(col).value = null;
            }

            // Insert lecture dates and lecture numbers.
            reportDates.forEach((date, index) => {
                const col = index + 5;

                const parsedDate = new Date(`${date}T00:00:00`);

                worksheet.getRow(11).getCell(col).value =
                    Number.isNaN(parsedDate.getTime()) ? date : parsedDate;

                worksheet.getRow(12).getCell(col).value = index + 1;
            });

            // Insert student details and attendance.
            reportData.slice(0, 90).forEach((student, index) => {
                const rowNumber = index + 13;

                worksheet.getCell(`A${rowNumber}`).value = index + 1;
                worksheet.getCell(`B${rowNumber}`).value =
                    student.roll_no ?? "";
                worksheet.getCell(`C${rowNumber}`).value =
                    student.student_name ?? "";

                reportDates.forEach((date, dateIndex) => {
                    const col = dateIndex + 5;
                    const attendance = student.attendance?.[date];

                    worksheet.getRow(rowNumber).getCell(col).value =
                        attendance === "present"
                            ? "P"
                            : attendance === "absent"
                                ? "A"
                                : "";
                });
            });

            // Ask Excel to recalculate the template's summary formulas.
            workbook.calcProperties.fullCalcOnLoad = true;
            workbook.calcProperties.forceFullCalc = true;

            const buffer = await workbook.xlsx.writeBuffer();

            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "Attendance_Report.xlsx";
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Excel export error:", error);
            setMessage("Failed to export Excel. Check the template and try again.");
        }
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
                                    <p><b>Course Start Date:</b> {subjectInfo.courseStartDate}</p>
                                    <p><b>Report Date:</b> {new Date().toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        <button className="print-btn" onClick={handlePrint}>
                            Print
                        </button>
                        <button
                            className="print-btn"
                            onClick={handleExportExcel}
                        >
                            Export Excel
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