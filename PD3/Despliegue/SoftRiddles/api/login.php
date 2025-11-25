<?php
/*
  API ENDPOINT: api/login.php
  Verifica las credenciales del usuario y, si son correctas,
  inicia una sesión de PHP.
*/

// session_start() DEBE ser lo primero en el archivo
session_start();

// 1. Incluir la conexión
require_once '../conexion.php'; // Usa la conexión que definiste

// 2. Definir que la respuesta será JSON
header('Content-Type: application/json');

// 3. Preparar la respuesta
$response = ['success' => false, 'message' => ''];

// 4. Leer los datos de entrada
$input = json_decode(file_get_contents('php://input'), true);

// 5. Validar datos
if (empty($input['email']) || empty($input['password'])) {
    $response['message'] = 'Correo y contraseña son obligatorios.';
    echo json_encode($response);
    exit;
}

$correo = $input['email'];
$password = $input['password'];

try {
    // 6. Buscar al usuario por correo
    // Seleccionamos los datos que guardaremos en la sesión
    $stmt = $pdo->prepare("SELECT IdUsuario, Nombre, Contraseña, Rol FROM Usuario WHERE Correo = ?");
    $stmt->execute([$correo]);
    $user = $stmt->fetch();

    // 7. Verificar si el usuario existe Y la contraseña es correcta
    // Usamos password_verify() para comparar la contraseña del formulario
    // con el hash que guardamos en la base de datos.
    if ($user && password_verify($password, $user['Contraseña'])) {
        
        // ¡Éxito! La contraseña coincide.
        
        // 8. Regenerar la sesión para seguridad
        session_regenerate_id(true);
        
        // 9. Guardar los datos del usuario en la variable de SESIÓN
        $_SESSION['user_id'] = $user['IdUsuario'];
        $_SESSION['user_nombre'] = $user['Nombre'];
        $_SESSION['user_rol'] = $user['Rol'];

        // 10. Enviar la respuesta de éxito al JavaScript
        $response['success'] = true;
        // Enviamos los datos del usuario para que el JS actualice la UI
        $response['user'] = [
            'nombre' => $user['Nombre'],
            'rol' => $user['Rol']
        ];
        
    } else {
        // Error: El usuario no existe o la contraseña es incorrecta
        $response['message'] = 'Correo o contraseña incorrectos.';
    }

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

// 11. Enviar la respuesta JSON final
echo json_encode($response);
?>