<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$stmt = $conn->query("SELECT * FROM appointments ORDER BY date, time");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
?>
