<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

// Citește datele din request
$data = json_decode(file_get_contents("php://input"), true);
$telefon = trim($data["telefon"] ?? "");
$adminCode = trim($data["adminCode"] ?? "");

// Lista de admini
$admins = [
    ["id" => 1, "phone" => "060000000", "prenume" => "Denis"],
    ["id" => 2, "phone" => "076784211", "prenume" => "Danu"],
];

// Codul secret
$adminAccessCode = "7UVJ5tNnZYni8fQuazbvElFbZcXx9aTTkBaF1v";

// Verificare telefon
$found = null;
foreach ($admins as $admin) {
    if ($telefon === $admin["phone"]) {
        $found = $admin;
        break;
    }
}

if (!$found) {
    echo json_encode(["success" => false, "message" => "Număr neautorizat!"]);
    exit;
}

// Flag admin
$isAdmin = false;
if ($adminCode === $adminAccessCode) {
    $isAdmin = true;
}

try {
    if ($isAdmin) {
        // Admin: vede toate programările
        $stmt = $conn->query("
            SELECT a.id, a.nume AS client_nume, a.telefon AS client_telefon, a.service,
                   a.date, a.time, a.created_at, b.nume AS barber_name
            FROM appointments a
            LEFT JOIN barbers b ON a.barber_id = b.id
            ORDER BY a.date ASC, a.time ASC
        ");
    } else {
        // Frizer normal: vede doar propriile programări
        $stmt = $conn->prepare("
            SELECT a.id, a.nume AS client_nume, a.telefon AS client_telefon, a.service,
                   a.date, a.time, a.created_at, b.nume AS barber_name
            FROM appointments a
            LEFT JOIN barbers b ON a.barber_id = b.id
            WHERE a.barber_id = :barber_id
            ORDER BY a.date ASC, a.time ASC
        ");
        $stmt->bindValue(":barber_id", $found["id"], PDO::PARAM_INT);
        $stmt->execute();
    }

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $found["id"],
            "prenume" => $found["prenume"],
            "telefon" => $found["phone"],
            "isAdmin" => $isAdmin
        ],
        "appointments" => $appointments
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
