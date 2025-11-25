<?php
/*
  API ENDPOINT: api/get_history.php
  Obtiene las estadísticas y la lista del historial.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. Verificar si el usuario está logeado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Inicia sesion para poder ver tu historial']);
    exit;
}

$idUsuario = $_SESSION['user_id'];
$response = ['success' => false];

try {
    // 2. Obtener Estadísticas
    $stmtTotal = $pdo->prepare("SELECT COUNT(*) as total FROM Historial WHERE IdUsuario = ?");
    $stmtTotal->execute([$idUsuario]);
    $total = $stmtTotal->fetchColumn();

    $stmtCorrect = $pdo->prepare("SELECT COUNT(*) as correct FROM Historial WHERE IdUsuario = ? AND FueCorrecto = 1");
    $stmtCorrect->execute([$idUsuario]);
    $correctas = $stmtCorrect->fetchColumn();

    $incorrectas = $total - $correctas;

    $stats = [
        'total' => $total,
        'correct' => $correctas,
        'incorrect' => $incorrectas
    ];

    // 3. Obtener Lista de Historial (los 20 más recientes)
    // Unimos (JOIN) con Ejercicio para obtener el texto de la pregunta
    $stmtList = $pdo->prepare("
        SELECT h.Fecha, h.FueCorrecto, e.Pregunta 
        FROM Historial h
        JOIN Ejercicio e ON h.IdEjercicio = e.IdEjercicio
        WHERE h.IdUsuario = ?
        ORDER BY h.Fecha DESC
        LIMIT 20
    ");
    $stmtList->execute([$idUsuario]);
    $historyList = $stmtList->fetchAll();

    // 4. Enviar todo junto
    $response['success'] = true;
    $response['stats'] = $stats;
    $response['history'] = $historyList;

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>