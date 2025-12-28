<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$id = intval($_GET['id'] ?? 0);

$q = $conn->prepare("SELECT * FROM plants WHERE id = ?");
$q->bind_param("i", $id);
$q->execute();
$res = $q->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["error" => "Plant not found"]);
    exit;
}

echo json_encode($res->fetch_assoc());
