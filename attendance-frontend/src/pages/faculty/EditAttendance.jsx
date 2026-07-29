import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./EditAttendance.module.css";

function EditAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch(
          `http://localhost/attendance_system/api/attendance/getAttendanceById.php?id=${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result.status && result.data) {
          setData(result.data);
          setStatus(result.data.status);
        } else {
          throw new Error(result.message || "Record not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!status) return setError("Please select a status");
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost/attendance_system/api/attendance/updateAttendance.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        }
      );
      const result = await res.json();
      if (result.success) {
        navigate(-1);
        alert("Changes saved successfully!");
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <p>Loading attendance record...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⛔</div>
          <h3>Unable to load data</h3>
          <p>{error || "No record found"}</p>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Edit attendance</h2>
          <p className={styles.subtitle}>Update student attendance status</p>
        </div>

        <div className={styles.cardBody}>
          {/* Two-column info layout for professional density */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Student name</label>
              <div className={styles.infoValue}>{data.student_name}</div>
            </div>
            <div className={styles.infoItem}>
              <label>Subject</label>
              <div className={styles.infoValue}>{data.subject_name}</div>
            </div>
            <div className={styles.infoItem}>
              <label>Date</label>
              <div className={styles.infoValue}>{data.date}</div>
            </div>
          </div>

          <div className={styles.statusSection}>
            <label htmlFor="status">Attendance status</label>
            <div className={styles.statusToggle}>
              <button
                type="button"
                className={`${styles.statusOption} ${
                  status === "present" ? styles.activePresent : ""
                }`}
                onClick={() => setStatus("present")}
                disabled={saving}
              >
                <span>✓</span> Present
              </button>
              <button
                type="button"
                className={`${styles.statusOption} ${
                  status === "absent" ? styles.activeAbsent : ""
                }`}
                onClick={() => setStatus("absent")}
                disabled={saving}
              >
                <span>✗</span> Absent
              </button>
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.actions}>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className={styles.primaryBtn}
              
            >
              {saving ? "Updating..." : "Save changes"}
            </button>
            <button
              onClick={() => navigate(-1) }
              disabled={saving}
              className={styles.secondaryBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAttendance;