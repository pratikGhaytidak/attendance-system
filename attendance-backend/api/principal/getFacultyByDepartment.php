<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");


include "../db.php";

// 🔹 Get status from URL (active / inactive)
$status = isset($_GET['status']) ? $_GET['status'] : 'active';

// 🔹 Query
$sql = "
    SELECT 
        f.id,
        f.name,
        f.email,
        f.status,
        f.role,
        d.name AS department_name
    FROM faculty f
    LEFT JOIN departments d ON f.department_id = d.id
    WHERE f.status = ?
    ORDER BY d.name ASC, f.name ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $status);
$stmt->execute();

$result = $stmt->get_result();

$faculty = [];

while ($row = $result->fetch_assoc()) {
    $faculty[] = $row;
}

// 🔹 Response
echo json_encode([
    "success" => true,
    "status" => $status,
    "count" => count($faculty),
    "data" => $faculty
]);

$stmt->close();
$conn->close();
?>
