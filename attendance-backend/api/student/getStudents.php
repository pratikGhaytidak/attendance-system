<?php
include("../cors.php");
include "../db.php";

$department_id = $_GET['department_id'];
$year = $_GET['year'];
// $batch = $_GET['batch'];

$sql = "SELECT * FROM students 
        WHERE department_id='$department_id' 
        AND year='$year'"; 
        // AND batch='$batch'

$result = $conn->query($sql);

$students = [];

while($row = $result->fetch_assoc()){
    $students[] = $row;
}

echo json_encode($students);

?>