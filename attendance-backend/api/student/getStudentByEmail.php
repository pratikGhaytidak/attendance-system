<?php
include("../cors.php");
include "../db.php";

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Get email from request
if (!isset($_GET['email'])) {
    echo json_encode(["error" => "Email is required"]);
    exit();
}

$email = $_GET['email'];

// Fetch student
$sql = "SELECT id, name, email, department_id, year 
        FROM students 
        WHERE email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    // $student["role"]= "student";
    $student["role"] = "student";
    echo json_encode($student);
} else {
    echo json_encode(["message" => "Student not found"]);
}

$stmt->close();
$conn->close();
?>