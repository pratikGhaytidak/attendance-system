import React, { useEffect, useState } from "react";
import "./FacultySubjects.css";

const FacultySubjects = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const deptId = localStorage.getItem("department_id");

  const groupByFaculty = (mappings) => {
    const groups = {};
    mappings.forEach((item) => {
      const key = item.faculty_id || item.email;
      if (!groups[key]) {
        groups[key] = {
          id: key,
          name: item.faculty_name,
          email: item.email,
          subjects: [],
        };
      }
      groups[key].subjects.push({
        id: item.id,
        name: item.subject_name,
      });
    });
    return Object.values(groups);
  };

  const fetchMappings = () => {
    setLoading(true);
    fetch(
      `https://gcekattendance.in/api/hod/getFacultySubjectMapping.php?department_id=${deptId}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status && res.data) {
          const grouped = groupByFaculty(res.data);
          setFaculties(grouped);
          if (grouped.length) setSelectedFaculty(grouped[0]);
        } else {
          setFaculties([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const handleDelete = async (mappingId, facultyEmail) => {
    const confirmDelete = window.confirm("Remove this subject from the faculty?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "https://gcekattendance.in/api/hod/deleteFacultySubjectMapping.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mappingId }),
        }
      );
      const result = await res.json();
      if (result.status) {
        alert("Subject removed");
        // Update state
        setFaculties((prev) =>
          prev
            .map((fac) => {
              if (fac.email === facultyEmail) {
                const updatedSubjects = fac.subjects.filter((sub) => sub.id !== mappingId);
                if (updatedSubjects.length === 0) return null;
                return { ...fac, subjects: updatedSubjects };
              }
              return fac;
            })
            .filter(Boolean)
        );
        // If selected faculty lost all subjects, move to first available
        setSelectedFaculty((prev) => {
          if (prev && prev.email === facultyEmail) {
            const updated = faculties.find((f) => f.email === facultyEmail);
            if (updated && updated.subjects.length > 0) return updated;
            return faculties[0] || null;
          }
          return prev;
        });
      } else {
        alert(result.message || "Failed to remove");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  if (loading) {
    return (
      <div className="fs-container">
        <div className="fs-loader"></div>
      </div>
    );
  }

  if (faculties.length === 0) {
    return (
      <div className="fs-container">
        <div className="fs-empty">
          <span className="empty-icon">📭</span>
          <h3>No faculty assignments found</h3>
          <p>Assign subjects to faculty members to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fs-container">
      <div className="fs-header">
        <div className="fs-header-text">
          <h1>Faculty Subject Mapping</h1>
          <p>Manage subjects assigned to each faculty member</p>
        </div>
        <div className="fs-header-stats">
          <span className="stat-badge">{faculties.length} Faculty</span>
          <span className="stat-badge">
            {faculties.reduce((acc, f) => acc + f.subjects.length, 0)} Subjects
          </span>
        </div>
      </div>

      <div className="fs-split-layout">
        {/* Faculty list sidebar */}
        <div className="fs-faculty-sidebar">
          <h3>All Faculty</h3>
          <div className="fs-faculty-list">
            {faculties.map((fac) => (
              <div
                key={fac.id}
                className={`fs-faculty-item ${selectedFaculty?.id === fac.id ? "active" : ""}`}
                onClick={() => setSelectedFaculty(fac)}
              >
                <div className="faculty-avatar">{fac.name.charAt(0)}</div>
                <div className="faculty-info">
                  <div className="faculty-name">{fac.name}</div>
                  <div className="faculty-email-small">{fac.email}</div>
                </div>
                <div className="subject-count-badge">{fac.subjects.length}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected faculty detail area */}
        {selectedFaculty && (
          <div className="fs-detail-area">
            <div className="fs-detail-header">
              <div className="detail-avatar-large">{selectedFaculty.name.charAt(0)}</div>
              <div className="detail-info">
                <h2>{selectedFaculty.name}</h2>
                <p className="detail-email">{selectedFaculty.email}</p>
              </div>
            </div>

            <div className="fs-subject-section">
              <div className="section-title">
                <h3>Assigned Subjects</h3>
                <span className="subject-count">{selectedFaculty.subjects.length} subjects</span>
              </div>
              <div className="subject-grid">
                {selectedFaculty.subjects.map((sub) => (
                  <div key={sub.id} className="subject-card-glass">
                    <div className="subject-icon">📖</div>
                    <div className="subject-name">{sub.name}</div>
                    <button
                      className="remove-subject-glass"
                      onClick={() => handleDelete(sub.id, selectedFaculty.email)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="fs-add-hint">
              <button className="add-subject-btn">+ Add New Subject</button>
              <p className="hint-text">(Coming soon – assign subjects directly)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultySubjects;