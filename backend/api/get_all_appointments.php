<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// Acceptăm doar POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid method"]);
    exit;
}

// Preluăm barber_id (POST JSON sau form-data)
$input = json_decode(file_get_contents("php://input"), true);

$barber_id = $input["barber_id"] ?? null;

// Validare minimă
$barber_id = (int)$barber_id; 
if ($barber_id <= 0) {
    echo json_encode(["error" => "Missing or invalid barber_id"]);
    exit;
}

try {
    // Preluăm DOAR datele din tabelul nou
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
