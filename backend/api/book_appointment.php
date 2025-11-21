<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Metodă invalidă."]);
    exit;
}

// 🧾 Preluăm datele din formular
$client_nume     = trim($_POST["nume"] ?? "");
$client_prenume  = trim($_POST["prenume"] ?? "");
$client_telefon  = trim($_POST["telefon"] ?? "");
$service         = trim($_POST["service"] ?? "");
$date            = trim($_POST["date"] ?? "");
$time            = trim($_POST["time"] ?? "");
$barber_id       = $_POST["barber_id"] ?? null;

// 🔒 Validare minimă
if (!$client_nume || !$client_telefon || !$service || !$date || !$time || !$barber_id) {
    echo json_encode(["error" => "Completează toate câmpurile!"]);
    exit;
}

try {
    // ⚠️ Verificăm dacă ora principală este deja ocupată
    $stmt = $conn->prepare("
        SELECT COUNT(*) 
        FROM appointments 
        WHERE barber_id = ? AND date = ? AND time = ?
    ");
    $stmt->execute([$barber_id, $date, $time]);
    $exists = $stmt->fetchColumn();

    if ($exists > 0) {
        echo json_encode(["error" => "Ora selectată este deja ocupată!"]);
        exit;
    }

    // 🔥 Determinăm durata în funcție de serviciu
    $duration = 35; // implicit pentru Tuns sau Barbă
    
    // Verificăm dacă e Denis (interval de 40 minute)
    $stmtBarber = $conn->prepare("SELECT nume FROM barbers WHERE id = ?");
    $stmtBarber->execute([$barber_id]);
    $barberData = $stmtBarber->fetch(PDO::FETCH_ASSOC);
    
    if ($barberData && stripos($barberData['nume'], 'denis') !== false) {
        $duration = 40;
    }
    
    if ($service === "Tuns + Barbă") {
        $duration = $duration * 2; // dublăm durata
    }

    // ✅ Inserăm programarea cu durata corectă
    $stmt = $conn->prepare("
        INSERT INTO appointments (nume, telefon, client_nume, client_prenume, client_telefon, service, date, time, barber_id, duration)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$client_nume, $client_telefon, $client_nume, $client_prenume, $client_telefon, $service, $date, $time, $barber_id, $duration]);

    echo json_encode([
        "success" => true,
        "message" => "✅ Programarea a fost înregistrată cu succes!"
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Eroare DB: " . $e->getMessage()]);
}
?>