<?php
// Permite accesul din frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// ✅ Include conexiunea la baza de date
require_once "../config/db.php"; // ajustează calea dacă e nevoie

try {
    // ✅ Data de azi
    $today = date("Y-m-d");

    // ✅ Șterge toate programările cu dată mai mică decât azi
    $stmt = $conn->prepare("DELETE FROM appointments WHERE date < CURDATE()");
    $stmt->execute();

    // ✅ Câte rânduri s-au șters
    $deleted = $stmt->rowCount();

    // ✅ Returnează răspuns JSON
    echo json_encode([
        "success" => true,
        "message" => "✅ Programările vechi au fost șterse automat.",
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
