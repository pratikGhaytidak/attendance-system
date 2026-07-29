<?php
include("../cors.php");
include "../db.php";

$faculty_id = $_GET['faculty_id'] ?? '';
$date = $_GET['date'] ?? '';
$subject_id = $_GET['subject_id'] ?? '';

// ✅ Updated query with JOIN
$sql = "SELECT 
            attendance.*, 
            students.name AS student_name, 
            subjects.name AS subject_name
        FROM attendance
        JOIN students ON attendance.student_id = students.id
        JOIN subjects ON attendance.subject_id = subjects.id
        WHERE attendance.faculty_id = '$faculty_id'";
        
// Optional filters
if ($date) {
    $sql .= " AND attendance.date = '$date'";
}

if ($subject_id) {
    $sql .= " AND attendance.subject_id = '$subject_id'";
}

$sql .= " ORDER BY attendance.date DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    die("SQL Error: " . mysqli_error($conn));
}
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode([
    "status" => true,
    "data" => $data
]);
?>