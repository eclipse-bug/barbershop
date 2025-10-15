<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"]) || !isset($data["date"]) || !isset($data["time"])) {
  echo json_encode(["success" => false, "error" => "Date incomplete."]);
  exit;
}

$id = $data["id"];
$date = $data["date"];
$time = $data["time"];

try {
  $stmt = $conn->prepare("UPDATE appointments SET date = ?, time = ? WHERE id = ?");
  $stmt->execute([$date, $time, $id]);
  echo json_encode(["success" => true]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
