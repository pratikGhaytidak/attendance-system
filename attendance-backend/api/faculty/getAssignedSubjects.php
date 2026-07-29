<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../db.php";
include "../cors.php";

$faculty_id = $_GET['faculty_id'] ?? "";

if (!$faculty_id) {
    echo json_encode([
        "status" => false,
        "message" => "Faculty ID is required"
    ]);
    exit();
}

$sql = "SELECT s.id, s.name
        FROM faculty_subjects fs
        JOIN subjects s ON fs.subject_id = s.id
        WHERE fs.faculty_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Query prepare failed",
        "error" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $faculty_id);
$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
while ($row = $result->fetch_assoc()) {
    $subjects[] = $row;
}

echo json_encode([
    "status" => true,
    "subjects" => $subjects
]);
?>