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
$nume        = trim($_POST["nume"] ?? "");
$telefon     = trim($_POST["telefon"] ?? "");
$service     = trim($_POST["service"] ?? "");
$date        = trim($_POST["date"] ?? "");
$time        = trim($_POST["time"] ?? "");
$barber_id   = $_POST["barber_id"] ?? null;
$extra_time  = trim($_POST["extra_time"] ?? ""); // 🟡 adăugat pentru Tuns + Barbă

// 🔒 Validare minimă
if (!$nume || !$telefon || !$service || !$date || !$time || !$barber_id) {
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

    // ⚠️ Verificăm și extra_time dacă e trimis
    if (!empty($extra_time)) {
        $stmt = $conn->prepare("
            SELECT COUNT(*) 
            FROM appointments 
            WHERE barber_id = ? AND date = ? AND time = ?
        ");
        $stmt->execute([$barber_id, $date, $extra_time]);
        $exists2 = $stmt->fetchColumn();

        if ($exists2 > 0) {
            echo json_encode(["error" => "Unul dintre intervale este deja ocupat!"]);
            exit;
        }
    }

    // ✅ Inserăm prima oră
    $stmt = $conn->prepare("
        INSERT INTO appointments (client_id, nume, telefon, service, date, time, barber_id)
        VALUES (NULL, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$nume, $telefon, $service, $date, $time, $barber_id]);

    // ✅ Dacă e Tuns + Barbă, inserăm și următoarea oră
    if (!empty($extra_time)) {
        $stmt2 = $conn->prepare("
            INSERT INTO appointments (client_id, nume, telefon, service, date, time, barber_id)
            VALUES (NULL, ?, ?, ?, ?, ?, ?)
        ");
        $stmt2->execute([$nume, $telefon, $service, $date, $extra_time, $barber_id]);
    }

    echo json_encode([
        "success" => true,
        "message" => "✅ Programarea a fost înregistrată cu succes!"
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Eroare DB: " . $e->getMessage()]);
}
?>
