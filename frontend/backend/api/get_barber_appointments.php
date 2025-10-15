<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

// verificăm dacă avem ID de barber
$barber_id = $_GET['barber_id'] ?? '';

if (!$barber_id) {
    echo json_encode(["error" => "Missing barber_id"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            a.id,
            a.date,
            a.time,
            a.service,
            c.prenume AS client_prenume,
            c.nume AS client_nume,
            c.telefon AS client_telefon
        FROM appointments a
        JOIN clients c ON c.id = a.client_id
        WHERE a.barber_id = ?
        ORDER BY a.date DESC, a.time ASC
    ");
    $stmt->execute([$barber_id]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "appointments" => $appointments]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
