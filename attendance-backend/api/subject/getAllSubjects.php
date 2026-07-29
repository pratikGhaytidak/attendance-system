<?php 
include "../db.php";
$sql = "SELECT * FROM subjects";
$result = $conn->query($sql);
$data = [];
while($row = $result->fetch_assoc())
    {
        $data[] = $row;
    }
echo json_encode($data);
?>