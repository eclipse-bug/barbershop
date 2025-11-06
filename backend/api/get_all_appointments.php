<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

$barber_id = $_GET["barber_id"] ?? null;

if (!$barber_id) {
    echo json_encode(["error" => "Missing barber_id"]);
    exit;
}

try {
    // 🔹 Preluăm DOAR datele din tabelul nou
    $stmt = $conn->prepare("
        SELECT 
            id, 
            nume, 
            telefon, 
            service, 
            date, 
            time, 
            created_at, 
            barber_id
        FROM simple_appointments
        WHERE barber_id = ?
        ORDER BY date ASC, time ASC
    ");
    $stmt->execute([$barber_id]);
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($appointments);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
