<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$telefon = $_POST['telefon'] ?? '';
$cod_acces = $_POST['cod_acces'] ?? '';

if (!$telefon || !$cod_acces) {
    echo json_encode(["success" => false, "error" => "Lipsește telefonul sau codul de acces."]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM admins WHERE telefon = ?");
$stmt->execute([$telefon]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin && $admin['cod_acces'] === $cod_acces) {
    echo json_encode([
        "success" => true,
        "admin" => [
            "id" => $admin["id"],
            "nume" => $admin["nume"],
            "prenume" => $admin["prenume"],
            "telefon" => $admin["telefon"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Date de autentificare invalide."]);
}
?>
