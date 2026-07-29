<?php
include("../cors.php");
include "../db.php";

header("Content-Type: application/json");

// 🔥 SHOW ERRORS (for debugging)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 🔥 CATCH FATAL ERRORS
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== NULL) {
        echo json_encode([
            "status" => "error",
            "message" => "Fatal Error: " . $error['message']
        ]);
    }
});

// ---------------- REQUEST CHECK ----------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
    exit();
}

// ---------------- DB CHECK ----------------
if (!$conn) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit();
}

// ---------------- GET DATA ----------------
$name = $_POST['name'] ?? '';
$roll_no = $_POST['roll_no'] ?? '';
$department_id = $_POST['department_id'] ?? '';
$year = $_POST['year'] ?? '';
$batch = $_POST['batch'] ?? '';
$email = $_POST['email'] ?? '';
$faculty_id = $_POST['faculty_id'] ?? null;

// ✅ Plain password (NO HASH)
$password = $_POST['password'] ?? '';

// ---------------- VALIDATION ----------------
if (
    empty($name) ||
    empty($roll_no) ||
    empty($department_id) ||
    empty($year) ||
    empty($password) ||
    empty($email)
) {
    echo json_encode([
        "status" => "error",
        "message" => "Required fields are missing"
    ]);
    exit();
}

// ---------------- DUPLICATE CHECK ----------------
$checkRoll = mysqli_query($conn, "SELECT id FROM students WHERE roll_no='$roll_no'");
if ($checkRoll && mysqli_num_rows($checkRoll) > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Roll number already exists"
    ]);
    exit();
}

// ---------------- IMAGE OPTIONAL ----------------
$student_image_name = null;

if (isset($_FILES['student_image']) && $_FILES['student_image']['error'] === 0) {
    $target_dir = "../../student_images/";

    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $ext = strtolower(pathinfo($_FILES["student_image"]["name"], PATHINFO_EXTENSION));
    $allowed = ["jpg", "jpeg", "png", "gif"];

    if (!in_array($ext, $allowed)) {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid image type"
        ]);
        exit();
    }

    $student_image_name = time() . "." . $ext;
    $target_file = $target_dir . $student_image_name;

    if (!move_uploaded_file($_FILES["student_image"]["tmp_name"], $target_file)) {
        echo json_encode([
            "status" => "error",
            "message" => "Image upload failed"
        ]);
        exit();
    }
}

// ---------------- INSERT ----------------
$sql = "INSERT INTO students 
(name, roll_no, department_id, year, batch, password, email)
VALUES 
('$name', '$roll_no', '$department_id', '$year', '$batch', '$password', '$email')";

if (mysqli_query($conn, $sql)) {
    echo json_encode([
        "status" => "success",
        "message" => "Student added successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "SQL Error: " . mysqli_error($conn)
    ]);
}

exit();
?>