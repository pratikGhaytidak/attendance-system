<?php
include("../cors.php");
include("../db.php");



// ✅ Get ID from GET or POST
$data = json_decode(file_get_contents("php://input"), true);
$id = $_GET['id'] ?? ($data['id'] ?? null);

// ❌ If no ID
if (!$id) {
    echo json_encode([
        "status" => false,
        "message" => "ID required"
    ]);
    exit;
}

// ✅ Soft delete (update status)
$stmt = $conn->prepare("UPDATE faculty SET status='inactive' WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => true,
            "message" => "Faculty deleted successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Faculty not found or already deleted"
        ]);
    }

} else {
    echo json_encode([
        "status" => false,
        "message" => "Delete failed"
    ]);
}
?>