<?php
/*
  api/admin_get_users.php
  Busca usuarios por nombre o correo. Protegido para Admins.
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

$search = $_GET['search'] ?? '';
$response = ['success' => false];

if (empty(trim($search))) {
    echo json_encode(['success' => true, 'users' => []]); // Devuelve vacío si no hay búsqueda
    exit;
}

try {
    // 2. Buscar usuarios por Nombre O Correo
    $searchTerm = "%{$search}%";
    $stmt = $pdo->prepare("
        SELECT IdUsuario, Nombre, Correo, Rol 
        FROM Usuario 
        WHERE Nombre LIKE ? OR Correo LIKE ?
        LIMIT 10
    ");
    
    $stmt->execute([$searchTerm, $searchTerm]);
    $users = $stmt->fetchAll();

    $response['success'] = true;
    $response['users'] = $users;

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>