<?php
/*
  API ENDPOINT: api/get_all_riddles.php
  Obtiene TODOS los acertijos de la base de datos para el panel de admin.
  Endpoint protegido solo para Administradores.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// ¡SEGURIDAD! Verificar que el usuario sea Admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    http_response_code(403); // 403 Forbidden
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
    exit;
}

$response = ['success' => false];

try {
    $stmt = $pdo->prepare("
        SELECT IdEjercicio, Pregunta, IdUnidad 
        FROM Ejercicio
        ORDER BY IdUnidad, IdEjercicio
    ");
    
    $stmt->execute();
    $riddles = $stmt->fetchAll();

    $response['success'] = true;
    $response['riddles'] = $riddles;

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>