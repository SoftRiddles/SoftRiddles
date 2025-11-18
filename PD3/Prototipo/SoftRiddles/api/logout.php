<?php
/*
  API ENDPOINT: api/logout.php
  Destruye la sesión activa del usuario.
*/

// Siempre iniciar la sesión para poder destruirla
session_start();

// 1. Borrar todas las variables de sesión
$_SESSION = [];

// 2. Destruir la sesión
session_destroy();

// 3. Enviar una respuesta de éxito
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
?>