<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

require_once "../config/db.php";

// răspuns instant la OPTIONS (preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Doar POST este permis."]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$barber_id = $input["barber_id"] ?? null;

if (!$barber_id || !is_numeric($barber_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "barber_id invalid."]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT id, client_nume, client_prenume, client_telefon, service, date, time 
        FROM appointments
        WHERE barber_id = :barber_id
        ORDER BY date ASC, time ASC
    ");
    $stmt->bindValue(":barber_id", $barber_id, PDO::PARAM_INT);
    $stmt->execute();

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "appointments" => $appointments]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Eroare server."]);
}
