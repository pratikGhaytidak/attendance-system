import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      console.log("role is ", role);
      const studentId = localStorage.getItem("student_id");

      if (!email) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        // Fetch profile data
        // const profileRes = await fetch(
        //   `x${email}`
        // );
        // const profileData = await profileRes.json();

        const profileRes = await fetch(
          `https://gcekattendance.in/api/common/getProfile.php?email=${encodeURIComponent(email)}`
        );

        if (!profileRes.ok) {
          throw new Error(`Profile API failed: ${profileRes.status}`);
        }

        const profileData = await profileRes.json();


        if (profileData.status) {
          setUser(profileData.data);
        } else {
          setError(profileData.message || "Failed to load profile");
        }

        // Fetch attendance data for students
        if (role === "student" && studentId) {
          const attendanceRes = await fetch(
            `https://gcekattendance.in/api/student/getStudentAttendance.php?student_id=${studentId}`
          );
          const attendanceData = await attendanceRes.json();

          if (Array.isArray(attendanceData) && attendanceData.length > 0) {
            // Process attendance data
            const subjectMap = new Map();
            attendanceData.forEach((record) => {
              const subjectName = record.name;
              if (!subjectMap.has(subjectName)) {
                subjectMap.set(subjectName, {
                  name: subjectName,
                  presentCount: 0,
                  total: 0,
                });
              }
              const subject = subjectMap.get(subjectName);

              // Normalize status
              let isPresent = false;
              if (typeof record.status === "string") {
                isPresent = record.status.toLowerCase() === "present" || record.status === "P";
              } else if (typeof record.status === "number") {
                isPresent = record.status === 1;
              } else if (typeof record.status === "boolean") {
                isPresent = record.status;
              }

              subject.total++;
              if (isPresent) subject.presentCount++;
            });

            const subjectsArray = Array.from(subjectMap.values()).map((sub) => ({
              ...sub,
              percentage: sub.total === 0 ? 0 : ((sub.presentCount / sub.total) * 100).toFixed(1),
            }));

            const overallAttendance = subjectsArray.length
              ? (subjectsArray.reduce((sum, sub) => sum + parseFloat(sub.percentage), 0) / subjectsArray.length).toFixed(1)
              : 0;

            setAttendance({
              subjects: subjectsArray,
              overall: overallAttendance,
              totalSubjects: subjectsArray.length,
            });
          } else {
            setAttendance({
              subjects: [],
              overall: 0,
              totalSubjects: 0,
            });
          }
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");

    if ((user?.role === "faculty" || user?.role === "hod" || user?.role === "principal") && facultyId) {
      fetch(`https://gcekattendance.in/api/faculty/getAssignedSubjects.php?faculty_id=${facultyId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setAssignedSubjects(data.subjects || []);
          }
        })
        .catch((err) => console.log("Error fetching subjects:", err));
    }
  }, [user]);

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "principal":
        return "👨🏻‍💼";
      case "hod":
        return "👔";
      case "faculty":
        return "👩‍🏫";
      case "student":
        return "👨‍🎓";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "principal":
        return "#f5320b";
      case "hod":
        return "#f59e0b";
      case "faculty":
        return "#10b981";
      case "student":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  };

  if (loading) {
    return (
      <div className="profile-container-new">
        <div className="loading-wrapper-new">
          <div className="spinner-new"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container-new">
        <div className="error-card-new">
          <span className="error-icon-new">⚠️</span>
          <h3>{error}</h3>
          <button onClick={() => window.location.reload()} className="retry-btn-new">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container-new">
        <div className="error-card-new">
          <span className="error-icon-new">❓</span>
          <h3>No user data found</h3>
        </div>
      </div>
    );
  }

  const shouldShowImage = user.profile_image && !imageError;

  return (
    <div className="profile-container-new">
      <div className="profile-grid-new">
        {/* Left Column - Profile Card */}
        {/* <div className="profile-card-left-new">
          <div className="profile-avatar-new">
            <div className="avatar-ring-new">
              <div className="avatar-icon-new">{getRoleIcon(user.role)}</div>
            </div>
            <h2>{user.name}</h2>
            <span
              className="role-badge-new"
              style={{ background: `${getRoleColor(user.role)}20`, color: getRoleColor(user.role) }}
            >
              {user.role?.toUpperCase() || "USER"}
            </span>
    
            {user.role === "student" && attendance && (
              <div className="profile-stats-new">
                <div className="stat-item-new">
                  <div className="stat-number-new">{attendance.overall}%</div>
                  <div className="stat-label-new">Attendance</div>
                </div>

                <div className="stat-divider-new"></div>

                <div className="stat-item-new">
                  <div className="stat-number-new">{attendance.totalSubjects}</div>
                  <div className="stat-label-new">Subjects</div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-contact-new">
            <h4>Contact Information</h4>
            <div className="contact-item-new">
              <span className="contact-icon-new">📧</span>
              <div>
                <div className="contact-label-new">Email Address</div>
                <div className="contact-value-new">{user.email}</div>
              </div>
            </div>
            {user.phone && (
              <div className="contact-item-new">
                <span className="contact-icon-new">📞</span>
                <div>
                  <div className="contact-label-new">Phone Number</div>
                  <div className="contact-value-new">{user.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div> */}

        <div className="profile-card-left-new">
          <div className="profile-avatar-new">
            <div className="avatar-ring-new">
              {shouldShowImage ? (
                <img
                  src={`/${user.profile_image}`}
                  alt={user.name || "Profile"}
                  className="profile-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="avatar-icon-new">{getRoleIcon(user.role)}</div>
              )}
            </div>

            <h2>{user.name}</h2>

            <span
              className="role-badge-new"
              style={{
                background: `${getRoleColor(user.role)}20`,
                color: getRoleColor(user.role),
              }}
            >
              {user.role?.toUpperCase() || "USER"}
            </span>

            {user.role?.toLowerCase() === "student" && attendance && (
              <div className="profile-stats-new">
                <div className="stat-item-new">
                  <div className="stat-number-new">{attendance.overall}%</div>
                  <div className="stat-label-new">Attendance</div>
                </div>

                <div className="stat-divider-new"></div>

                <div className="stat-item-new">
                  <div className="stat-number-new">{attendance.totalSubjects}</div>
                  <div className="stat-label-new">Subjects</div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-contact-new">
            <h4>Contact Information</h4>

            <div className="contact-item-new">
              <span className="contact-icon-new">📧</span>
              <div>
                <div className="contact-label-new">Email Address</div>
                <div className="contact-value-new">{user.email}</div>
              </div>
            </div>

            {user.phone && (
              <div className="contact-item-new">
                <span className="contact-icon-new">📞</span>
                <div>
                  <div className="contact-label-new">Phone Number</div>
                  <div className="contact-value-new">{user.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="profile-card-right-new">
          <div className="profile-tabs-new">
            <button
              className={`tab-btn-new ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📋 Overview
            </button>
            <button
              className={`tab-btn-new ${activeTab === "academic" ? "active" : ""}`}
              onClick={() => setActiveTab("academic")}
            >
              🎓 Academic
            </button>
            {user.role === "student" && (
              <button
                className={`tab-btn-new ${activeTab === "attendance" ? "active" : ""}`}
                onClick={() => setActiveTab("attendance")}
              >
                📊 Attendance
              </button>
            )}
            <button
              className={`tab-btn-new ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Settings
            </button>
          </div>

          <div className="profile-content-new">
            {activeTab === "overview" && (
              <div className="overview-tab-new">
                <div className="info-section-new">
                  <h3>Basic Information</h3>
                  <div className="info-grid-new">
                    <div className="info-row-new">
                      <span className="info-label-new">Full Name</span>
                      <span className="info-value-new">{user.name}</span>
                    </div>
                    <div className="info-row-new">
                      <span className="info-label-new">Email Address</span>
                      <span className="info-value-new">{user.email}</span>
                    </div>
                    <div className="info-row-new">
                      <span className="info-label-new">Role</span>
                      <span className="info-value-new">{user.role?.toUpperCase()}</span>
                    </div>
                    {user.department && (
                      <div className="info-row-new">
                        <span className="info-label-new">Department</span>
                        <span className="info-value-new">{user.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div className="academic-tab-new">
                {user.department && (
                  <div className="info-section-new">
                    <h3>Department Information</h3>
                    <div className="info-grid-new">
                      <div className="info-row-new">
                        <span className="info-label-new">Department</span>
                        <span className="info-value-new">{user.department}</span>
                      </div>
                      {user.department_id && (
                        <div className="info-row-new">
                          <span className="info-label-new">Department ID</span>
                          <span className="info-value-new">{user.department_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(user.year || user.practicalBatch) && (
                  <div className="info-section-new">
                    <h3>Academic Details</h3>
                    <div className="info-grid-new">
                      {user.year && (
                        <div className="info-row-new">
                          <span className="info-label-new">Year</span>
                          <span className="info-value-new">{user.year}</span>
                        </div>
                      )}
                      {user.practicalBatch && (
                        <div className="info-row-new">
                          <span className="info-label-new">Batch</span>
                          <span className="info-value-new">{user.practicalBatch}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(user.employee_id || user.designation) && (
                  <div className="info-section-new">
                    <h3>Professional Details</h3>
                    <div className="info-grid-new">
                      {user.employee_id && (
                        <div className="info-row-new">
                          <span className="info-label-new">Employee ID</span>
                          <span className="info-value-new">{user.employee_id}</span>
                        </div>
                      )}
                      {user.designation && (
                        <div className="info-row-new">
                          <span className="info-label-new">Designation</span>
                          <span className="info-value-new">{user.designation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {(user.role === "faculty" || user.role === "hod") && (
                  <div className="info-section-new">
                    <h3>Assigned Subjects</h3>
                    {assignedSubjects.length > 0 ? (
                      <div className="subjects-list-new">
                        {assignedSubjects.map((subject) => (
                          <span key={subject.id} className="subject-badge-new">
                            {subject.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="no-subjects-new">No subjects assigned yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "attendance" && user.role === "student" && attendance && (
              <div className="attendance-tab-new">
                {attendance.subjects.length === 0 ? (
                  <div className="empty-attendance-new">
                    <span>📭</span>
                    <p>No attendance records found yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="overall-attendance-new">
                      <div className="overall-circle-new">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                          <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${(attendance.overall / 100) * 283}, 283`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="overall-percent-new">
                          <span className="percent-number">{attendance.overall}%</span>
                          <span className="percent-label">Overall</span>
                        </div>
                      </div>
                    </div>

                    <div className="subjects-attendance-new">
                      <h3>Subject-wise Attendance</h3>
                      {attendance.subjects.map((subject, index) => (
                        <div key={index} className="subject-attendance-item-new">
                          <div className="subject-header-new">
                            <span className="subject-name-new">{subject.name}</span>
                            <span className="subject-percent-new">{subject.percentage}%</span>
                          </div>
                          <div className="progress-bar-new">
                            <div
                              className="progress-fill-new"
                              style={{ width: `${subject.percentage}%` }}
                            ></div>
                          </div>
                          <div className="subject-stats-new">
                            <span>✅ Present: {subject.presentCount}</span>
                            <span>❌ Absent: {subject.total - subject.presentCount}</span>
                            <span>📅 Total: {subject.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="settings-tab-new">
                <div className="info-section-new">
                  <h3>Account Settings</h3>
                  <div className="settings-actions-new">
                    <button
                      className="settings-btn-new"
                      onClick={() => navigate("/change-password")}
                    >
                      🔒 Change Password
                    </button>
                    <button className="settings-btn-new" onClick={() => alert("Notification settings coming soon")}>
                      🔔 Notification Preferences
                    </button>

                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions-new">
            <button
              className="action-btn-new logout"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              🚪 Logout
            </button>
            <button
              className="action-btn-new edit"
              onClick={() => navigate("/edit-profile")}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;