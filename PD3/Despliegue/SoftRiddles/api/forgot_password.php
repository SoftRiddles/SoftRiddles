<?php
/*
  api/forgot_password.php
  ¡Envía un email REAL para resetear la contraseña!
  (Requiere 'phpmailer/phpmailer' en composer.json)
*/

// Cargar Composer (PHPMailer)
require_once '../vendor/autoload.php';
require_once '../conexion.php'; // Tu conexión (db_gen) [cite: conexion.php]

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$response = ['success' => false, 'message' => ''];

if (empty($input['email'])) {
    $response['message'] = 'Por favor, ingresa tu correo electrónico.';
    echo json_encode($response);
    exit;
}

$correo = $input['email'];

try {
    // 1. Verificar que el email exista
    $stmt = $pdo->prepare("SELECT 1 FROM Usuario WHERE Correo = ?");
    $stmt->execute([$correo]);
    
    if (!$stmt->fetch()) {
        $response['message'] = 'No se encontró ninguna cuenta con ese correo electrónico.';
        echo json_encode($response);
        exit;
    }

    // 2. Generar un token seguro
    $token = bin2hex(random_bytes(32)); // 64 caracteres
    $tokenHash = password_hash($token, PASSWORD_DEFAULT); // Hashear el token
    
    // 3. Establecer expiración (1 hora)
    $expira = time() + 3600;

    // 4. Guardar el token hasheado en la BD
    $stmtDel = $pdo->prepare("DELETE FROM PasswordResets WHERE Correo = ?");
    $stmtDel->execute([$correo]);
    
    $stmtIns = $pdo->prepare("INSERT INTO PasswordResets (Correo, Token, Expira) VALUES (?, ?, ?)");
    $stmtIns->execute([$correo, $tokenHash, $expira]);

    // 5. ¡ENVIAR EL EMAIL REAL!
    // Esta es la URL de tu página. ¡Asegúrate de que sea correcta!
    // (Localmente sería: http://localhost/SoftRiddles/)
    // ¡¡¡CAMBIA ESTO A LA URL DE TU HOSTGATOR!!!
    $urlBase = "http://localhost/SoftRiddles/"; // ¡CAMBIA ESTO!
    
    // El enlace que el usuario recibirá
    $resetLink = $urlBase . '#reset?token=' . $token;

    $mail = new PHPMailer(true);
    
    // Configuración del servidor (HostGator usa la función mail() de PHP)
    $mail->isMail(); // Le dice a PHPMailer que use la función mail()
    // ¡¡¡CAMBIA ESTO al email de tu dominio!!!
    $mail->setFrom('no-reply@softriddles.com', 'SoftRiddles Admin'); 
    $mail->addAddress($correo);
    $mail->isHTML(true);
    $mail->Subject = 'Restablece tu contrasena de SoftRiddles';
    $mail->Body    = "Hola,<br><br>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace:<br><br>"
                   . "<a href='$resetLink'>$resetLink</a><br><br>"
                   . "Si no solicitaste esto, puedes ignorar este correo.<br><br>"
                   . "Este enlace expirará en 1 hora.";
    
    $mail->send();

    $response['success'] = true;
    $response['message'] = '¡Éxito! Te hemos enviado un enlace a tu correo para restablecer tu contraseña.';

} catch (Exception $e) {
    // Captura errores de PHPMailer o PDO
    $response['message'] = 'Error al enviar el correo: ' . $e->getMessage();
}

echo json_encode($response);
?>