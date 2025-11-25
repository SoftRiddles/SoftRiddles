<?php
/*
  conexion.php
  Define los datos de conexión a la base de datos MySQL.
*/

// --- RELLENA ESTOS DATOS ---
$db_host = 'localhost';      // O la IP de tu servidor de BD
$db_nombre = 'db_gen';  // El nombre de tu base de datos
$db_usuario = 'root';        // Tu usuario de MySQL
$db_pass = '';               // Tu contraseña de MySQL
// -----------------------------

$charset = 'utf8mb4';

// Opciones de PDO (PHP Data Objects) para la conexión
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// DSN (Data Source Name)
$dsn = "mysql:host=$db_host;dbname=$db_nombre;charset=$charset";

try {
     // Esta es la variable que usarán todos tus otros scripts
     $pdo = new PDO($dsn, $db_usuario, $db_pass, $options);
} catch (\PDOException $e) {
     // Si la conexión falla, detenemos todo.
     // En un sitio en producción, deberías registrar este error, no mostrarlo.
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>