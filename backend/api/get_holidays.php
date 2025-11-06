<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$root = dirname(__DIR__);
require_once "../config/db.php";
$barber_id = $_GET["barber_id"] ?? null;

if (!$barber_id) {
  echo json_encode(["success" => false, "error" => "Missing barber_id"]);
  exit;
}

try {
  $stmt = $conn->prepare("SELECT date FROM holidays WHERE barber_id = :barber_id ORDER BY date ASC");
  $stmt->bindParam(":barber_id", $barber_id, PDO::PARAM_INT);
  $stmt->execute();
  $holidays = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(["success" => true, "holidays" => $holidays]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
