# SoftRiddles: Acertijos de Ingeniería de Software

Link para ver funcionamiento de pagina: https://sublimartweb.com/383bdc230a9b986db93f3465bceac9aa4b6e9bdf7ff44357462cbd107e51a6f3/SoftRiddles/

## 📌 Tabla de contenidos

* [Descripción](#descripción)
* [Características principales](#características-principales)

  * [Funcionalidades para usuarios](#funcionalidades-para-usuarios)
  * [Generación de contenido por IA](#generación-de-contenido-por-ia)
  * [Funcionalidades de administración](#funcionalidades-de-administración)
* [Stack tecnológico](#stack-tecnológico)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Instalación y ejecución local](#instalación-y-ejecución-local)

  * [Requisitos previos](#requisitos-previos)
  * [Variables de entorno (
    .env)](#variables-de-entorno-env)
  * [Creación de la base de datos](#creación-de-la-base-de-datos)
* [API — Endpoints clave](#api--endpoints-clave)
* [Frontend (SPA)](#frontend-spa)
* [Integración IA (arquitectura y flujo)](#integración-ia-arquitectura-y-flujo)
* [Seguridad y buenas prácticas](#seguridad-y-buenas-prácticas)
* [Despliegue](#despliegue)
* [Pruebas](#pruebas)
* [Contribuir](#contribuir)
* [Licencia y contacto](#licencia-y-contacto)

---

## Descripción

SoftRiddles proporciona un entorno interactivo para que estudiantes practiquen y evalúen sus conocimientos en Ingeniería de Software mediante acertijos tipo quiz. El sistema destaca por:

* Backend en PHP 8+ con PDO y MySQL.
* Autenticación segura (ARGON2ID) y manejo de sesiones por servidor.
* Generación automática de quizzes por IA (API Python + fallback con RAG + Google Gemini).
* Panel administrativo para gestionar usuarios, acertijos y reportes.

---

## Características principales

### Funcionalidades para usuarios

* **Registro, inicio y cierre de sesión**: `register.php`, `login.php`, `logout.php`.
* **Contraseñas seguras**: `password_hash(..., PASSWORD_ARGON2ID)`.
* **Comprobación de sesión al cargar**: `check_session.php`.
* **Recuperación de contraseña**: `forgot_password.php` (envía correo real) + `reset_password.php` (token seguro).
* **Gestión de cuenta**: actualizar nombre (`update_my_name.php`) y contraseña (`update_my_password.php`) desde modal "Mi Cuenta".
* **Sistema de Quiz**: obtener acertijos (`get_riddle.php`) y enviar respuestas (`submit_answer.php`).
* **Historial y estadísticas**: `get_history.php` (resumen y últimos 20 registros).
* **Reporte de errores**: `submit_report.php`.

### Generación de contenido por IA

* **Sistema híbrido**: el frontend intenta primero obtener quizzes desde la API externa Python hospedada (Render). Si la llamada tiene éxito, las preguntas se guardan a través de `save_python_quiz.php`.
* **Fallback (RAG)**: si la API Python falla, se ejecuta `generate_riddle_ai.php` que realiza:

  1. Lectura de todos los PDFs de la unidad usando `smalot/pdfparser`.
  2. Construcción de contexto y envío a la API de **Google Gemini (Flash)** para generar 5 acertijos en JSON.
  3. Persistencia de los acertijos en MySQL.

### Funcionalidades de administración

* Panel protegido por rol `admin`.
* Ver/Resolver reportes (`get_reports.php`, `resolve_report.php`).
* CRUD de acertijos (`get_all_riddles.php`, `get_single_riddle.php`, `update_riddle.php`, `delete_riddle.php`).
* Gestión de usuarios: búsqueda (`admin_get_users.php`) y cambio de rol (`admin_update_role.php`) con protección para evitar que un admin se cambie a sí mismo.

---

## Stack de tecnología

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** PHP 8+ (PDO)
* **Base de datos:** MySQL
* **Composer:** phpmailer/phpmailer, smalot/pdfparser
* **APIs externas:** Google Gemini, API Python personalizada (Render)

---

## Estructura del proyecto (resumen)

```
/ (raíz del repo)
├─ public/
│  ├─ index.html
│  ├─ assets/
│  │  ├─ css/
│  │  └─ js/
│  │     └─ App_con_API.js
│  └─ uploads/ (pdfs por unidad)
├─ api/
│  ├─ admin_get_users.php
│  ├─ admin_update_role.php
│  ├─ check_session.php
│  ├─ delete_riddle.php
│  ├─ forgot_password.php
│  ├─ generate_riddle_ai.php
│  ├─ get_all_riddles.php
│  ├─ get_history.php
│  ├─ get_reports.php
│  ├─ get_riddle.php
│  ├─ get_single_riddle.php
│  ├─ login.php
│  ├─ logout.php
│  ├─ register.php
│  ├─ reset_password.php
│  ├─ resolve_report.php
│  ├─ save_python_quiz.php
│  ├─ submit_answer.php
│  ├─ submit_report.php
│  ├─ update_my_name.php
│  ├─ update_my_password.php
│  └─ update_riddle.php
├─ vendor/ (composer)
├─ sql/ (scripts de creación de tablas)
└─ README.md
```

---

## Instalación y ejecución local

### Requisitos previos

* PHP 8+
* MySQL 5.7+ (o 8+ recomendable)
* Composer
* Servidor web (Apache/Nginx) o `php -S` para pruebas

### Variables de entorno (ejemplo `.env`)

```env
# Database
DB_HOST=127.0.0.1
DB_NAME=softriddles
DB_USER=softriddles_user
DB_PASS=supersecret

# Mailer (PHPMailer)
MAIL_HOST=smtp.example.com
MAIL_USER=no-reply@softriddles.com
MAIL_PASS=mailpassword
MAIL_FROM=no-reply@softriddles.com
MAIL_FROM_NAME="SoftRiddles"

# Google Gemini
GOOGLE_GEMINI_ENDPOINT=https://generative-language.googleapis.com/v1beta2/models/\
GOOGLE_GEMINI_API_KEY=tu_api_key_aqui

# Python API (opcional)
PYTHON_API_URL=https://tu-api-python.onrender.com/generate

# Otros
APP_BASE_URL=http://localhost:8000
```

> Nota: En producción **siempre** usar variables de entorno seguras y TLS.

### Creación de la base de datos (ejemplo rápido)

```sql
CREATE DATABASE softriddles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE softriddles;

-- Tabla Usuario (ejemplo simplificado)
CREATE TABLE Usuario (
  IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(150) NOT NULL,
  Correo VARCHAR(200) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Rol ENUM('usuario','admin') DEFAULT 'usuario',
  FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Ejercicio (
  IdEjercicio INT AUTO_INCREMENT PRIMARY KEY,
  Pregunta TEXT NOT NULL,
  OpcionA TEXT,
  OpcionB TEXT,
  OpcionC TEXT,
  OpcionD TEXT,
  RespuestaCorrecta CHAR(1) NOT NULL,
  IdUnidad INT DEFAULT 1,
  Fuente VARCHAR(255),
  FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Historial (
  IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
  IdUsuario INT NOT NULL,
  IdEjercicio INT NOT NULL,
  FueCorrecto TINYINT(1) NOT NULL,
  Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE,
  FOREIGN KEY (IdEjercicio) REFERENCES Ejercicio(IdEjercicio) ON DELETE CASCADE
);

CREATE TABLE Reporte (
  IdReporte INT AUTO_INCREMENT PRIMARY KEY,
  IdUsuario INT NOT NULL,
  IdEjercicio INT NOT NULL,
  Descripcion TEXT NOT NULL,
  Estado ENUM('pendiente','resuelto') DEFAULT 'pendiente',
  FechaReporte DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdEjercicio) REFERENCES Ejercicio(IdEjercicio)
);

CREATE TABLE PasswordResets (
  IdReset INT AUTO_INCREMENT PRIMARY KEY,
  IdUsuario INT NOT NULL,
  TokenHash VARCHAR(255) NOT NULL,
  ExpiresAt DATETIME NOT NULL,
  FechaSolicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE
);
```

---

## API — Endpoints clave

> Aquí se listan los endpoints principales con método, protección y respuesta esperada. Para todos los endpoints **protegidos** se espera sesión activa (cookie de sesión PHP) o middleware que verifique `$_SESSION`.

### `api/register.php` — `POST`

* **Descripción:** Registro de usuarios.
* **Request (JSON):** `{ "name": "...", "email": "...", "password": "..." }`
* **Éxito:** `{ "success": true, "message": "¡Registro exitoso!" }`

### `api/login.php` — `POST`

* **Descripción:** Autentica y crea sesión.
* **Request (JSON):** `{ "email": "...", "password": "..." }`
* **Éxito:** `{ "success": true, "user": { "nombre": "...", "rol": "..." } }`

### `api/check_session.php` — `GET`

* **Descripción:** Comprueba sesión al cargar SPA.
* **Éxito:** `{ "success": true, "user": { "nombre": "...", "rol": "..." } }`

### `api/forgot_password.php` — `POST`

* **Descripción:** Inicia flujo; guarda hash del token y envía correo con token claro en enlace.
* **Request:** `{ "email": "usuario@dominio.com" }`
* **Éxito:** `{ "success": true, "message": "¡Éxito! Te hemos enviado un enlace..." }`

### `api/reset_password.php` — `POST`

* **Descripción:** Valida token (con `password_verify`) y actualiza contraseña.
* **Request:** `{ "token": "...", "password": "...", "confirmPassword": "..." }`

### `api/get_riddle.php` — `GET`

* **Protección:** Usuarios logueados.
* **Query params:** `?unit=all` (por defecto) o `?unit=1`.
* **Descripción:** Obtiene un acertijo aleatorio que el usuario no haya resuelto.
* **Respuestas:**

  * Éxito: `{ "success": true, "riddle": {...} }`
  * Sin acertijos: `{ "success": false, "message": "¡Felicidades! Has resuelto todos los acertijos..." }`

### `api/submit_answer.php` — `POST`

* **Protección:** Usuarios logueados.
* **Request:** `{ "riddleId": 1, "option": "A" }`
* **Éxito:** `{ "success": true, "isCorrect": true, "correctAnswer": "A" }`
* **Fallo:** Si ya contestó, devuelve `{ "success": false, "message": "Ya has respondido este acertijo." }`.

### `api/get_history.php` — `GET`

* **Protección:** Usuarios logueados.
* **Descripción:** Estadísticas y últimos 20 registros.
* **Ejemplo respuesta:**

```json
{
  "success": true,
  "stats": { "total": 10, "correct": 7, "incorrect": 3 },
  "history": [ { "Fecha": "2025-11-17 10:00:00", "FueCorrecto": 1, "Pregunta": "¿Qué es un requisito funcional?" } ]
}
```

### Endpoints de Admin (solo `admin`)

* `api/get_all_riddles.php` — `GET` (lista optimizada para admin).
* `api/get_single_riddle.php?id=5` — `GET` (datos completos para editar).
* `api/update_riddle.php` — `POST` (actualiza un acertijo).
* `api/delete_riddle.php` — `POST` (borra acertijo y referencias con transacción).
* `api/get_reports.php` — `GET` (lista con join a Usuario y Ejercicio).
* `api/resolve_report.php` — `POST` (marcar reporte como resuelto).
* `api/admin_get_users.php?search=valor` — `GET` (buscar usuarios).
* `api/admin_update_role.php` — `POST` (cambiar rol, evita que admin cambie su propio rol).

### Endpoints IA / Persistencia

* `api/save_python_quiz.php` — `POST` — guarda array de preguntas generadas por API Python.
* `api/generate_riddle_ai.php?unit=1` — `GET` — fallback RAG que genera 5 acertijos vía Gemini y guarda en BD.

---

## Frontend (SPA)

* `index.html` — único HTML que carga la SPA.
* `App_con_API.js` — archivo JS principal que:

  * Mantiene `appState` y controla navegación entre secciones.
  * Abre/cierra modales (registro, login, mi cuenta, admin, etc.).
  * Realiza validaciones de formularios (requisitos de contraseña, email).
  * Ejecuta llamadas `fetch()` a los endpoints y maneja el flujo de fallback de IA (llamada a API Python → si falla → `generate_riddle_ai.php`).
  * Renderiza dinámicamente la UI (acertijos, historial, tablas admin).

#### Recomendaciones para el frontend

* Mantener la comunicación con la API usando `fetch` y manejar códigos HTTP apropiadamente.
* Deshabilitar botones mientras se esperan respuestas para evitar envíos duplicados.
* Validar frontend + backend (no confiar únicamente en validaciones del cliente).

---

## Integración IA (arquitectura y flujo)

1. **Intento primario:** Frontend solicita generación a la **API Python** (servicio en Render). Si responde correctamente con un array de preguntas en JSON, el frontend envía ese array a `api/save_python_quiz.php` para persistirlo.
2. **Fallback RAG:** Si la API Python no responde o falla, el servidor PHP ejecuta `generate_riddle_ai.php` que:

   * Lee todos los `.pdf` de la carpeta de la unidad (uploads/ o similar) con `smalot/pdfparser`.
   * Extrae texto y construye prompts/contexto.
   * Llama a **Google Gemini (Flash)** con el contexto para generar 5 acertijos en JSON (incluyendo opciones A–D y RespuestaCorrecta).
   * Valida la estructura y guarda las preguntas en la BD.

**Notas:**

* Validar y sanitizar todo texto extraído antes de enviarlo a la API (evitar prompts con datos privados o corruptos).
* Usar límites y chunking si los PDFs son grandes.

---

## Seguridad y buenas prácticas

* Hashear contraseñas con `PASSWORD_ARGON2ID`.
* Usar consultas preparadas (PDO) para evitar inyección SQL.
* Forzar HTTPS en producción y usar `SameSite` y `HttpOnly` en cookies de sesión.
* Limitar intentos de login (rate limiting / bloqueo temporal).
* Validar y sanitizar inputs tanto en frontend como backend.
* Para el flujo de recuperación de contraseña:

  * Guardar sólo el hash del token en BD.
  * Incluir expiración (ej. 1 hora).
  * Verificar token con `password_verify()` para evitar ataques por tiempo.
* Controlar permisos: endpoints `admin_*` deben comprobar `$_SESSION['user_rol'] === 'admin'`.

---

## Despliegue

* **Entorno de producción:** usar PHP-FPM + Nginx/Apache, certificado TLS, variables de entorno, y restringir permisos de carpeta `uploads/`.
* **Composer:** `composer install` para dependencias (PHPMailer, pdfparser).
* **Cron / limpieza:** tareas para limpiar tokens expirados y logs si aplica.

---

## Pruebas

* Tests manuales: crear usuarios, probar flujo completo de registro/login, recuperación, generación IA (primario y fallback), CRUD admin.
* Logs: registrar errores de llamadas externas (Python API, Gemini) para depuración.

---

## Contribuir

1. Haz un *fork* del proyecto.
2. Crea una rama: `feature/mi-cambio`.
3. Haz *commit* y *push*.
4. Abre un *pull request* explicando los cambios.

Por favor sigue el estilo de código y añade migraciones SQL para cambios en tablas.

---

## Licencia

MIT © SoftRiddles

---

## Contacto

* Correo: `soporte@softriddles.com` (placeholder)
* Repo: **Pega este README.md** en la raíz de tu repo para github.

---

*Documento generado para ser usado como README / documentación de proyecto — revisar y adaptar valores sensibles (API keys, correos, rutas) antes de subir a producción.*
