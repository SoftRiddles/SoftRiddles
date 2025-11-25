<?php
/*
  API ENDPOINT: api/update_riddle.php
  Actualiza un acertijo en la base de datos.
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

// 2. Leer los datos del formulario
$input = json_decode(file_get_contents('php://input'), true);

// Validar datos (simplificado, puedes añadir más validaciones)
if (empty($input['IdEjercicio']) || empty($input['Pregunta']) || empty($input['OpcionA'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit;
}

$response = ['success' => false];

try {
    // 3. Preparar y ejecutar la consulta UPDATE
    $sql = "
        UPDATE Ejercicio SET 
            Pregunta = ?,
            OpcionA = ?,
            OpcionB = ?,
            OpcionC = ?,
            OpcionD = ?,
            RespuestaCorrecta = ?,
            IdUnidad = ?
        WHERE IdEjercicio = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['Pregunta'],
        $input['OpcionA'],
        $input['OpcionB'],
        $input['OpcionC'],
        $input['OpcionD'],
        $input['RespuestaCorrecta'],
        $input['IdUnidad'],
        $input['IdEjercicio']
    ]);

    // 4. Enviar respuesta de éxito
    $response['success'] = true;
    $response['message'] = '¡Acertijo actualizado con éxito!';

} catch (\PDOException $e) {
    http_response_code(500);
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>