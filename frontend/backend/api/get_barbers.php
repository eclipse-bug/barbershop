<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

try {
    $stmt = $conn->query("SELECT id, nume, specializare, imagine FROM barbers ORDER BY nume ASC");
    $barbers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$barbers) {
        echo json_encode(["error" => "Nu există frizeri în baza de date."]);
        exit;
    }

    echo json_encode($barbers);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
