<?php

include "db.php";

$student_id = $_GET['student_id'];
$subject_id = $_GET['subject_id'];

$total = "SELECT COUNT(*) as total FROM attendance
          WHERE student_id='$student_id' AND subject_id='$subject_id'";

$present = "SELECT COUNT(*) as present FROM attendance
            WHERE student_id='$student_id'
            AND subject_id='$subject_id'
            AND status='present'";

$total_result = $conn->query($total)->fetch_assoc();
$present_result = $conn->query($present)->fetch_assoc();

$total_classes = $total_result['total'];
$present_classes = $present_result['present'];

$percentage = 0;

if($total_classes > 0){
    $percentage = ($present_classes / $total_classes) * 100;
}

echo json_encode([
    "total_classes" => $total_classes,
    "present" => $present_classes,
    "percentage" => round($percentage,2)
]);

?>