<?php
/*
  api/admin_update_role.php
  Actualiza el rol de un usuario. Protegido para Admins.
*/
require_once '../conexion.php'; // Tu conexión (db_gen)
session_start();

header('Content-Type: application/json');

// 1. ¡SEGURIDAD! Verificar que el usuario sea Admin
if (!isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false];

if (empty($input['userId']) || empty($input['newRole'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit;
}

$userIdToUpdate = $input['userId'];
$newRole = $input['newRole'];

// 2. No permitas que un admin se quite el rol a sí mismo
if ($userIdToUpdate == $_SESSION['user_id']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No puedes cambiar tu propio rol.']);
    exit;
}

try {
    // 3. Actualizar el rol en la BD
    $stmt = $pdo->prepare("UPDATE Usuario SET Rol = ? WHERE IdUsuario = ?");
    $stmt->execute([$newRole, $userIdToUpdate]);

    $response['success'] = true;
    $response['message'] = 'Rol de usuario actualizado con éxito.';

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>