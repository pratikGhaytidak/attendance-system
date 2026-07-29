<?php
include("../cors.php");
include "../db.php";

$dept_id = $_GET['department_id'];

$sql = "SELECT id, name FROM subjects WHERE department_id = '$dept_id'";
$result = $conn->query($sql);

// 🔥 check query error
if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$subjects = [];

while ($row = $result->fetch_assoc()) {
    $subjects[] = $row;
}

echo json_encode($subjects);
?>