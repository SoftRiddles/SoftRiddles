<?php
/*
  API ENDPOINT: api/get_riddle.php
  Busca un acertijo que el usuario (de la sesión) no haya resuelto.
  
  ¡NUEVO! Acepta un parámetro GET: ?unit=all, ?unit=1, o ?unit=2
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. Verificar si el usuario está logeado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Inicia sesion antes de poder resolver quizzes']);
    exit;
}

$idUsuario = $_SESSION['user_id'];
$response = ['success' => false];

// 2. Leer el filtro de unidad
$unitFilter = $_GET['unit'] ?? 'all'; // 'all' por defecto

try {
    // 3. Construir la consulta SQL dinámicamente
    $params = [$idUsuario];
    $sql = "
        SELECT * FROM Ejercicio 
        WHERE IdEjercicio NOT IN (
            SELECT IdEjercicio FROM Historial WHERE IdUsuario = ?
        )
    ";

    // ¡NUEVO! Añadir el filtro de unidad si no es 'all'
    if ($unitFilter != 'all') {
        $sql .= " AND IdUnidad = ? ";
        $params[] = $unitFilter; // Añadir el ID de la unidad a los parámetros
    }

    $sql .= " ORDER BY RAND() LIMIT 1";

    // 4. Ejecutar la consulta
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $riddle = $stmt->fetch();

    if ($riddle) {
        // ¡Encontramos un acertijo!
        $response['success'] = true;
        $response['riddle'] = $riddle;
    } else {
        // El usuario ya resolvió todos los acertijos (de esta unidad)
        $response['success'] = false;
        $response['message'] = '¡Felicidades! Has resuelto todos los acertijos disponibles para esta unidad.';
    }

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>