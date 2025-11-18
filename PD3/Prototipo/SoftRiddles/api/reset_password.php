<?php
/*
  api/reset_password.php
  Completa el reseteo de contraseña usando el token del email.
*/

require_once '../conexion.php'; // Tu conexión (db_gen) [cite: conexion.php]

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false, 'message' => ''];

// 1. Validar todos los datos
if (empty($input['token']) || empty($input['password']) || empty($input['confirmPassword'])) {
    $response['message'] = 'Todos los campos son obligatorios.';
    echo json_encode($response);
    exit;
}
if ($input['password'] !== $input['confirmPassword']) {
    $response['message'] = 'Las contraseñas no coinciden.';
    echo json_encode($response);
    exit;
}

$token = $input['token'];
$nuevaPassword = $input['password'];

try {
    // 2. Buscar el token en la BD
    $stmt = $pdo->prepare("SELECT * FROM PasswordResets WHERE Expira > ?");
    $stmt->execute([time()]); // Solo buscar tokens que no han expirado
    
    $tokenEncontrado = false;
    $correoUsuario = null;

    // 3. Iterar y verificar el token (password_verify)
    while ($row = $stmt->fetch()) {
        if (password_verify($token, $row['Token'])) {
            // ¡El token es válido!
            $tokenEncontrado = true;
            $correoUsuario = $row['Correo'];
            break;
        }
    }

    if (!$tokenEncontrado) {
        $response['message'] = 'El token es inválido o ha expirado.';
        echo json_encode($response);
        exit;
    }

    // 4. Hashear la NUEVA contraseña
    $nuevoHash = password_hash($nuevaPassword, PASSWORD_ARGON2ID);
    
    // 5. Actualizar la contraseña en la tabla Usuario
    $stmtUpdate = $pdo->prepare("UPDATE Usuario SET Contraseña = ? WHERE Correo = ?");
    $stmtUpdate->execute([$nuevoHash, $correoUsuario]);

    // 6. Borrar TODOS los tokens de este usuario
    $stmtDel = $pdo->prepare("DELETE FROM PasswordResets WHERE Correo = ?");
    $stmtDel->execute([$correoUsuario]);

    $response['success'] = true;
    $response['message'] = '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.';

} catch (\PDOException $e) {
    $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
}
echo json_encode($response);
?>