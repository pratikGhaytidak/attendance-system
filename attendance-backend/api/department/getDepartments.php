<?php
include("../cors.php");
include "../db.php";

header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(E_ALL);

try {

    $sql = "SELECT id, name, hod_id FROM departments ORDER BY name ASC";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception($conn->error);
    }

    $departments = [];

    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    echo json_encode([
        "status" => true,
        "data" => $departments
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => false,
        "message" => "Failed to fetch departments",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>