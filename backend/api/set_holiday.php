<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


require_once "../config/db.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit;

$data = json_decode(file_get_contents("php://input"), true);
$barber_id = intval($data["barber_id"] ?? 0);
$date = $data["date"] ?? "";

$stmt = $conn->prepare("INSERT INTO holidays (barber_id, date) VALUES (:id, :date)");
$stmt->bindValue(":id", $barber_id);
$stmt->bindValue(":date", $date);

try {
    $stmt->execute();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Există deja această zi liberă."]);
}
