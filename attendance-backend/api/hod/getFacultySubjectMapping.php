<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../db.php";
include "../cors.php";

$department_id = $_GET['department_id'] ?? "";

if (!$department_id) {
    echo json_encode([
        "status" => false,
        "message" => "Department ID required"
    ]);
    exit();
}

$sql = "
SELECT 
    fs.id AS id,
    f.id AS faculty_id,
    f.name AS faculty_name,
    f.email,
    s.id AS subject_id,
    s.name AS subject_name
FROM faculty_subjects fs
JOIN faculty f ON fs.faculty_id = f.id
JOIN subjects s ON fs.subject_id = s.id
WHERE f.department_id = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $department_id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();
?>