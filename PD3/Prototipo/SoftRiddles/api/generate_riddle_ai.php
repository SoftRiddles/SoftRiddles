<?php
/*
  API ENDPOINT: api/generate_riddle_ai.php
  ¡Implementa la visión del usuario!
  1. Se activa cuando un usuario se queda sin acertijos.
  2. Lee TODOS los PDFs de la carpeta de la unidad solicitada (RAG).
  3. Envía todo ese texto a Gemini como contexto.
  4. Pide 5 nuevos acertijos en formato JSON.
  5. Los guarda en la base de datos.
  
  *** ESTE ARCHIVO ES AHORA EL SISTEMA DE RESPALDO (FALLBACK) ***
*/

// PASO 1: Cargar Composer (instalado localmente y subido a HostGator)
require_once '../vendor/autoload.php';
use \Smalot\PdfParser\Parser;

session_start();
require_once '../conexion.php'; // Tu conexión a db_gen (db_gen)

header('Content-Type: application/json');

// PASO 2: Seguridad (Solo usuarios logueados pueden activar esto)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Inicia sesion antes de poder resolver quizzes']);
    exit;
}

// PASO 3: Configuración de IA y Directorios
$apiKey = 'AIzaSyB-5a2HLI7fSasGLu6RtRcy35AEMrR8SLQ'; // <--- ¡¡¡REEMPLAZA ESTO!!!
$geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;

$unit = $_GET['unit'] ?? '1';
if ($unit === 'all') $unit = '1'; // Si es 'all', default a 1 (o 2, como prefieras)

// ¡Importante! Usamos __DIR__ para obtener la ruta de carpetas en HostGator
$folderPath = __DIR__ . '/material/' . ($unit === '1' ? 'unidad1/' : 'unidad2/');

if (!is_dir($folderPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error del servidor: La carpeta '$folderPath' no existe."]);
    exit;
}

// PASO 4: Leer TODOS los PDFs de la carpeta (El RAG de múltiples archivos)
$contexto = "";
$parser = new Parser();

try {
    // Usamos 'glob' para encontrar todos los .pdf en la carpeta
    foreach (glob($folderPath . "*.pdf") as $filename) {
        $pdf = $parser->parseFile($filename);
        $contexto .= $pdf->getText() . "\n\n--- FIN DE DOCUMENTO ---\n\n"; // Añadir el texto del PDF
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al leer los archivos PDF: ' . $e->getMessage()]);
    exit;
}

if (empty(trim($contexto))) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error: No se encontró texto en ningún PDF de la carpeta '$folderPath'. Asegúrate de subir tus archivos."]);
    exit;
}

// PASO 5: Crear el Prompt (Pidiendo 5 acertijos)
$prompt = "
Eres un asistente experto en 'Fundamentos de Ingeniería de Software'.
Tu tarea es generar 5 nuevas preguntas de quiz (acertijos) de opción múltiple.

REGLAS ESTRICTAS:
1.  Basa tus preguntas ÚNICA Y EXCLUSIVAMENTE en el siguiente contexto. El contexto contiene varios documentos separados por '--- FIN DE DOCUMENTO ---'.
2.  Genera exactamente 5 preguntas variadas de diferentes partes del contexto.
3.  Tu respuesta DEBE ser única y exclusivamente un ARRAY JSON, sin ningún texto antes o después.
4.  El formato del array JSON debe ser:
    [
      {
        \"pregunta\": \"Texto de la pregunta...\",
        \"opcionA\": \"Texto de la opción A\",
        \"opcionB\": \"Texto de la opción B\",
        \"opcionC\": \"Texto de la opción C\",
        \"opcionD\": \"Texto de la opción D\",
        \"respuestaCorrecta\": \"A\"
      },
      { ... 4 más ... }
    ]

--- CONTEXTO ---
$contexto
--- FIN DEL CONTEXTO ---

Recuerda, tu salida debe ser solo el array JSON y nada más.
";

// PASO 6: Configurar la petición a la API de Gemini
$postData = json_encode([
    'contents' => [
        [ 'parts' => [ [ 'text' => $prompt ] ] ]
    ],
    'generationConfig' => [
        'responseMimeType' => 'application/json',
        'temperature' => 0.8,
    ]
]);

// PASO 7: Usar cURL para enviar la petición a Google
$ch = curl_init($geminiApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Descomenta esto solo si HostGator da problemas de SSL

$apiResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// PASO 8: Procesar la respuesta de la IA
if ($httpCode !== 200 || $apiResponse === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al contactar la API de Gemini.', 'details' => $apiResponse]);
    exit;
}

try {
    // 9. Extraer el ARRAY JSON de la respuesta de Gemini
    $jsonResponse = json_decode($apiResponse, true);
    $riddleJsonText = $jsonResponse['candidates'][0]['content']['parts'][0]['text'];
    $riddleArray = json_decode($riddleJsonText, true);

    if (!is_array($riddleArray) || empty($riddleArray)) {
        throw new Exception("La IA no devolvió un array JSON válido.");
    }

    // 10. ¡Guardar los 5 nuevos acertijos en la base de datos!
    $pdo->beginTransaction();
    
    $sql = "
        INSERT INTO Ejercicio (Pregunta, OpcionA, OpcionB, OpcionC, OpcionD, RespuestaCorrecta, IdUnidad)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ";
    $stmt = $pdo->prepare($sql);

    foreach ($riddleArray as $riddleData) {
        if (empty($riddleData['pregunta']) || empty($riddleData['respuestaCorrecta'])) continue;
        
        // El fallback (RAG/Gemini) no sabe el idUnidad, así que le asignamos el $unit que pidió el usuario
        $stmt->execute([
            $riddleData['pregunta'],
            $riddleData['opcionA'] ?? 'Opción A',
            $riddleData['opcionB'] ?? 'Opción B',
            $riddleData['opcionC'] ?? 'Opción C',
            $riddleData['opcionD'] ?? 'Opción D',
            $riddleData['respuestaCorrecta'],
            $unit 
        ]);
    }
    
    $pdo->commit();
    
    // 11. Enviar éxito. El JS volverá a llamar a get_riddle.php
    echo json_encode([
        'success' => true, 
        'message' => '¡Nuevos acertijos generados y guardados!'
    ]);

} catch (Exception $e) {
    $pdo->rollBack(); 
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error al procesar la respuesta de la IA: ' . $e->getMessage(),
        'raw_response' => $apiResponse
    ]);
}
?>