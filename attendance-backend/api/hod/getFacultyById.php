<?php
include("../cors.php");
include "../db.php";

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode([
        "status" => false,
        "message" => "ID required"
    ]);
    exit;
}

// 🔒 Prepared statement + all needed fields
$stmt = $conn->prepare("
    SELECT 
        id,
        name,
        email,
        role,
        department_id,
        status
    FROM faculty
    WHERE id = ?
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => true,
        "data" => $row
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Faculty not found"
    ]);
}
?>