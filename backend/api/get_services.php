<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";


ini_set("display_errors", 0);
error_reporting(E_ALL);

try {
    if (!$conn) {
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed."
        ]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, price, duration FROM services");
    $stmt->execute();

    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "services" => $services
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "error" => "Database error."
    ]);
    
}
