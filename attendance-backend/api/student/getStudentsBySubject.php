<?php
include("../cors.php");
include "../db.php";

$subject_id = $_GET['subject_id'];

// First get subject details
$subjectQuery = "SELECT department_id, year, batch FROM subjects WHERE id = '$subject_id'";
$subjectResult = mysqli_query($conn, $subjectQuery);
$subject = mysqli_fetch_assoc($subjectResult);

// Now get students of same dept, year, batch
$sql = "SELECT id, name, roll_no 
        FROM students
        WHERE department_id = '{$subject['department_id']}'
        AND year = '{$subject['year']}'
        AND batch = '{$subject['batch']}'";

$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);