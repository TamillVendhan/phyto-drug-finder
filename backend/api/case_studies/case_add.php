<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/db.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

// TEMP: simulate logged-in user
$uploaded_by = 1;

// INPUTS
$plant_id    = intval($_POST['plant_id'] ?? 0);
$title       = trim($_POST['title'] ?? '');
$abstract    = trim($_POST['abstract'] ?? '');
$author      = trim($_POST['author'] ?? '');
$institution = trim($_POST['institution'] ?? '');

// BASIC VALIDATION
if ($plant_id <= 0 || $title === '' || $abstract === '') {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// DEFAULT: no PDF
$filename = null;

// CHECK IF PDF EXISTS (OPTIONAL)
if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {

    $file = $_FILES['pdf'];

    // MIME check (basic)
    if ($file['type'] !== 'application/pdf') {
        echo json_encode(["error" => "Only PDF allowed"]);
        exit;
    }

    $filename = time() . "_" . basename($file['name']);
    $target   = __DIR__ . "/../../uploads/case_studies/" . $filename;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        echo json_encode(["error" => "Upload failed"]);
        exit;
    }
}

// INSERT
$stmt = $conn->prepare("
    INSERT INTO case_studies 
    (title, abstract, pdf_path, plant_id, author, institution, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssissi",
    $title,
    $abstract,
    $filename,
    $plant_id,
    $author,
    $institution,
    $uploaded_by
);

if (!$stmt->execute()) {
    echo json_encode([
        "error" => "DB insert failed",
        "mysql_error" => $stmt->error
    ]);
    exit;
}

echo json_encode(["success" => "Case study submitted (PDF optional for now)"]);
