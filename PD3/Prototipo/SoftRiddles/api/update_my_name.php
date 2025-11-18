<?php
/*
  api/update_my_name.php
  Permite a un usuario logueado cambiar su propio nombre.
*/
require_once '../conexion.php'; // Tu conexión (db_gen)
session_start();

header('Content-Type: application/json');

// 1. ¡SEGURIDAD! Verificar que el usuario esté logueado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false];

if (empty($input['newName'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El nombre no puede estar vacío.']);
    exit;
}

$newName = trim($input['newName']);
$userId = $_SESSION['user_id'];

try {
    // 2. Actualizar el nombre en la BD
    $stmt = $pdo->prepare("UPDATE Usuario SET Nombre = ? WHERE IdUsuario = ?");
    $stmt->execute([$newName, $userId]);

    // 3. Actualizar el nombre en la sesión
    $_SESSION['user_nombre'] = $newName;

    $response['success'] = true;
    $response['message'] = 'Nombre actualizado con éxito.';
    $response['newName'] = $newName; // Devolver el nuevo nombre

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>