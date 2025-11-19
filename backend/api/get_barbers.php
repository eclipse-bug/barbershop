<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

require_once "../config/db.php";

// 🔒 acceptăm DOAR POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // method not allowed
    echo json_encode([
        "success" => false,
        "message" => "Metoda permisă este POST."
    ]);
    exit;
}

try {
    // 🔐 folosim prepare pentru siguranță
    $stmt = $conn->prepare("SELECT id, nume, specializare, imagine FROM barbers ORDER BY nume ASC");
    $stmt->execute();
    $barbers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$barbers) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Nu există frizeri în baza de date."
        ]);
        exit;
    }

    // ✔ răspuns OK
    echo json_encode([
        "success" => true,
        "data" => $barbers
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Eroare internă de server."
        // "debug" => $e->getMessage() // activezi doar local dacă ai nevoie
    ]);
}
?>
