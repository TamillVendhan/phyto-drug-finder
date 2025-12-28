<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$id     = intval($_POST['id'] ?? 0);
$status = $_POST['status'] ?? '';

if (!in_array($status, ['approved','rejected'])) {
    echo json_encode(["error" => "Invalid status"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE case_studies 
    SET status = ? 
    WHERE id = ?
");

$stmt->bind_param("si", $status, $id);
$stmt->execute();

echo json_encode(["success" => "Status updated"]);
