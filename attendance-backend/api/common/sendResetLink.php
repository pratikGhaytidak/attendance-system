<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/* ✅ Composer autoload (IMPORTANT PATH FIX) */
require '../../vendor/autoload.php';

include("../cors.php");
include("../db.php");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';

if($email == ''){
    echo json_encode(["status"=>false, "message"=>"Email required"]);
    exit;
}

/* CHECK USER EXISTS */
$res = mysqli_query($conn, "
    SELECT email FROM students WHERE email='$email'
    UNION
    SELECT email FROM faculty WHERE email='$email'
    UNION
    SELECT email FROM admin WHERE email='$email'
");

if(mysqli_num_rows($res) == 0){
    echo json_encode(["status"=>false, "message"=>"Email not found"]);
    exit;
}

/* GENERATE TOKEN */
$token = bin2hex(random_bytes(32));
$expiry = date("Y-m-d H:i:s", strtotime("+30 minutes"));

/* STORE TOKEN */
mysqli_query($conn, "
    INSERT INTO password_resets(email, token, expires_at)
    VALUES('$email', '$token', '$expiry')
");

/* RESET LINK (IMPORTANT: API PATH) */
$link = "http://192.168.163.183/attendance_system/api/reset-password.php?token=$token";

/* SEND EMAIL */
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $mail->Username = 'rohileprasad675@gmail.com';
    $mail->Password = 'qyec indy quue awuf';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('rohileprasad675@gmail.com', 'Attendance System');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "Reset Password Link";

    $mail->Body = "
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href='$link'>$link</a>
        <p>This link will expire in 30 minutes.</p>
    ";

    $mail->send();

    echo json_encode([
        "status" => true,
        "message" => "Reset link sent"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => false,
        "message" => "Email failed: {$mail->ErrorInfo}"
    ]);
}

?>