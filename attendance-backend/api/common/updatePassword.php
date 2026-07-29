<?php

include("../db.php");

$email = $_POST['email'];
$password =$password = $_POST['password'];

/* UPDATE ALL TABLES */
mysqli_query($conn, "UPDATE students SET password='$password' WHERE email='$email'");
mysqli_query($conn, "UPDATE faculty SET password='$password' WHERE email='$email'");
mysqli_query($conn, "UPDATE admin SET password='$password' WHERE email='$email'");

/* DELETE TOKEN */
mysqli_query($conn, "DELETE FROM password_resets WHERE email='$email'");

echo "✅ Password updated successfully. You can now login.";
?>