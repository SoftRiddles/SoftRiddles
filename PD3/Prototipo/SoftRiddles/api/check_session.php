<?php
/*
  API ENDPOINT: api/check_session.php
  Comprueba si ya existe una sesión válida al cargar la página.
*/

session_start();

header('Content-Type: application/json');

// Comprobar si la variable de sesión 'user_id' fue creada en login.php
if (isset($_SESSION['user_id'])) {
    // El usuario ya tiene una sesión
    echo json_encode([
        'success' => true,
        'user' => [
            'nombre' => $_SESSION['user_nombre'],
            'rol' => $_SESSION['user_rol']
        ]
    ]);
} else {
    // No hay sesión activa
    echo json_encode(['success' => false]);
}
?>