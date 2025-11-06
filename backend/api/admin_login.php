<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// Pentru requesturile OPTIONS (CORS preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$telefon = trim($_POST['telefon'] ?? '');
$cod_acces = trim($_POST['cod_acces'] ?? '');

if (!$telefon || !$cod_acces) {
    echo json_encode(["success" => false, "error" => "Lipsește telefonul sau codul de acces."]);
    exit;
}

// 🔐 Selectăm doar adminul care are numărul respectiv
$stmt = $conn->prepare("SELECT id, nume, prenume, telefon, cod_acces FROM admins WHERE telefon = ?");
$stmt->execute([$telefon]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
    echo json_encode(["success" => false, "error" => "Adminul nu există în baza de date."]);
    exit;
}

// 🔑 Verificăm codul de acces (criptat în baza de date)
if (!password_verify($cod_acces, $admin["cod_acces"])) {
    echo json_encode(["success" => false, "error" => "Cod de acces incorect."]);
    exit;
}

// ✅ Autentificare reușită
echo json_encode([
    "success" => true,
    "admin" => [
        "id" => $admin["id"],
        "nume" => $admin["nume"],
        "prenume" => $admin["prenume"],
        "telefon" => $admin["telefon"],
        "isAdmin" => true
    ]
]);
?>
