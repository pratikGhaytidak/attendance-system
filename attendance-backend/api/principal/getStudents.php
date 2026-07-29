<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../db.php";

// 🔹 Get filters
$department_id = isset($_GET['department_id']) ? $_GET['department_id'] : null;
$year = isset($_GET['year']) ? $_GET['year'] : null;

// 🔹 Base query
$sql = "
    SELECT 
        s.id,
        s.name,
        s.roll_no,
        s.year,
        s.batch,
        d.name AS department_name
    FROM students s
    LEFT JOIN departments d ON s.department_id = d.id
    WHERE 1=1
";

// 🔹 Apply filters
$params = [];
$types = "";

if ($department_id) {
    $sql .= " AND s.department_id = ?";
    $params[] = $department_id;
    $types .= "i";
}

if ($year) {
    $sql .= " AND s.year = ?";
    $params[] = $year;
    $types .= "s";
}

$sql .= " ORDER BY d.name ASC, s.year ASC, s.name ASC";

// 🔹 Prepare
$stmt = $conn->prepare($sql);

// 🔹 Bind params if exist
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

// 🔹 Response
echo json_encode([
    "success" => true,
    "count" => count($students),
    "data" => $students
]);

$stmt->close();
$conn->close();
?>
