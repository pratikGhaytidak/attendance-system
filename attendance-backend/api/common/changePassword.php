<?php
include("../db.php");
include("../cors.php");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? "";
$current = $data['current_password'] ?? "";
$new = $data['new_password'] ?? "";
$role = $data['role'] ?? "";

if (empty($email) || empty($current) || empty($new) || empty($role)) {
    echo json_encode([
        "status" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

if ($role == "student") {
    $sql = "SELECT * FROM students WHERE email=? AND password=?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "status" => false,
            "message" => "Prepare failed: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("ss", $email, $current);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $update = $conn->prepare("UPDATE students SET password=? WHERE email=?");

        if (!$update) {
            echo json_encode([
                "status" => false,
                "message" => "Update prepare failed: " . $conn->error
            ]);
            exit;
        }

        $update->bind_param("ss", $new, $email);

        if ($update->execute()) {
            echo json_encode([
                "status" => true,
                "message" => "Password Updated Successfully"
            ]);
        } else {
            echo json_encode([
                "status" => false,
                "message" => "Failed to update password"
            ]);
        }
        exit;
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Current Password Wrong or user not found in student"
        ]);
        exit;
    }

} else if ($role == "faculty" || $role == "hod" || $role == "principal") {
    $sql = "SELECT * FROM faculty WHERE email=? AND password=?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "status" => false,
            "message" => "Prepare failed: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("ss", $email, $current);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $update = $conn->prepare("UPDATE faculty SET password=? WHERE email=?");

        if (!$update) {
            echo json_encode([
                "status" => false,
                "message" => "Update prepare failed: " . $conn->error
            ]);
            exit;
        }

        $update->bind_param("ss", $new, $email);

        if ($update->execute()) {
            echo json_encode([
                "status" => true,
                "message" => "Password Updated Successfully"
            ]);
        } else {
            echo json_encode([
                "status" => false,
                "message" => "Failed to update password"
            ]);
        }
        exit;
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Current Password Wrong or user not found in faculty"
        ]);
        exit;
    }

} else {
    echo json_encode([
        "status" => false,
        "message" => "Invalid role"
    ]);
    exit;
}
?>