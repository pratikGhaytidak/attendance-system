<?php
include "../db.php";
include "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$data = json_decode(file_get_contents("php://input"), true);

$department_id    = $data['department_id'] ?? "";
$year             = $data['year'] ?? "";
$academic_year    = $data['academic_year'] ?? "";
$class_teacher_id = $data['class_teacher_id'] ?? null;

if (empty($department_id) || empty($year) || empty($academic_year)) {
    echo json_encode([
        "status" => false,
        "message" => "Required fields missing"
    ]);
    exit();
}

/* Check duplicate class */
$checkSql = "SELECT id FROM classes 
             WHERE department_id = ? 
             AND year = ? 
             AND academic_year = ?";

$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("iis", $department_id, $year, $academic_year);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Class already exists"
    ]);
    exit();
}

/* Insert class */
$sql = "INSERT INTO classes 
        (department_id, year, academic_year, class_teacher_id)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("iisi", $department_id, $year, $academic_year, $class_teacher_id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Class added successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to add class"
    ]);
}

$stmt->close();
$conn->close();
?>