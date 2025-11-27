<?php
/*
  API ENDPOINT: api/resolve_report.php
  Marca un reporte como 'resuelto'.
  Es un endpoint protegido solo para Administradores.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. ¡SEGURIDAD! Verificar que el usuario sea Admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    http_response_code(403); // 403 Forbidden
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
    exit;
}

// 2. Leer el ID del reporte a resolver
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['reportId'])) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(['success' => false, 'message' => 'ID de reporte no proporcionado.']);
    exit;
}

$idReporte = $input['reportId'];
$response = ['success' => false];

try {
    // 3. Actualizar el estado en la BD
    $stmt = $pdo->prepare("
        UPDATE Reporte 
        SET Estado = 'resuelto' 
        WHERE IdReporte = ?
    ");
    
    $stmt->execute([$idReporte]);

    // 4. Enviar respuesta de éxito
    $response['success'] = true;
    $response['message'] = 'Reporte marcado como resuelto.';

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>