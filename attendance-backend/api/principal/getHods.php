<?php
include("../cors.php");


// DB connection
include "../db.php";
// $conn = new mysqli("localhost", "root", "", "attendance_system");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Fetch all HODs
$sql = "SELECT id, name, email, department_id 
        FROM faculty 
        WHERE role = 'hod'";

$result = $conn->query($sql);

$hods = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hods[] = $row;
    }
}

echo json_encode($hods);

$conn->close();
?>