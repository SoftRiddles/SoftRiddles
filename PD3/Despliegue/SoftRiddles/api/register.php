<?php
/*
  API ENDPOINT: api/register.php
  Recibe los datos del formulario de registro de App.js,
  valida los datos y crea el nuevo usuario en la base de datos.
*/

// 1. Incluir el archivo de conexión
// (Usamos '../' para subir un nivel, ya que este archivo estará en /api/)
require_once '../conexion.php';

// 2. Definir que la respuesta será en formato JSON
header('Content-Type: application/json');

// 3. Preparar la respuesta por defecto
$response = ['success' => false, 'message' => 'Error desconocido'];

// 4. Leer los datos de entrada
// (los datos no vienen por $_POST, sino por el 'body' de fetch)
$input = json_decode(file_get_contents('php://input'), true);

// 5. Validar los datos recibidos
if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
    $response['message'] = 'Todos los campos son obligatorios.';
    echo json_encode($response);
    exit; // Detener el script
}

// 6. Asignar variables
$nombre = $input['name'];
$correo = $input['email'];
$password = $input['password'];

// 7. Hashear la contraseña (¡MUY IMPORTANTE!)
// Esto cumple con tu requisito SR-008 de usar Argon2id
$hashed_password = password_hash($password, PASSWORD_ARGON2ID);

// 8. Usar la conexión $pdo de conexion.php para interactuar con la BD
try {
    // 8.1. Verificar si el correo ya existe
    $stmt = $pdo->prepare("SELECT 1 FROM Usuario WHERE Correo = ?");
    $stmt->execute([$correo]);
    
    if ($stmt->fetch()) {
        // Si fetch() encuentra algo, el correo ya existe
        $response['message'] = 'El correo electrónico ya está registrado.';
    } else {
        // 8.2. El correo no existe, proceder con la inserción
        $stmt = $pdo->prepare("INSERT INTO Usuario (Nombre, Correo, Contraseña, Rol) VALUES (?, ?, ?, ?)");
        
        // Todos los nuevos usuarios son 'usuario' por defecto
        $stmt->execute([$nombre, $correo, $hashed_password, 'usuario']);
        
        $response['success'] = true;
        $response['message'] = '¡Registro exitoso! Ahora puedes iniciar sesión.';
    }

} catch (\PDOException $e) {
    // Capturar cualquier error de la base de datos
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}

// 9. Enviar la respuesta (sea de éxito o error) de vuelta a App.js
echo json_encode($response);
?>