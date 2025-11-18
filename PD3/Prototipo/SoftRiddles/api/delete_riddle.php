<?php
/*
  API ENDPOINT: api/delete_riddle.php
  Elimina un acertijo de la base de datos.
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

// 2. Leer el ID del acertijo a eliminar
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['riddleId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de acertijo no proporcionado.']);
    exit;
}

$idEjercicio = $input['riddleId'];
$response = ['success' => false];

// 3. Usar una transacción para eliminar en cascada de forma segura
// (Debemos borrar de Reporte e Historial primero)
try {
    $pdo->beginTransaction();

    // 3.1 Borrar de Reporte
    $stmt1 = $pdo->prepare("DELETE FROM Reporte WHERE IdEjercicio = ?");
    $stmt1->execute([$idEjercicio]);

    // 3.2 Borrar de Historial
    $stmt2 = $pdo->prepare("DELETE FROM Historial WHERE IdEjercicio = ?");
    $stmt2->execute([$idEjercicio]);

    // 3.3 Borrar de Ejercicio
    $stmt3 = $pdo->prepare("DELETE FROM Ejercicio WHERE IdEjercicio = ?");
    $stmt3->execute([$idEjercicio]);

    // 4. Confirmar la transacción
    $pdo->commit();
    
    $response['success'] = true;
    $response['message'] = 'Acertijo eliminado (junto con sus reportes e historial).';

} catch (\PDOException $e) {
    // 5. Revertir en caso de error
    $pdo->rollBack();
    http_response_code(500);
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>