<?php
include "../db.php";
include "../cors.php";


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$department_id = $_GET['department_id'] ?? "";

if (empty($department_id)) {
    echo json_encode([
        "status" => false,
        "message" => "Department ID is required"
    ]);
    exit();
}

$sql = "SELECT 
            c.id,
            c.department_id,
            d.name AS department_name,
            c.year,
            c.batch,
            c.academic_year,
            c.class_teacher_id,
            f.name AS class_teacher_name
        FROM classes c
        INNER JOIN departments d ON c.department_id = d.id
        LEFT JOIN faculty f ON c.class_teacher_id = f.id
        WHERE c.department_id = ?
        ORDER BY c.academic_year DESC, c.year ASC, c.batch ASC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $department_id);

if (!$stmt->execute()) {
    echo json_encode([
        "status" => false,
        "message" => "Execute failed: " . $stmt->error
    ]);
    exit();
}

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