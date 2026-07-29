<?php

include("../cors.php");
include("../db.php");

if (!isset($_GET['faculty_id'])) {
    echo json_encode(["status" => "error", "message" => "faculty_id required"]);
    exit();
}

$faculty_id = $_GET['faculty_id'];

$query = "SELECT 
            ct.department_id,
            ct.year,
            d.name
          FROM class_teacher ct
          JOIN departments d 
          ON ct.department_id = d.id
          WHERE ct.faculty_id = '$faculty_id'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);

    echo json_encode([
        "status" => "success",
        "isClassTeacher" => true,
        "department_id" => $row['department_id'],   // 🔥 for backend
        "department_name" => $row['name'], // 🔥 for UI
        "year" => $row['year']
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "isClassTeacher" => false
    ]);
}
?>