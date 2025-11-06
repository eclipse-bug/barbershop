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
    // 🔹 verificăm dacă este admin (Denis sau Danu)
    $isAdmin = in_array($barber_id, [1, 2]);

    if ($isAdmin) {
        // 🔹 adminul vede toate programările + nume & telefon client
        $stmt = $conn->query("
            SELECT 
                a.id,
                a.nume AS client_nume,
                a.telefon AS client_telefon,
                a.service,
                a.date,
                a.time,
                a.created_at,
                b.nume AS barber_name
            FROM appointments a
            LEFT JOIN barbers b ON a.barber_id = b.id
            ORDER BY a.date ASC, a.time ASC
        ");
    } else {
        // 🔹 frizerul normal vede doar programările sale + nume & telefon client
        $stmt = $conn->prepare("
            SELECT 
                a.id,
                a.nume AS client_nume,
                a.telefon AS client_telefon,
                a.service,
                a.date,
                a.time,
                a.created_at,
                b.nume AS barber_name
            FROM appointments a
            LEFT JOIN barbers b ON a.barber_id = b.id
            WHERE a.barber_id = ?
            ORDER BY a.date ASC, a.time ASC
        ");
        $stmt->execute([$barber_id]);
    }

    $appointments = $isAdmin
        ? $stmt->fetchAll(PDO::FETCH_ASSOC)
        : $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "appointments" => $appointments
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
