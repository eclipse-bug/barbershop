<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once "../config/db.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);


$stmt = $conn->query("SELECT id, name, price, duration FROM services");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
