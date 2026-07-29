<?php

include("../cors.php");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include "../db.php";

// Debug ON (IMPORTANT)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid or empty JSON"
    ]);
    exit;
}

$response = [];
$inserted = 0;
$total = count($data);

foreach ($data as $attendance) {

    $student_id = $attendance->student_id ?? null;
    $subject_id = $attendance->subject_id ?? null;
    $faculty_id = $attendance->faculty_id ?? null;
    $date = $attendance->date ?? null;
    $status = $attendance->status ?? null;

    if (!$student_id || !$subject_id || !$faculty_id || !$date || !$status) {
        $response[] = [
            "student_id" => $student_id,
            "status" => "skipped",
            "reason" => "missing data"
        ];
        continue;
    }

    $sql = "INSERT INTO attendance 
            (student_id, subject_id, faculty_id, date, status)
            VALUES 
            ('$student_id','$subject_id','$faculty_id','$date','$status')";

    if ($conn->query($sql) === TRUE) {
        $inserted++;
        $response[] = [
            "student_id" => $student_id,
            "status" => "inserted"
        ];
    } else {
        $response[] = [
            "student_id" => $student_id,
            "status" => "error",
            "error" => $conn->error
        ];
    }
}

// ✅ FINAL RESPONSE
echo json_encode([
    "status" => $inserted > 0 ? "success" : "error",
    "inserted" => $inserted,
    "total" => $total,
    "data" => $response
]);
?>