<?php
/*
  NUEVO ENDPOINT: api/save_python_quiz.php
  1. Recibe un array de preguntas (generadas por la API de Python en Render).
  2. Requiere que el usuario esté logueado (seguridad).
  3. Guarda estas preguntas en la base de datos local (tabla Ejercicio).
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen (db_gen)

header('Content-Type: application/json');

// PASO 1: Seguridad (Solo usuarios logueados pueden activar esto)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Debes iniciar sesión para realizar esta acción.']);
    exit;
}

// PASO 2: Obtener los datos JSON enviados desde App_con_API.js
$data = json_decode(file_get_contents('php://input'), true);
$questions = $data['questions'] ?? null;

if (!is_array($questions) || empty($questions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No se recibieron preguntas válidas en el cuerpo de la petición.']);
    exit;
}

// PASO 3: Guardar las preguntas en la Base de Datos
try {
    $pdo->beginTransaction();
    
    // Preparamos la consulta SQL para insertar en tu tabla Ejercicio
    // Asegúrate de que los nombres de columna (Pregunta, OpcionA, etc.) coincidan con tu tabla
    $sql = "
        INSERT INTO Ejercicio (Pregunta, OpcionA, OpcionB, OpcionC, OpcionD, RespuestaCorrecta, IdUnidad)
        VALUES (:pregunta, :opcionA, :opcionB, :opcionC, :opcionD, :respuestaCorrecta, :idUnidad)
    ";
    $stmt = $pdo->prepare($sql);

    foreach ($questions as $q) {
        // Verificación de datos mínimos (los campos de la API de Python)
        if (empty($q['pregunta']) || empty($q['respuestaCorrecta']) || !isset($q['idUnidad'])) {
            // Omitir esta pregunta si no tiene los datos esenciales
            continue; 
        }

        $stmt->execute([
            ':pregunta' => $q['pregunta'],
            ':opcionA' => $q['opcionA'] ?? 'N/A', // Usar 'N/A' si alguna opción viene nula
            ':opcionB' => $q['opcionB'] ?? 'N/A',
            ':opcionC' => $q['opcionC'] ?? 'N/A',
            ':opcionD' => $q['opcionD'] ?? 'N/A',
            ':respuestaCorrecta' => $q['respuestaCorrecta'],
            ':idUnidad' => $q['idUnidad'] // El JSON de tu API de Python ya provee 'idUnidad'
        ]);
    }
    
    // Si todo fue bien, confirmamos los cambios
    $pdo->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => '¡Quiz de Python guardado exitosamente en la base de datos local!'
    ]);

} catch (Exception $e) {
    // Si algo falla, revertimos todos los cambios
    $pdo->rollBack(); 
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error de base de datos al guardar el quiz: ' . $e->getMessage()
    ]);
}
?>