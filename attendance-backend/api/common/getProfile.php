<?php
include "../db.php";
include "../cors.php";

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get email from URL
$email = $_GET['email'] ?? "";

// Validation
if (!$email) {
    echo json_encode([
        "status" => false,
        "message" => "Email is required"
    ]);
    exit();
}

/* =========================
   CHECK STUDENT TABLE
   ========================= */
$stmt = $conn->prepare("
    SELECT 
        s.id,
        s.name,
        s.email,
        s.password,
        s.practicalBatch,
        s.year,
        d.name AS department,
        CASE 
            WHEN s.student_image IS NOT NULL AND s.student_image != '' 
            THEN CONCAT('student_images/', s.student_image)
            ELSE NULL
        END AS profile_image,
        'student' AS role
    FROM students s
    LEFT JOIN departments d ON s.department_id = d.id
    WHERE s.email = ?
");

if (!$stmt) {
    die("Student query failed: " . $conn->error);
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => true,
        "data" => $result->fetch_assoc()
    ]);
    exit();
}

/* =========================
   CHECK FACULTY / HOD / PRINCIPAL
   ========================= */
$stmt = $conn->prepare("
    SELECT 
        f.id,
        f.name,
        f.email,
        d.name AS department,
        CASE 
            WHEN f.faculty_image IS NOT NULL AND f.faculty_image != '' 
            THEN CONCAT('student_images/', f.faculty_image)
            ELSE NULL
        END AS profile_image,
        f.role
    FROM faculty f
    LEFT JOIN departments d ON f.department_id = d.id
    WHERE f.email = ?
");

if (!$stmt) {
    die("Faculty query failed: " . $conn->error);
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => true,
        "data" => $result->fetch_assoc()
    ]);
    exit();
}

/* =========================
   CHECK ADMIN
   ========================= */
$stmt = $conn->prepare("
    SELECT 
        id,
        name,
        email,
        NULL AS profile_image,
        'admin' AS role
    FROM admin
    WHERE email = ?
");

if (!$stmt) {
    die("Admin query failed: " . $conn->error);
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => true,
        "data" => $result->fetch_assoc()
    ]);
    exit();
}

/* =========================
   USER NOT FOUND
   ========================= */
echo json_encode([
    "status" => false,
    "message" => "User not found"
]);

$conn->close();
?>