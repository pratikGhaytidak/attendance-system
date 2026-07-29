<?php

include("../cors.php");
// handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../db.php";

// rest of your code...
$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

// 1. Check Admin
$sql = "SELECT * FROM admin WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    echo json_encode(["status" => "success", "role" => "admin"]);
    exit();
}

// 2. Check Faculty
// $sql = "SELECT * FROM faculty WHERE email='$email' AND password='$password'";
// $result = $conn->query($sql);
// if ($result->num_rows > 0) {
//     $row = $result->fetch_assoc();
//     echo json_encode(["status" => "success",
//                     "role" => "faculty",
//                     "name" => $row['name'],
//                     "faculty_id" => $row['id']
//                     ]);
//     exit();
// }

// 2. Check Faculty / HOD / Principal
// $sql = "SELECT * FROM faculty WHERE email='$email' AND password='$password'";
// $result = $conn->query($sql);

// if ($result->num_rows > 0) {
//     $row = $result->fetch_assoc();

//     echo json_encode([
//         "status" => "success",
//         "role" => $row['role'],  
//         "name" => $row['name'],
//         "faculty_id" => $row['id']
//     ]);
//     exit();
// }

//faculty
$sql = "SELECT * FROM faculty WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    $response = [
        "status" => "success",
        "role" => $row['role'],
        "name" => $row['name'],
        "faculty_id" => $row['id'],
        "email" => $row['email']
    ];

    // ✅ If HOD, fetch department
    if ($row['role'] == 'hod') {
        $faculty_id = $row['id'];

        $deptQuery = "SELECT id,name FROM departments WHERE hod_id = '$faculty_id'";
        $deptResult = $conn->query($deptQuery);

        if ($deptResult->num_rows > 0) {
            $dept = $deptResult->fetch_assoc();
            $response["department_id"] = $dept['id'];
            $response["department_name"] = $dept['name'];
            $response["email"] = $row['email'];
            // $response = [
            //     "department_id" => $dept['id'],
            //     "departmrnt_name" => $dept['name']
            // ];
        } else {
            $response["department_id"] = null;
        }
    }

    echo json_encode($response);
    exit();
}

// 3. Check Student
$sql = "SELECT * FROM students WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response = [
        "status" => "success",
        "role" => "student",
        "id" => $row['id'],
        "name" => $row['name'],
        "email" => $row['email']
    ];
    echo json_encode($response);
    exit();
}

echo json_encode(["status" => "error"]);


$conn->close();
?>