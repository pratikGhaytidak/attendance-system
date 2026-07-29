<?php
include("../cors.php");
include("../db.php");

header("Content-Type: application/json");

if (!isset($_GET['faculty_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "faculty_id required"
    ]);
    exit();
}

$faculty_id = $_GET['faculty_id'];

$query = "SELECT 
            c.department_id,
            c.year,
            c.batch,
            c.academic_year,
            d.name AS department_name
          FROM classes c
          JOIN departments d ON c.department_id = d.id
          WHERE c.class_teacher_id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $faculty_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    echo json_encode([
        "status" => "success",
        "isClassTeacher" => true,
        "department_id" => $row['department_id'],
        "department_name" => $row['department_name'],
        "year" => $row['year'],
        "batch" => $row['batch'],
        "academic_year" => $row['academic_year']
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "isClassTeacher" => false
    ]);
}

$stmt->close();
$conn->close();
?>