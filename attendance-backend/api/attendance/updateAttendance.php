<?php
include("../cors.php");
include("../db.php");

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing id or status"
    ]);
    exit;
}

$id = $data['id'];
$status = strtolower($data['status']); // normalize

// Validate status
if ($status !== "present" && $status !== "absent") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid status"
    ]);
    exit;
}

// Prepare query (safe)
$stmt = $conn->prepare("UPDATE attendance SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Attendance updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed"
    ]);
}

$stmt->close();
$conn->close();

?>