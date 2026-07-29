<?php
include("../cors.php");
include("../db.php");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = trim($data['name'] ?? "");
$email = trim($data['email'] ?? "");
$role = trim($data['role'] ?? "");

if (!$id || !$name || !$email || !$role) {
    echo json_encode([
        "status" => false,
        "message" => "Required fields missing"
    ]);
    exit;
}

// If student -> students table
if ($role == "student") {

    $stmt = $conn->prepare("UPDATE students SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $id);

} 
// All others -> faculty table
else {

    $stmt = $conn->prepare("UPDATE faculty SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $id);
}

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Profile updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Update failed"
    ]);
}
?>