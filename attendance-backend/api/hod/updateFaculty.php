<?php
include("../cors.php");
include "../db.php";

header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? "";
$role = $data['role'] ?? null;
$department_id = isset($data['department_id']) ? (int)$data['department_id'] : null;
$status = $data['status'] ?? null;

if (!$id || !$name || !$email || !$role || !$department_id || !$status) {
    echo json_encode([
        "status" => false,
        "message" => "All fields except password are required"
    ]);
    exit;
}

try {
    $conn->begin_transaction();

    // 1. Get old faculty data
    $oldStmt = $conn->prepare("SELECT role, department_id FROM faculty WHERE id = ?");
    if (!$oldStmt) {
        throw new Exception($conn->error);
    }

    $oldStmt->bind_param("i", $id);
    $oldStmt->execute();
    $oldResult = $oldStmt->get_result();

    if ($oldResult->num_rows === 0) {
        throw new Exception("Faculty not found");
    }

    $oldData = $oldResult->fetch_assoc();
    $oldRole = $oldData['role'];
    $oldDepartmentId = (int)$oldData['department_id'];

    // 2. If this department already has another HOD and current user is becoming HOD,
    // change previous HOD role back to faculty
    if ($role === "hod") {
        $deptStmt = $conn->prepare("SELECT hod_id FROM departments WHERE id = ?");
        if (!$deptStmt) {
            throw new Exception($conn->error);
        }

        $deptStmt->bind_param("i", $department_id);
        $deptStmt->execute();
        $deptResult = $deptStmt->get_result();

        if ($deptResult->num_rows === 0) {
            throw new Exception("Department not found");
        }

        $deptData = $deptResult->fetch_assoc();
        $existingHodId = $deptData['hod_id'];

        if (!empty($existingHodId) && (int)$existingHodId !== (int)$id) {
            $makeOldFaculty = $conn->prepare("UPDATE faculty SET role = 'faculty' WHERE id = ?");
            if (!$makeOldFaculty) {
                throw new Exception($conn->error);
            }

            $makeOldFaculty->bind_param("i", $existingHodId);
            if (!$makeOldFaculty->execute()) {
                throw new Exception($makeOldFaculty->error);
            }
        }
    }

    // 3. Update faculty table
    if (isset($password) && trim($password) !== "") {
        $stmt = $conn->prepare("
            UPDATE faculty 
            SET name=?, email=?, password=?, role=?, department_id=?, status=? 
            WHERE id=?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param(
            "ssssisi",
            $name,
            $email,
            $password,
            $role,
            $department_id,
            $status,
            $id
        );
    } else {
        $stmt = $conn->prepare("
            UPDATE faculty 
            SET name=?, email=?, role=?, department_id=?, status=? 
            WHERE id=?
        ");

        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param(
            "sssisi",
            $name,
            $email,
            $role,
            $department_id,
            $status,
            $id
        );
    }

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    // 4. If old role was hod, remove this faculty from any department HOD mapping first
    if ($oldRole === "hod") {
        $removeOldHod = $conn->prepare("UPDATE departments SET hod_id = NULL WHERE hod_id = ?");
        if (!$removeOldHod) {
            throw new Exception($conn->error);
        }

        $removeOldHod->bind_param("i", $id);
        if (!$removeOldHod->execute()) {
            throw new Exception($removeOldHod->error);
        }
    }

    // 5. If new role is hod, assign as HOD of selected department
    if ($role === "hod") {
        $assignHod = $conn->prepare("UPDATE departments SET hod_id = ? WHERE id = ?");
        if (!$assignHod) {
            throw new Exception($conn->error);
        }

        $assignHod->bind_param("ii", $id, $department_id);
        if (!$assignHod->execute()) {
            throw new Exception($assignHod->error);
        }
    }

    $conn->commit();

    echo json_encode([
        "status" => true,
        "message" => "Faculty updated successfully"
    ]);

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode([
        "status" => false,
        "message" => "Update failed",
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>