<?php

include "db.php";

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}

echo "Database Connected Successfully!";

?>