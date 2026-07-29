<?php
include("../db.php");
include "../cors.php";


$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];
$department_id = $data['department_id'];

$sql = "INSERT INTO Faculty (name, email, password, department_id) 
        VALUES ('$name', '$email', '$password', '$department_id')";

$stmt = $conn->prepare($sql);


if ($stmt->execute()) {
    echo json_encode([
        "message" => "Faculty added successfully",
        "faculty_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode(["error" => $stmt->error]);
}
?>