<?php
include("../cors.php");
include("../db.php");

header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(E_ALL);

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode([
        "status" => false,
        "message" => "Student ID is required"
    ]);
    exit();
}

$stmt = $conn->prepare("
    SELECT id, name, email, roll_no, year, batch, department_id
    FROM students
    WHERE id = ?
");

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed",
        "error" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    echo json_encode([
        "status" => false,
        "message" => "Execute failed",
        "error" => $stmt->error
    ]);
    exit();
}

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();

    echo json_encode([
        "status" => true,
        "data" => $student
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Student not found"
    ]);
}

$stmt->close();
$conn->close();
?>