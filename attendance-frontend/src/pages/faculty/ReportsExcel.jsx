import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
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

  const downloadExcelReport = (rows, apiDates) => {
    let allDates = [];

    if (apiDates && apiDates.length > 0) {
      allDates = [...apiDates];
    }

    rows.forEach((row) => {
      if (row.attendance) {
        Object.keys(row.attendance).forEach((date) => {
          if (!allDates.includes(date)) {
            allDates.push(date);
          }
        });
      }
    });

    allDates.sort();

    const excelData = rows.map((row, index) => {
      const dateAttendance = {};

      allDates.forEach((date) => {
        dateAttendance[date] =
          row.attendance?.[date] === "present"
            ? "P"
            : row.attendance?.[date] === "absent"
            ? "A"
            : "-";
      });

      return {
        "Sr. No": index + 1,
        "Roll No": row.roll_no,
        "Student Name": row.student_name,
        ...dateAttendance,
        "Total Lectures": row.total_lectures,
        Present: row.present_count,
        Absent: row.absent_count,
        Percentage: `${row.percentage}%`,
        Status: row.attendance_status,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 25 },
      ...allDates.map(() => ({ wch: 12 })),
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, "Subject_Attendance_Report.xlsx");
  };

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

    fetch(
      `http://localhost/attendance-system/attendance-backend/api/reports/subjectWiseReport.php?subject_id=${subjectId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const rows = data.data || [];
          const dates = data.dates || [];

          if (rows.length === 0) {
            setMessage("No attendance records found for this subject");
            return;
          }

          downloadExcelReport(rows, dates);
          setMessage("Excel report downloaded successfully");
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
          {loading ? "Generating..." : "Generate Excel Report"}
        </button>

        {message && <p className="report-message">{message}</p>}
      </div>
    </div>
  );
}

export default Reports;