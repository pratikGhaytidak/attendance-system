<?php
include __DIR__ . "/db.php";

$token = $_GET['token'] ?? '';

if ($token == '') {
    die("❌ Token missing");
}

$res = mysqli_query($conn, "
    SELECT * FROM password_resets 
    WHERE token='$token'
");

if (!$res || mysqli_num_rows($res) == 0) {
    die("❌ Invalid token");
}

$data = mysqli_fetch_assoc($res);

/* expiry check */
if ($data['expires_at'] < date("Y-m-d H:i:s")) {
    die("❌ Link expired");
}

$email = $data['email'];
?>

<h2>Reset Password</h2>

<form method="POST" action="/attendance_system/api/common/updatePassword.php">
    <input type="hidden" name="email" value="<?php echo $email; ?>">

    <input type="password" name="password" required>

    <button type="submit">Update Password</button>
</form>