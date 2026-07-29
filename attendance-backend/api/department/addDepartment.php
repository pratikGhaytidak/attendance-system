<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->id;
$name = $data->name;

$sql = "INSERT INTO departments (id,name) VALUES ('$id','$name')";

if ($conn->query($sql) === TRUE)
    {
        echo json_encode(["status"=>"success"]);
    }
else{
    echo json_encode(["error"=>"Eroor" ]);
}
?>