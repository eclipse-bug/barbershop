<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Include conexiunea la baza de date (PDO)
require_once "../config/db.php"; // ajustează calea după structura ta

try {
  // ✅ Data de azi în format YYYY-MM-DD
  $today = date("Y-m-d");

  // ✅ Pregătim query-ul: șterge tot ce e mai mic decât azi
  $stmt = $conn->prepare("DELETE FROM appointments WHERE date < ?");
  $stmt->execute([$today]);

  // ✅ Verificăm câte rânduri s-au șters
  $deleted = $stmt->rowCount();

  echo json_encode([
    "success" => true,
    "message" => "Programările vechi au fost șterse.",
    "deleted_count" => $deleted,
    "date_today" => $today
  ]);
} catch (Exception $e) {
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}
?>
