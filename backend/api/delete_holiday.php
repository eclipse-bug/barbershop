<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

$root = dirname(__DIR__);
require_once "../config/db.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$barber_id = $data["barber_id"] ?? null;
$date = $data["date"] ?? null;

if (!$barber_id || !$date) {
  echo json_encode(["success" => false, "error" => "Missing parameters"]);
  exit;
}

try {
  $stmt = $conn->prepare("DELETE FROM holidays WHERE barber_id = :barber_id AND date = :date");
  $stmt->bindParam(":barber_id", $barber_id, PDO::PARAM_INT);
  $stmt->bindParam(":date", $date);
  $stmt->execute();

  echo json_encode(["success" => true, "deleted" => $date]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
