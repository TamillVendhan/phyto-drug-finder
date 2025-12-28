<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$res = $conn->query("
    SELECT 
        cs.id,
        cs.title,
        cs.abstract,
        cs.author,
        cs.institution,
        p.common_name
    FROM case_studies cs
    JOIN plants p ON cs.plant_id = p.id
    WHERE cs.status = 'pending'
");

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
