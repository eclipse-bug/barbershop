<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
    exit;
}

// 🧩 Preluăm datele primite
$client_id = $_POST["client_id"] ?? "";
$nume = $_POST["nume"] ?? "";
$telefon = $_POST["telefon"] ?? "";
$service = $_POST["service"] ?? "";
$date = $_POST["date"] ?? "";
$time = $_POST["time"] ?? "";
$barber_id = $_POST["barber_id"] ?? "";

// 🧩 Validăm câmpurile
if (!$client_id || !$nume || !$telefon || !$service || !$date || !$time || !$barber_id) {
    echo json_encode(["success" => false, "error" => "Completează toate câmpurile, inclusiv frizerul."]);
    exit;
}

// 🧩 Verificăm dacă clientul există
$checkClient = $conn->prepare("SELECT COUNT(*) FROM clients WHERE id = ?");
$checkClient->execute([$client_id]);
if (!$checkClient->fetchColumn()) {
    echo json_encode(["success" => false, "error" => "Clientul nu există în baza de date. Reloghează-te!"]);
    exit;
}

// 🧩 Verificăm dacă ziua este concediu
$checkHoliday = $conn->prepare("SELECT COUNT(*) FROM holidays WHERE barber_id = ? AND date = ?");
$checkHoliday->execute([$barber_id, $date]);
$isHoliday = $checkHoliday->fetchColumn();

if ($isHoliday > 0) {
    echo json_encode([
        "success" => false,
        "error" => "Frizerul este în concediu în această zi. Alege altă dată!"
    ]);
    exit;
}

// 🧩 Verificăm dacă ora este deja ocupată
$checkBooked = $conn->prepare("SELECT COUNT(*) FROM appointments WHERE barber_id = ? AND date = ? AND time = ?");
$checkBooked->execute([$barber_id, $date, $time]);
$isBooked = $checkBooked->fetchColumn();

if ($isBooked > 0) {
    echo json_encode([
        "success" => false,
        "error" => "Ora selectată este deja ocupată. Alege altă oră!"
    ]);
    exit;
}

// ✅ Inserăm programarea
try {
    $stmt = $conn->prepare("
        INSERT INTO appointments (client_id, nume, telefon, service, date, time, barber_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$client_id, $nume, $telefon, $service, $date, $time, $barber_id]);

    echo json_encode(["success" => true, "message" => "Programarea a fost salvată cu succes."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
