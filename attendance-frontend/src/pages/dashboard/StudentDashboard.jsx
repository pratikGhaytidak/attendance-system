import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    fetch(
      `http://localhost/attendance_system/api/student/getStudentByEmail.php?email=${email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Sample notices (you can later read from API)
  const notices = [
    {
      id: 1,
      title: "Semester Exam Schedule Released",
      desc: "Final semester exams will start from May 10, 2026. Check the timetable in your college portal.",
      date: "2026-04-15",
    },
    {
      id: 2,
      title: "Attendance Rule Update",
      desc: "Minimum 75% attendance is mandatory to appear in exams. Regularize your attendance before May 1.",
      date: "2026-04-10",
    },
    {
      id: 3,
      title: "Holiday Announcement – Independence Day",
      desc: "College will remain closed on August 15, 2026. Classes will resume on August 16.",
      date: "2026-04-05",
    },
    {
      id: 4,
      title: "Guest Lecture on Cyber Security",
      desc: "A guest lecture will be held on April 22, 2026 in Seminar Hall at 2:00 PM.",
      date: "2026-04-14",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Student Dashboard</h1>
          <p>Welcome back, {student ? student.name : "Student"}!</p>
        </div>
        <div className="header-avatar">
          <div className="avatar">👨‍🎓</div>
        </div>
      </div>

      {student ? (
        <div className="dashboard-grid">
          {/* Left Column: Student Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-icon">📘</div>
              <h3>Student Information</h3>
            </div>
            <div className="profile-body">
              <div className="info-item">
                <span className="info-label">Student ID</span>
                <span className="info-value">{student.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{student.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department ID</span>
                <span className="info-value">{student.department_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Year</span>
                <span className="info-value">{student.year}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value role-badge">{student.role}</span>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="action-btn profile-btn"
                onClick={() => navigate('/edit-profile')}
              >
                👤 Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column: Notices + Action Buttons */}
          <div className="right-section">
            {/* Notice Board */}
            <div className="notice-card">
              <div className="notice-header">
                <h3>📢 Notice Board</h3>
                <span className="notice-count">{notices.length} New</span>
              </div>
              <div className="notice-list">
                {notices.map((notice) => (
                  <div key={notice.id} className="notice-item">
                    <div className="notice-content">
                      <div className="notice-title">{notice.title}</div>
                      <div className="notice-desc">{notice.desc}</div>
                    </div>
                    <div className="notice-date">{notice.date}</div>
                  </div>
                ))}
              </div>
              <div className="notice-footer">
                <button className="view-all-btn">View All Notices →</button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-buttons">
                <button
                  className="action-btn primary-btn"
                  onClick={() => navigate('/my-attendance')}
                >
                  📊 My Attendance
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => navigate('/profile')}
                >
                  👤 Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Fetching your details...</p>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;