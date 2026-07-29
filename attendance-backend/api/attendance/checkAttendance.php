<?php

include "db.php";

$subject_id = $_GET['subject_id'];
$date = $_GET['date'];

$sql = "SELECT * FROM attendance 
        WHERE subject_id='$subject_id' 
        AND date='$date' 
        LIMIT 1";

$result = $conn->query($sql);

if($result->num_rows > 0){
    echo json_encode(["marked"=>true]);
}else{
    echo json_encode(["marked"=>false]);
}

?>