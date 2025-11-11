# SoftRiddles: Acertijos de Ingeniería de Software
Link para ver funcionamiento de pagina: https://sublimartweb.com/383bdc230a9b986db93f3465bceac9aa4b6e9bdf7ff44357462cbd107e51a6f3/Tarea/
SoftRiddles es un prototipo de aplicación web diseñado para ayudar a los estudiantes de **Fundamentos de Ingeniería de Software** a dominar los conceptos clave de las Unidades I y II a través de **acertijos interactivos**. Este prototipo se centra en una **fidelidad media-alta** de diseño (Wireframe + UI básico) y funcionalidad base para la gestión de usuarios, resolución de acertijos y un panel administrativo.

## Características Principales

### Experiencia de Usuario
* **Registro y Login:** Sistema de autenticación con validación robusta de contraseña.
* **Nombre de Usuario Único:** Generación automática de un nombre de usuario único tras el registro.
* **Navegación Intuitiva:** Acceso rápido a las secciones de Inicio, Acertijos e Historial.

### Acertijos Interactivos
* **Contenido Específico:** Acertijos basados en las Unidades I y II de Fundamentos de Ingeniería de Software.
* **Selección de Unidad:** Filtro de acertijos por Unidad I, Unidad II, o todas las unidades.
* **Retroalimentación Instantánea:** El usuario ve inmediatamente si su respuesta es correcta o incorrecta.
* **Seguimiento de Progreso:** Muestra estadísticas en tiempo real (Resueltos, Correctas, Incorrectas).
* **Historial Detallado:** Lista cronológica de los acertijos respondidos.

### Funcionalidades Administrativas (Admin Panel)
* **Gestión de Reportes:** El administrador puede ver y gestionar los problemas reportados por los usuarios sobre los acertijos.
* **Gestión de Acertijos de Usuario:** (Simulado) Permite al administrador ver y gestionar el contenido propuesto por la comunidad.

---

## Estructura del Prototipo

El prototipo se compone de tres archivos principales:

### 1. `index.html` (Estructura)
Define la estructura completa de la interfaz de usuario.
* **Header:** Contiene el logo (`SoftRiddles`), la barra de navegación (`Inicio`, `Acertijos`, `Historial`) y los botones de acción (`Iniciar Sesión`, `Registrarse`).
* **Secciones Principales:**
    * `#home`: Pantalla de bienvenida y presentación de las ventajas.
    * `#riddles`: Contenedor principal para la resolución de acertijos, incluyendo el selector de unidad.
    * `#history`: Muestra las estadísticas del usuario y la actividad reciente.
    * `#admin-panel`: Secciones de `Reportes de Usuarios` y `Gestionar Acertijos` (solo visible para el admin).
* **Modales:** Contiene los modales (ventanas emergentes) para `Login`, `Registro`, `Éxito de Registro` y `Reportar Problema`.

### 2. `style.css` (Estilos y Diseño)
Define la apariencia visual de la aplicación.
* **Variables CSS:** Define un esquema de color y sombras para la consistencia visual.
    * `--primary-color`: Azul (`#3498db`)
    * `--secondary-color`: Gris Oscuro (`#2c3e50`)
* **Diseño Responsivo:** Utiliza `@media queries` para adaptar el diseño a dispositivos móviles.
* **Componentes Clave:**
    * Estilos para los botones (`.btn-primary`, `.btn-secondary`, etc.) y las tarjetas de estadísticas (`.stat-card`).
    * Estilos específicos para el contenedor de acertijos (`.riddle-container`) y el panel de administración.
    * Indicadores visuales para la validación de contraseñas (`.requirement.valid/.invalid`).

### 3. `app.js` (Lógica y Funcionalidad)
Contiene la lógica de la aplicación y el **estado simulado** (ya que no se usa una base de datos real).

* **`appState`:** Objeto central que almacena el estado actual (usuario logueado, unidad seleccionada, estadísticas, historial, etc.).
* **`riddlesDatabase`:** Array de objetos que simula la base de datos de acertijos (incluye la pregunta, opciones, respuesta correcta y la unidad).
* **Gestión de Autenticación:** Lógica para el login, registro y validación de credenciales (incluyendo la credencial simulada de `admin`).
* **Función `loadRandomRiddle()`:** Selecciona un acertijo de forma aleatoria, asegurando que no se repitan dentro de la selección de unidad, y actualiza el progreso.
* **`handleAnswerSelection()`:** Procesa la respuesta del usuario, actualiza las estadísticas y el historial, y resalta la respuesta correcta.
* **Funciones de UI:** `updateUIAfterLogin()`, `updateStats()`, `updateHistory()` para reflejar los cambios en la interfaz.

---

## Cómo Empezar

Este es un prototipo **estático** que simula el comportamiento de una aplicación dinámica.

### Credenciales de Demostración:

| Rol | Nombre de Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `Admin123!` |
| **Usuario Regular** | *Generado en el registro* | *La que elijas (debe cumplir los requisitos)* |

***

**Próximos pasos posibles:**

1.  **Implementación de Backend:** Conectar el prototipo a una base de datos real y un servidor para persistir los datos de usuarios, acertijos e historial.

