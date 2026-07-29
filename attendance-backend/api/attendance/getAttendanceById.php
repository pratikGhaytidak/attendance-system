<?php
include("../cors.php");
include("../db.php");

$id = $_GET['id'];

$sql = "SELECT a.*, s.name as student_name, sub.name as subject_name 
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN subjects sub ON a.subject_id = sub.id
        WHERE a.id = $id";

$result = mysqli_query($conn, $sql);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode(["status" => true, "data" => $row]);
} else {
    echo json_encode(["status" => false]);
}
?>