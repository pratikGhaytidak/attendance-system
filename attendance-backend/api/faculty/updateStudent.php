<?php
include("../cors.php");
include "../db.php";

header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = trim($data['name'] ?? "");
$email = trim($data['email'] ?? "");
$roll_no = trim($data['roll_no'] ?? "");
$password = $data['password'] ?? "";
$year = $data['year'] ?? "";
$batch = $data['batch'] ?? "";
$department_id = isset($data['department_id']) ? (int)$data['department_id'] : null;

/* Field-wise validation */
if (!$id) {
    echo json_encode([
        "status" => false,
        "message" => "Student ID is required"
    ]);
    exit;
}

if ($name === "") {
    echo json_encode([
        "status" => false,
        "message" => "Name is required"
    ]);
    exit;
}

if ($email === "") {
    echo json_encode([
        "status" => false,
        "message" => "Email is required"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid email format"
    ]);
    exit;
}

if ($roll_no === "") {
    echo json_encode([
        "status" => false,
        "message" => "Roll number is required"
    ]);
    exit;
}

if ($year === "" || $year === null) {
    echo json_encode([
        "status" => false,
        "message" => "Year is required"
    ]);
    exit;
}

if ($batch === "" || $batch === null) {
    echo json_encode([
        "status" => false,
        "message" => "Batch is required"
    ]);
    exit;
}

if (!$department_id) {
    echo json_encode([
        "status" => false,
        "message" => "Department is required"
    ]);
    exit;
}

try {
    if (trim($password) !== "") {
        $stmt = $conn->prepare("
            UPDATE students
            SET name=?, email=?, roll_no=?, password=?, year=?, batch=?, department_id=?
            WHERE id=?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param(
            "ssssisii",
            $name,
            $email,
            $roll_no,
            $password,
            $year,
            $batch,
            $department_id,
            $id
        );
    } else {
        $stmt = $conn->prepare("
            UPDATE students
            SET name=?, email=?, roll_no=?, year=?, batch=?, department_id=?
            WHERE id=?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param(
            "sssiiii",
            $name,
            $email,
            $roll_no,
            $year,
            $batch,
            $department_id,
            $id
        );
    }

    if ($stmt->execute()) {
        echo json_encode([
            "status" => true,
            "message" => "Student updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Update failed"
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        "status" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>