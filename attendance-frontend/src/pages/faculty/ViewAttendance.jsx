import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewAttendance.module.css";

function ViewAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [date, setDate] = useState("");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const facultyId = localStorage.getItem("faculty_id");
    const navigate = useNavigate();

    // Fetch Data
    const fetchAttendance = async () => {
        if (!facultyId) return;

        setLoading(true);
        try {
            let url = `https://gcekattendance.in/api/attendance/getAttendanceByFaculty.php?faculty_id=${facultyId}`;
            if (date) url += `&date=${date}`;

            const res = await fetch(url);
            const data = await res.json();
            setAttendance(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Group Data
    const groupedData = () => {
        const map = {};

        attendance.forEach((r) => {
            const key = `${r.subject_name}-${r.date}`;

            if (!map[key]) {
                map[key] = {
                    subject: r.subject_name,
                    subject_id: r.subject_id,
                    date: r.date,
                    present: 0,
                    absent: 0,
                    students: [],
                };
            }

            if (r.status?.toLowerCase() === "present") map[key].present++;
            else map[key].absent++;

            map[key].students.push({
                name: r.student_name,
                status: r.status,
                student_id: r.student_id,
                id: r.id   
            });
        });

        return Object.values(map);
    };

    const groups = groupedData();

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Attendance Dashboard</h1>

            {/* Filter */}
            <div className={styles.filter}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={fetchAttendance}>Apply</button>
                {date && (
                    <button
                        className={styles.reset}
                        onClick={() => {
                            setDate("");
                            fetchAttendance();
                        }}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && <p className={styles.center}>Loading...</p>}

            {/* Cards */}
            <div className={styles.grid}>
                {groups.length ? (
                    groups.map((g, i) => (
                        <div
                            key={i}
                            className={styles.card}
                            onClick={() => setSelected(g)}
                        >
                            <h3>{g.subject}</h3>
                            <p className={styles.date}>{g.date}</p>

                            <div className={styles.stats}>
                                <span className={styles.present}>✔ {g.present}</span>
                                <span className={styles.absent}>✖ {g.absent}</span>
                            </div>

                            <p className={styles.total}>
                                Total: {g.present + g.absent}
                            </p>
                        </div>
                    ))
                ) : (
                    !loading && <p className={styles.center}>No records found</p>
                )}
            </div>

            {/* Modal */}
            {selected && (
                <div
                    className={styles.overlay}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2>
                                {selected.subject} ({selected.date})
                            </h2>
                            <button onClick={() => setSelected(null)}>×</button>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.students.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.name}</td>
                                        <td
                                            className={
                                                s.status.toLowerCase() === "present"
                                                    ? styles.present
                                                    : styles.absent
                                            }
                                        >
                                            {s.status}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.edit}
                                                onClick={() => {
                                                    console.log("Sending to edit:", {
                                                        id: s.id,
                                                        status: s.status,
                                                    });

                                                    navigate(`/edit-attendance/${s.id}`, {
                                                        state: {
                                                            id: s.id,   // ✅ CORRECT NOW
                                                            status: s.status,
                                                            student_name: s.name,
                                                            subject_name: selected.subject,
                                                            date: selected.date,
                                                        },
                                                    });
                                                }}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAttendance;