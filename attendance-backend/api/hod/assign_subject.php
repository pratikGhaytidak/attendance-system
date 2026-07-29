<?php
include("../db.php");
include "../cors.php";

$data = json_decode(file_get_contents("php://input"), true);

$faculty_id = $data['faculty_id'];
$subject_id = $data['subject_id'];

// 🔥 check faculty & subject belong to same department
$check = "SELECT f.id 
          FROM faculty f, subjects s 
          WHERE f.id = '$faculty_id' 
          AND s.id = '$subject_id'
          AND f.department_id = s.department_id";

$result = mysqli_query($conn, $check);

if (mysqli_num_rows($result) > 0) {

    // 🔥 prevent duplicate
    $insert = "INSERT INTO faculty_subjects (faculty_id, subject_id)
               SELECT '$faculty_id', '$subject_id'
               WHERE NOT EXISTS (
                   SELECT * FROM faculty_subjects 
                   WHERE faculty_id = '$faculty_id' 
                   AND subject_id = '$subject_id'
               )";

    if (mysqli_query($conn, $insert)) {
        echo json_encode(["message" => "Subject assigned successfully"]);
    } else {
        echo json_encode(["error" => mysqli_error($conn)]);
    }

} else {
    echo json_encode(["error" => "Faculty and Subject must belong to same department"]);
}
?>