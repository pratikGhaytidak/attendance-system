<?php
include("../cors.php");
include "../db.php";

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode([
        "status" => false,
        "message" => "Assignment ID is required"
    ]);
    exit();
}

$id = $data->id;

$sql = "DELETE FROM faculty_subjects WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Assignment deleted successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to delete assignment"
    ]);
}

$stmt->close();
$conn->close();
?>