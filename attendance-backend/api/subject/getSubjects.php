<?php
include("../cors.php");


include "../db.php";

$faculty_id = $_GET['faculty_id'];

$sql = "SELECT subjects.id, subjects.name , subjects.department_id, subjects.year
        FROM faculty_subjects
        JOIN subjects ON subjects.id = faculty_subjects.subject_id
        WHERE faculty_subjects.faculty_id = '$faculty_id'";
// $sql = "SELECT 
//             subjects.id, 
//             subjects.name,
//             subjects.department_id,
//             subjects.year
//         FROM faculty_subjects
//         JOIN subjects 
//             ON subjects.id = faculty_subjects.subject_id
//         WHERE faculty_subjects.faculty_id = '$faculty_id'";

$result = $conn->query($sql);

$subjects = [];

while($row = $result->fetch_assoc()){
    $subjects[] = $row;
}

echo json_encode($subjects);

?>