<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$q = trim($_GET['q'] ?? '');

if ($q === '') {
    echo json_encode([]);
    exit;
}

$search = "%$q%";

$stmt = $conn->prepare("
    SELECT id, common_name, scientific_name
    FROM plants
    WHERE common_name LIKE ?
       OR scientific_name LIKE ?
    LIMIT 20
");

$stmt->bind_param("ss", $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
