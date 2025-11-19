<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$id = $input["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID lipsă."]);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM appointments WHERE id = :id");
    $stmt->execute([":id" => $id]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Eroare la ștergere."]);
}
