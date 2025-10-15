<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

// 🔹 Citim datele direct din $_POST
$nume = $_POST['nume'] ?? '';
$prenume = $_POST['prenume'] ?? '';
$telefon = $_POST['telefon'] ?? '';

// Dacă este GET simplu (nimic trimis), returnăm un mesaj neutru
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Aștept POST de la React"]);
    exit;
}

// Validăm
if (empty($nume) || empty($prenume) || empty($telefon)) {
    echo json_encode(["success" => false, "error" => "Date incomplete"]);
    exit;
}

// 🔹 Normalizează numărul
$telefon = preg_replace('/[\s()-]/', '', $telefon);
if (preg_match('/^0\d{8}$/', $telefon)) {
    $telefon = "+373" . substr($telefon, 1);
}

// 🔹 Verificăm dacă există deja
$stmt = $conn->prepare("SELECT id FROM clients WHERE telefon = ?");
$stmt->execute([$telefon]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "error" => "Număr de telefon deja înregistrat"]);
    exit;
}

// 🔹 Inserăm în baza de date
$stmt = $conn->prepare("INSERT INTO clients (nume, prenume, telefon) VALUES (?, ?, ?)");
$stmt->execute([$nume, $prenume, $telefon]);

echo json_encode(["success" => true]);
?>
