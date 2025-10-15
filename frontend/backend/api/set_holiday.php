<?php
// ---------------------------
// HEADERS
// ---------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// ---------------------------
// CONEXIUNE LA BD
// ---------------------------
$root = dirname(__DIR__); // urcă un nivel (din /api în /backend)
require_once "../config/db.php";

// ---------------------------
// CITIREA DATELOR
// ---------------------------
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  echo json_encode(["success" => false, "error" => "Invalid JSON body"]);
  exit;
}

$barber_id = $data["barber_id"] ?? null;
$date = $data["date"] ?? null;

if (!$barber_id || !$date) {
  echo json_encode(["success" => false, "error" => "Missing barber_id or date"]);
  exit;
}

// ---------------------------
// CREARE TABEL DACĂ NU EXISTĂ
// ---------------------------
try {
  $conn->exec("CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barber_id INT NOT NULL,
    date DATE NOT NULL,
    UNIQUE KEY unique_barber_date (barber_id, date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
} catch (PDOException $e) {
  echo json_encode(["success" => false, "error" => "Table creation failed: " . $e->getMessage()]);
  exit;
}

// ---------------------------
// INSERARE ZI LIBERĂ
// ---------------------------
try {
  $stmt = $conn->prepare("INSERT IGNORE INTO holidays (barber_id, date) VALUES (:barber_id, :date)");
  $stmt->bindParam(":barber_id", $barber_id, PDO::PARAM_INT);
  $stmt->bindParam(":date", $date);
  $stmt->execute();

  echo json_encode(["success" => true, "date" => $date]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
