<?php
/*
  API ENDPOINT: api/get_single_riddle.php
  Obtiene los datos de UN solo acertijo para rellenar el formulario de edición.
  Endpoint protegido solo para Administradores.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// ¡SEGURIDAD! Verificar que el usuario sea Admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
    exit;
}

// Obtener el ID del acertijo de la URL (?id=...)
$idEjercicio = $_GET['id'] ?? null;

if (!$idEjercicio) {
    http_response_code(400); // 400 Bad Request
    echo json_encode(['success' => false, 'message' => 'No se proporcionó ID de acertijo.']);
    exit;
}

$response = ['success' => false];

try {
    $stmt = $pdo->prepare("SELECT * FROM Ejercicio WHERE IdEjercicio = ?");
    $stmt->execute([$idEjercicio]);
    $riddle = $stmt->fetch();

    if ($riddle) {
        $response['success'] = true;
        $response['riddle'] = $riddle;
    } else {
        http_response_code(404);
        $response['message'] = 'Acertijo no encontrado.';
    }

} catch (\PDOException $e) {
    http_response_code(500);
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>