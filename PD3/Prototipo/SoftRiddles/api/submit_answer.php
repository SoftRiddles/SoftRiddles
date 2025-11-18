<?php
/*
  API ENDPOINT: api/submit_answer.php
  Recibe la respuesta, la verifica, y GUARDA EN EL HISTORIAL.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. Verificar si el usuario está logeado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Inicia sesion porfavor']);
    exit;
}

// 2. Leer los datos de entrada (qué acertijo y qué respondió)
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['riddleId']) || empty($input['option'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit;
}

$idUsuario = $_SESSION['user_id'];
$idEjercicio = $input['riddleId'];
$opcionUsuario = $input['option']; // 'A', 'B', 'C', o 'D'
$response = ['success' => false];

try {
    // 3. Obtener la respuesta correcta de la BD
    $stmt = $pdo->prepare("SELECT RespuestaCorrecta FROM Ejercicio WHERE IdEjercicio = ?");
    $stmt->execute([$idEjercicio]);
    $ejercicio = $stmt->fetch();

    if (!$ejercicio) {
        throw new \Exception('El ejercicio no existe.');
    }

    // 4. Comparar y determinar si fue correcto
    $respuestaCorrecta = $ejercicio['RespuestaCorrecta'];
    $fueCorrecto = ($opcionUsuario === $respuestaCorrecta); // true o false

    // 5. ¡Guardar en el Historial!
    // Esto es lo que alimenta la sección de Historial
    $stmt = $pdo->prepare("
        INSERT INTO Historial (IdUsuario, IdEjercicio, FueCorrecto) 
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$idUsuario, $idEjercicio, $fueCorrecto]);

    // 6. Enviar la respuesta de vuelta al JavaScript
    $response['success'] = true;
    $response['isCorrect'] = $fueCorrecto; // true/false
    $response['correctAnswer'] = $respuestaCorrecta; // 'A', 'B', 'C', o 'D'

} catch (\PDOException $e) {
    // Manejar el caso de que ya respondiera (llave duplicada)
    if ($e->errorInfo[1] == 1062) {
        $response['message'] = 'Ya has respondido este acertijo.';
    } else {
        $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
    }
} catch (\Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>