<?php
include("../cors.php");
include("../db.php");

header("Content-Type: application/json");

$subject_id = $_GET['subject_id'] ?? "";

if (!$subject_id) {
    echo json_encode([
        "status" => false,
        "message" => "subject_id is required"
    ]);
    exit();
}

$sql = "
SELECT 
    st.id AS student_id,
    st.roll_no,
    st.name AS student_name,
    sub.name AS subject_name,
    sub.course_code,
    sub.semester,
    sub.semester_start_date,
    a.date,
    a.status
FROM attendance a
JOIN students st ON a.student_id = st.id
JOIN subjects sub ON a.subject_id = sub.id
WHERE 
    a.subject_id = ?
    AND a.date BETWEEN sub.semester_start_date AND CURDATE()
ORDER BY 
    CAST(st.roll_no AS UNSIGNED), st.roll_no
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "SQL Error: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $subject_id);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
$dates = [];
$subject_info = null;

while ($row = $result->fetch_assoc()) {
    $student_id = $row['student_id'];
    $date = $row['date'];

    if (!in_array($date, $dates)) {
        $dates[] = $date;
    }

    if (!$subject_info) {
        $subject_info = [
            "subject_name" => $row['subject_name'],
            "course_code" => $row['course_code'],
            "semester" => $row['semester'],
            "semester_start_date" => $row['semester_start_date']
        ];
    }

    if (!isset($students[$student_id])) {
        $students[$student_id] = [
            "student_id" => $student_id,
            "roll_no" => $row['roll_no'],
            "student_name" => $row['student_name'],
            "attendance" => [],
            "total_lectures" => 0,
            "present_count" => 0,
            "absent_count" => 0,
            "percentage" => 0,
            "attendance_status" => ""
        ];
    }

    $students[$student_id]["attendance"][$date] = $row['status'];
    $students[$student_id]["total_lectures"]++;

    if ($row['status'] === "present") {
        $students[$student_id]["present_count"]++;
    } else {
        $students[$student_id]["absent_count"]++;
    }
}

foreach ($students as &$student) {
    if ($student["total_lectures"] > 0) {
        $student["percentage"] = round(
            ($student["present_count"] / $student["total_lectures"]) * 100,
            2
        );
    }

    $student["attendance_status"] = ($student["percentage"] >= 75) ? "Good" : "Defaulter";
}

echo json_encode([
    "status" => true,
    "message" => "Subject-wise detailed report generated successfully",
    "report_generated_date" => date("Y-m-d"),
    "subject" => $subject_info,
    "dates" => $dates,
    "data" => array_values($students)
]);

$stmt->close();
$conn->close();
?>