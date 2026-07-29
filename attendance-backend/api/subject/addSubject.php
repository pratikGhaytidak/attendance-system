<?php 
include "../db.php";

$data = json_decode(file_get_contents("php://input"));
$name = $data->name;
$department_id = $data->department_id;
$year = $data->year;
$type = $data->type;
$semester = $data->semester;
$course_code = $data->course_code;

$sql = "INSERT INTO subjects (name,department_id,year,type,semester,course_code) 
        VALUES 
        ('$name','$department_id','$year','$type','$semester','$course_code')";

if($conn->query($sql) === TRUE)
    {
        echo json_encode(["status"=>"success"]);
    }
else{
     echo json_encode(["status"=>"success", "error"=>$conn->error]);
}
?>