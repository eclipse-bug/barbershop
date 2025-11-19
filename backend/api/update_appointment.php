  <?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$id = $input["id"] ?? null;
$date = $input["date"] ?? null;
$time = $input["time"] ?? null;

if (!$id || !$date || !$time) {
    echo json_encode(["success" => false, "message" => "Date incomplete."]);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE appointments 
        SET date = :date, time = :time
        WHERE id = :id
    ");
    $stmt->execute([
        ":id" => $id,
        ":date" => $date,
        ":time" => $time
    ]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Eroare la actualizare."]);
}
