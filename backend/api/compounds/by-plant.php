<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$plant_id = intval($_GET['plant_id'] ?? 0);

if ($plant_id <= 0) {
    echo json_encode(["error" => "Invalid plant ID"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        c.id,
        c.compound_name,
        c.chemical_class,
        c.molecular_formula,
        c.activity
    FROM compounds c
    JOIN plant_compounds pc ON c.id = pc.compound_id
    WHERE pc.plant_id = ?
");

$stmt->bind_param("i", $plant_id);
$stmt->execute();
$res = $stmt->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
