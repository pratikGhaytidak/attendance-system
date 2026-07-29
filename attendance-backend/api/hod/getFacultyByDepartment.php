<?php
include("../cors.php");
include "../db.php";

$dept_id = $_GET['department_id'] ?? null;

if (!$dept_id) {
    echo json_encode([
        "status" => false,
        "message" => "Department ID required"
    ]);
    exit;
}

// ✅ Only ACTIVE faculty
$sql = "SELECT id, name, email, faculty_image
        FROM faculty 
        WHERE department_id = '$dept_id'
        AND status = 'active'
        AND role = 'faculty'";

$result = $conn->query($sql);

$faculty = [];

while ($row = $result->fetch_assoc()) {
    $faculty[] = $row;
}

echo json_encode([
    "status" => true,
    "data" => $faculty
]);
?>