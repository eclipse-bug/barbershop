<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Citește datele din request
$data = json_decode(file_get_contents("php://input"), true);
$telefon = trim($data["telefon"] ?? "");
$adminCode = trim($data["adminCode"] ?? "");

// Lista de admini (doar pe server)
$admins = [
    ["id" => 1, "phone" => "060000000", "prenume" => "Denis"],
    ["id" => 2, "phone" => "076784211", "prenume" => "Danu"],
    ["id" => 3, "phone" => "060713550", "prenume" => "Dancik"],
    ["id" => 4, "phone" => "076784211", "prenume" => "eclipse"]
];

// Codul secret unic (pe server, ascuns)
$adminAccessCode = "7UVJ5tNnZYni8fQuazbvElFbZcXx9aTTkBaF1v";

// Verificare date
$found = null;
foreach ($admins as $admin) {
    if (
        str_ends_with($telefon, $admin["phone"]) ||
        str_ends_with($admin["phone"], $telefon) ||
        $telefon === $admin["phone"]
    ) {
        $found = $admin;
        break;
    }
}

if (!$found) {
    echo json_encode(["success" => false, "message" => "Număr neautorizat!"]);
    exit;
}

if ($adminCode !== $adminAccessCode) {
    echo json_encode(["success" => false, "message" => "Cod secret incorect!"]);
    exit;
}

// Dacă e corect:
echo json_encode([
    "success" => true,
    "user" => [
        "id" => $found["id"],
        "prenume" => $found["prenume"],
        "telefon" => $found["phone"],
        "isAdmin" => true
    ]
]);
