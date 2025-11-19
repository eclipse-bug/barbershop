<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$barber_id = $input["barber_id"] ?? null;
$date = $input["date"] ?? null;

if (!$barber_id || !$date) {
    echo json_encode(["success" => false, "message" => "Date lipsă."]);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM holidays WHERE barber_id = :id AND date = :date");
    $stmt->execute([":id" => $barber_id, ":date" => $date]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Eroare server."]);
}
