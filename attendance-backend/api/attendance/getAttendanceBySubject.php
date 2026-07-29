<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../db.php";
include "../cors.php";

/* Get subject_id from URL */
$subject_id = $_GET['subject_id'] ?? "";

/* Validation */
if (!$subject_id) {
    echo json_encode([
        "status" => false,
        "message" => "Subject ID is required"
    ]);
    exit();
}

/* Query */
$sql = "
SELECT 
    a.id,
    a.student_id,
    st.name AS student_name,
    st.roll_no,
    a.subject_id,
    s.name AS subject_name,
    a.faculty_id,
    f.name AS faculty_name,
    a.date,
    a.status
FROM attendance a
JOIN students st ON a.student_id = st.id
JOIN subjects s ON a.subject_id = s.id
JOIN faculty f ON a.faculty_id = f.id
WHERE a.subject_id = ?
ORDER BY a.date DESC, st.roll_no ASC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Query failed",
        "error" => $conn->error
    ]);
    exit();
}

$stmt->bind_param("i", $subject_id);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

/* Response */
echo json_encode([
    "status" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();
?>