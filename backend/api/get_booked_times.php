<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// acceptăm doar POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid method"]);
    exit;
}

// citim JSON trimis de frontend
$input = json_decode(file_get_contents("php://input"), true);

// extragem parametrii
$date = $input['date'] ?? '';
$barber_id = $input['barber_id'] ?? '';

// validare minimă
$date = trim($date);
$barber_id = (int)$barber_id;

if (!$date || $barber_id <= 0) {
    echo json_encode([]);
    exit;
}

try {
    // selectăm orele ocupate pentru frizerul selectat
    $stmt = $conn->prepare("
        SELECT TIME_FORMAT(time, '%H:%i') AS time
        FROM appointments
        WHERE date = ? AND barber_id = ?
    ");
    $stmt->execute([$date, $barber_id]);
    $booked = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($booked);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
