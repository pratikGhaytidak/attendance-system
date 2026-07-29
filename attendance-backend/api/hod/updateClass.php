<?php
include "../db.php";
include "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? "";
$department_id = $data['department_id'] ?? "";
$year = $data['year'] ?? "";
$academic_year = $data['academic_year'] ?? "";
$class_teacher_id = $data['class_teacher_id'] ?? null;

if (empty($id) || empty($department_id) || empty($year) || empty($academic_year)) {
    echo json_encode([
        "status" => false,
        "message" => "Required fields missing"
    ]);
    exit();
}

/* duplicate check */
$checkSql = "SELECT id FROM classes 
             WHERE department_id = ? 
             AND year = ? 
             AND academic_year = ? 
             AND id != ?";

$checkStmt = $conn->prepare($checkSql);

if (!$checkStmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit();
}

$checkStmt->bind_param("iisi", $department_id, $year, $academic_year, $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Class already exists"
    ]);
    exit();
}

/* update query */
$sql = "UPDATE classes 
        SET department_id = ?, 
            year = ?, 
            academic_year = ?, 
            class_teacher_id = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("iisii", $department_id, $year, $academic_year, $class_teacher_id, $id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Class updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Update failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>  