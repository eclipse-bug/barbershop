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

// Citim datele din $_POST
$telefon = $_POST['telefon'] ?? '';

if (empty($telefon)) {
    echo json_encode(["success" => false, "error" => "Număr de telefon lipsă"]);
    exit;
}

// Normalizează telefonul
$telefon = preg_replace('/[\s()-]/', '', $telefon);
if (preg_match('/^0\d{8}$/', $telefon)) {
    $telefon = "+373" . substr($telefon, 1);
}

// Caută utilizatorul
$stmt = $conn->prepare("SELECT * FROM clients WHERE telefon = ?");
$stmt->execute([$telefon]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user["id"],
            "nume" => $user["nume"],
            "prenume" => $user["prenume"],
            "telefon" => $user["telefon"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Număr de telefon inexistent"]);
}
?>
