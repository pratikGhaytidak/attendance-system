<?php
include("../cors.php");


include "../db.php";

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

if (!isset($_GET['student_id'])) {
    echo json_encode(["error" => "student_id is required"]);
    exit();
}

$student_id = $_GET['student_id'];

$sql = "SELECT s.name, a.date, a.status 
        FROM attendance a
        JOIN subjects s ON a.subject_id = s.id
        WHERE a.student_id = ?
        ORDER BY a.date DESC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode([
        "error" => "SQL Error",
        "message" => $conn->error
    ]));
}
$stmt->bind_param("i", $student_id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>