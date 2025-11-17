<?php
$host = getenv('DB_HOST') ?: "mysql";
$user = "root";
$pass = "";
$db   = "barbershop";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Eroare conexiune DB: " . $e->getMessage());
}
?>
