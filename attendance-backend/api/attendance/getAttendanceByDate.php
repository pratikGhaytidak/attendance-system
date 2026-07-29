<?php

include "db.php";

$subject_id = $_GET['subject_id'];
$date = $_GET['date'];

$sql = "SELECT students.id, students.name, students.roll_no, attendance.status
        FROM students
        LEFT JOIN attendance 
        ON students.id = attendance.student_id
        AND attendance.subject_id = '$subject_id'
        AND attendance.date = '$date'";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);

?>