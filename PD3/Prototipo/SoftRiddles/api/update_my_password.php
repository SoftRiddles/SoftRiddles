<?php
/*
  api/update_my_password.php
  Permite a un usuario logueado cambiar su propia contraseña.
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

if (empty($input['currentPassword']) || empty($input['newPassword'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

$userId = $_SESSION['user_id'];
$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

try {
    // 2. Obtener la contraseña actual (hasheada) del usuario
    $stmt = $pdo->prepare("SELECT Contraseña FROM Usuario WHERE IdUsuario = ?");
    $stmt->execute([$userId]);
    $hash = $stmt->fetchColumn();

    if (!$hash) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
        exit;
    }

    // 3. Verificar que la contraseña actual sea correcta
    if (!password_verify($currentPassword, $hash)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'La contraseña actual es incorrecta.']);
        exit;
    }
    
    // 4. Hashear la NUEVA contraseña
    $newHash = password_hash($newPassword, PASSWORD_ARGON2ID);

    // 5. Actualizar la contraseña en la BD
    $stmtUpdate = $pdo->prepare("UPDATE Usuario SET Contraseña = ? WHERE IdUsuario = ?");
    $stmtUpdate->execute([$newHash, $userId]);

    $response['success'] = true;
    $response['message'] = 'Contraseña actualizada con éxito.';

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>