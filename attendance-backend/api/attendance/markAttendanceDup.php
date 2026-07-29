<?php
include("../cors.php");
include "db.php";

$data = json_decode(file_get_contents("php://input"));

foreach ($data as $attendance) {

    $student_id = $attendance->student_id;
    $subject_id = $attendance->subject_id;
    $faculty_id = $attendance->faculty_id;
    $date = $attendance->date;
    $status = $attendance->status;

    $check = "SELECT * FROM attendance 
              WHERE student_id='$student_id' 
              AND subject_id='$subject_id' 
              AND date='$date'";

    $result = $conn->query($check);

    if($result->num_rows == 0){

        $sql = "INSERT INTO attendance 
                (student_id, subject_id, faculty_id, date, status)
                VALUES 
                ('$student_id','$subject_id','$faculty_id','$date','$status')";

        $conn->query($sql);
    }
}

echo json_encode(["status"=>"success"]);

?>