<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

$plant_id = intval($_GET['plant_id'] ?? 0);

$sql = "
    SELECT title, abstract, pdf_path, author, institution
    FROM case_studies
    WHERE status = 'approved'
";

if ($plant_id > 0) {
    $sql .= " AND plant_id = $plant_id";
}

$res = $conn->query($sql);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
