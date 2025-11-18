<?php
/*
  API ENDPOINT: api/get_reports.php
  Obtiene TODOS los reportes de la base de datos.
  Es un endpoint protegido solo para Administradores.
*/

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen

header('Content-Type: application/json');

// 1. ¡SEGURIDAD! Verificar que el usuario sea Admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    http_response_code(403); // 403 Forbidden
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit;
}

$response = ['success' => false];

try {
    // 2. Consultar la BD, uniendo las tablas para obtener los nombres
    $stmt = $pdo->prepare("
        SELECT 
            r.IdReporte, 
            r.Descripcion, 
            r.FechaReporte, 
            r.Estado,
            u.Nombre AS UsuarioNombre,
            e.Pregunta AS EjercicioPregunta
        FROM Reporte r
        JOIN Usuario u ON r.IdUsuario = u.IdUsuario
        JOIN Ejercicio e ON r.IdEjercicio = e.IdEjercicio
        ORDER BY r.Estado ASC, r.FechaReporte DESC
    ");
    
    $stmt->execute();
    $reports = $stmt->fetchAll();

    // 3. Enviar respuesta de éxito
    $response['success'] = true;
    $response['reports'] = $reports;

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>