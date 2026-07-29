<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../db.php");
include("../cors.php");
// Get faculty_id from request
if (!isset($_GET['faculty_id'])) {
    echo json_encode(["error" => "faculty_id is required"]);
    exit();
}

$faculty_id = $_GET['faculty_id'];

// Query: Get HOD name + department name
$sql = "SELECT f.name AS hod_name, d.name AS department_name
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        WHERE f.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $faculty_id);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "hod_name" => $row['hod_name'],
        "department_name" => $row['department_name']
    ]);
} else {
    echo json_encode(["error" => "No data found"]);
}

$stmt->close();
$conn->close();
?>