<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$date = $_GET['date'] ?? '';
$barber_id = $_GET['barber_id'] ?? '';

if (!$date || !$barber_id) {
    echo json_encode([]);
    exit;
}

try {
    // 🔹 selectăm orele ocupate doar pentru frizerul selectat
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
