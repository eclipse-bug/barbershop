<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Include conexiunea la baza de date (PDO)
require_once "../config/db.php"; // ajustează calea dacă fișierul e în alt folder

// ✅ Citim datele primite din React
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Verificăm dacă avem ID
if (!isset($data["id"])) {
  echo json_encode(["success" => false, "error" => "Lipsește ID-ul programării."]);
  exit;
}

$id = intval($data["id"]);

try {
  // ✅ Pregătim și executăm ștergerea
  $stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
  $stmt->execute([$id]);

  // ✅ Verificăm dacă s-a șters ceva efectiv
  if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "deleted_id" => $id]);
  } else {
    echo json_encode(["success" => false, "error" => "Programarea nu a fost găsită."]);
  }
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
