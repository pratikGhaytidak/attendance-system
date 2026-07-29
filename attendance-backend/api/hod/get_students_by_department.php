<?php
include "../db.php";
include "../cors.php";

// Function to send response
function sendResponse($status, $message, $data = []) {
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]);
    exit();
}

// 🔹 Check DB connection
if ($conn->connect_error) {
    sendResponse(false, "Database connection failed");
}

// 🔹 Check department_id
if (!isset($_GET['department_id']) || empty($_GET['department_id'])) {
    sendResponse(false, "department_id is required");
}

$department_id = $_GET['department_id'];

// 🔹 Validate (must be number)
if (!is_numeric($department_id)) {
    sendResponse(false, "Invalid department_id");
}

// 🔹 Prepare statement (secure)
$stmt = $conn->prepare("SELECT * FROM students WHERE department_id = ?");

if (!$stmt) {
    sendResponse(false, "Query preparation failed");
}

$stmt->bind_param("i", $department_id);

// 🔹 Execute query
if (!$stmt->execute()) {
    sendResponse(false, "Query execution failed");
}

$result = $stmt->get_result();

$students = [];

// 🔹 Fetch data
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

// 🔹 Check data found or not
if (count($students) > 0) {
    sendResponse(true, "Students fetched successfully", $students);
} else {
    sendResponse(false, "No students found for this department");
}

$stmt->close();
$conn->close();
?>