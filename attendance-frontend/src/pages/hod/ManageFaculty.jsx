import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageFaculty.css";

function ManageFaculty() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);

  // ✅ Get department id safely
  const deptId = parseInt(localStorage.getItem("department_id"));

  console.log("Department id:", deptId);

  // 🔹 Fetch faculty
  const getFaculty = async () => {
    if (!deptId) {
      console.error("Department ID missing");
      return;
    }

    try {
      const res = await fetch(
        `https://gcekattendance.in/api/hod/getFacultyByDepartment.php?department_id=${deptId}`
      );

      const data = await res.json();

      console.log("API Response:", data);

      // ✅ Handle both response formats
      if (Array.isArray(data)) {
        setFaculty(data);
      } else if (data.status) {
        setFaculty(data.data);
      } else {
        setFaculty([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ Run when deptId is available
  useEffect(() => {
    if (deptId) {
      getFaculty();
    }
  }, [deptId]);

  // 🔹 Delete faculty
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this faculty?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://gcekattendance.in/api/hod/deleteFaculty.php?id=${id}`
      );

      const data = await res.json();

      if (data.status) {
        alert(data.message);
        getFaculty(); // refresh
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔹 Edit faculty
  const handleEdit = (id) => {
    navigate(`/edit-faculty-form/${id}`);
  };

  const cards = [
    {
      title: "Add Faculty",
      desc: "Create new faculty accounts and add them to your department",
      icon: "👨‍🏫",
      iconBg: "#fef3c7",
      iconColor: "#ea580c",
      className: "add-card",
      onClick: () => navigate("/add-faculty"),
      buttonText: "Add New Faculty",
      buttonIcon: "➕",
    },
    {
      title: "Assign Subjects",
      desc: "Assign available subjects to faculty members quickly",
      icon: "📚",
      iconBg: "#fff7ed",
      iconColor: "#f97316",
      className: "assign-card",
      onClick: () => navigate("/assign-subject"),
      buttonText: "Assign Subjects",
      buttonIcon: "📖",
    },
    {
      title: "Assigned Faculty",
      desc: "View which faculty is assigned to which subject in your department",
      icon: "👥",
      iconBg: "#fffbeb",
      iconColor: "#fbbf24",
      className: "view-card",
      onClick: () => navigate("/faculty-subject"),
      buttonText: "View Assignments",
      buttonIcon: "👀",
    },
  ];

  return (
    <div className="manage-faculty-page">
      {/* 🔹 Header */}
      <div className="manage-faculty-header">
        <div className="header-badge">Faculty Management</div>
        <h1>Manage Faculty</h1>
        <p>Handle faculty records and subject assignments from one place</p>
      </div>

      {/* 🔹 Cards */}
      <div className="manage-faculty-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`faculty-card ${card.className}`}
            onClick={card.onClick}
          >
            <div className="card-badge">{index + 1}</div>

            <div
              className="faculty-card-icon"
              style={{
                background: card.iconBg,
                color: card.iconColor,
              }}
            >
              {card.icon}
            </div>

            <h2>{card.title}</h2>
            <p>{card.desc}</p>

            <div className="card-footer">
              <button className="faculty-card-btn">
                <span className="btn-icon">{card.buttonIcon}</span>
                {card.buttonText}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Faculty Table */}
      <div className="faculty-table-container">
        <h2>Faculty List</h2>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {faculty.length > 0 ? (
              faculty.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(f.id)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(f.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No faculty found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageFaculty;