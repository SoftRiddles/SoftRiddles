<?php
/*
  API ENDPOINT: api/submit_report.php
  Recibe un reporte de un usuario sobre un acertijo específico
  y lo guarda en la base de datos.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. Verificar si el usuario está logeado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado. Debes iniciar sesión para reportar.']);
    exit;
}

// 2. Leer los datos de entrada (qué acertijo y qué problema)
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['riddleId']) || empty($input['description'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos. Se requiere el acertijo y la descripción.']);
    exit;
}

$idUsuario = $_SESSION['user_id'];
$idEjercicio = $input['riddleId'];
$descripcion = $input['description'];
$response = ['success' => false];

try {
    // 3. Insertar el reporte en la tabla 'Reporte'
    // El estado 'pendiente' es el default de tu SQL, así que no necesitamos especificarlo.
    $stmt = $pdo->prepare("
        INSERT INTO Reporte (IdUsuario, IdEjercicio, Descripcion) 
        VALUES (?, ?, ?)
    ");
    
    $stmt->execute([$idUsuario, $idEjercicio, $descripcion]);

    // 4. Enviar respuesta de éxito
    $response['success'] = true;
    $response['message'] = '¡Reporte enviado con éxito! Gracias por tu ayuda.';

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>