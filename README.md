# 🧩 SoftRiddles Update Log

---

## Etapa 1: Versión Alpha (v0.1.0) - 25 de septiembre de 2025

Esta versión **alfa inicial** establece la fundación conceptual, metodológica y documental completa para el proyecto **SoftRiddles**.  
Define el producto, su alcance, los usuarios objetivo, la arquitectura de requerimientos y el proceso de desarrollo que guiará la construcción de la plataforma.

###  Definición del Producto

**Objetivo:**  
Desarrollar una página web que facilita el estudio de *Fundamentos de Ingeniería de Software* (Unidades 1 y 2) mediante acertijos generados por IA.

**Usuarios definidos:**
- **Primarios:** Alumnos y profesores de primer semestre de Ingeniería de Software en la UADY.  
- **Secundarios:** Alumnos y profesores de otras universidades.  
- **Potenciales:** Aspirantes a la carrera.

**Alcance:**  
El sistema permitirá a los usuarios registrarse, recibir acertijos de forma aleatoria (uno a la vez) y obtener retroalimentación inmediata sobre sus respuestas.

**Propuesta de Valor:**  
Ofrecer una solución interactiva y atractiva para repasar contenidos, fomentando el estudio individual y colaborativo.

---

### Requerimientos y Casos de Uso

**Requisitos Funcionales (RF):**
- Sistema de autenticación (registro, inicio de sesión, cambio de contraseña).  
- Almacenamiento de definiciones y acertijos de la materia.  
- Generación de nuevos acertijos mediante prompts.  
- Filtro de acertijos por unidad temática.  
- Funciones de administrador para gestionar prompts y acertijos.  

**Requisitos No Funcionales (RNF):**
- **Rendimiento:** La página debe responder en ≤ 5 segundos y soportar 100 usuarios activos.  
- **Disponibilidad:** 99.9%.  
- **Usabilidad:** Compatibilidad con navegadores y dispositivos móviles.  
- **Seguridad:** Los datos solo pueden ser modificados por administradores.

**Artefactos Generados:**
- Diagrama de Casos de Uso inicial (“Usuario” y “Administrador”).

---

### Proceso y Metodología

**Metodología:**  
Proceso de desarrollo estructurado inspirado en metodologías ágiles (**Scrum**).

**Flujo de trabajo:**
- Reuniones de coordinación semanales.  
- Sprints con entregables parciales.  
- Retroalimentación continua e iteraciones.

**Roles del Equipo:**
- Coordinación (Líder de equipo)  
- Creación del Producto (Generador de contenido)  
- Desarrollo (Programador)  
- Control de Calidad (Tester)  
- Documentación (Responsable de reportes)

**Competencias Clave:**  
Trabajo en equipo, comunicación efectiva, uso de GitHub y documentación técnica.

---

### Estructura de Documentación (Primera Entrega)

- `README.md` — Vista general del proyecto.  
- `Descripcion-del-producto.pdf` — Qué, por qué y para quién.  
- `Documento-de-requerimientos.pdf` — RF y RNF detallados.  
- `caso-de-uso.png` — Diagrama visual.  
- `Descripcion-del-Proceso.md` — Metodología y roles.  
- `Gestion-del-Proceso.md` — Checklist de actividades.  
- `metricas.md` — Responsabilidades por artefacto.  
- `Competencias.pdf` — Habilidades aplicadas.

---

## ⚙️ Etapa 2: Versión Beta (v1.0.0) - 31 de octubre de 2025
## VIDEO: https://drive.google.com/file/d/1iu65tNhsEbAKndkYuVHc-NwjQqJTr6NG/view?usp=sharing


Esta versión marca una **evolución significativa** desde el concepto alfa.  
El proyecto ha pivotado de un generador de acertijos basado en prompts a una **plataforma de quizzes interactiva**, desarrollando un **prototipo funcional simulado** de fidelidad media-alta.  

Incluye un proceso **Scrum refinado**, una evolución de requerimientos (**v2**) y un **Product Backlog completo**.

---

### 💻 Prototipo Funcional (Simulado)

**Tecnología:**
- `index.html` (estructura)  
- `style.css` (diseño)  
- `app.js` (lógica y estado simulado)

**Diseño:**  
Interfaz de fidelidad media-alta, esquema de color azul primario `#3498db`, diseño responsivo.

**Estado Simulado:**  
La lógica del frontend se gestiona con un objeto `appState` y una base de datos simulada `riddlesDatabase`.

**Credenciales de Admin (Demo):**
Usuario: admin
Contraseña: Admin123!

---

### Características Clave Implementadas (Frontend)

- **Autenticación:** Registro y Login con validación.  
- **Juego de Quizzes:**  
  - Filtro por Unidad I, Unidad II o todas.  
  - Función `loadRandomRiddle()` evita repeticiones.  
  - Retroalimentación instantánea (correcto/incorrecto).  
- **Seguimiento de Progreso:**  
  - Estadísticas en tiempo real (Resueltos, Correctas, Incorrectas).  
- **Historial:** Lista cronológica de respuestas.  
- **Administración (Simulada):**  
  - Panel `#admin-panel` para gestión de reportes de usuarios.

---

### Evolución de Requerimientos (Versión 2)

**Actualización:** 09/10/2025  

**Alcanse:**  
Se descarta la generación por *prompts* y se implementa una **API (Gemini AI)** para generar quizzes.

**Nuevos Requisitos Funcionales:**
1. Los usuarios pueden reportar errores en los ejercicios.  
2. Los usuarios pueden ver su historial de progreso.  
3. El administrador puede asignar permisos de administrador a otras cuentas.  
4. Los administradores pueden ver los reportes de errores.  

**Nuevos Requisitos No Funcionales:**
- **Seguridad:** Uso de `Argon2id` para la encriptación de contraseñas.

**Artefacto Actualizado:**  
Diagrama de Casos de Uso (v2) con:
- “Reportar problemas”  
- “Visualizar historial”  
- “Dar permisos de administrador”

---

### Proceso y Metodología (Scrum)

**Metodología:**  
Adopción formal de **Scrum**, con roles definidos (Product Owner, Scrum Master).

**Ritmo de trabajo:**
- *Sprints semanales*  
- *Daily meetings* (10 min)  
- *Reuniones de revisión y retrospectiva semanales*

**Artefactos de Gestión:**
- `Product-Backlog.md` con 20 requisitos, complejidad (Fibonacci), prioridad y criterios de aceptación.  
- Bitácoras de reuniones y sprints documentadas.  

**Prototipado:**  
IA **DeepSeek** utilizada para el prototipo exploratorio inicial en HTML.

**Colaboración:**  
Organización mejorada del repositorio GitHub mediante ramas individuales para documentos y desarrollo.

---

✅ **Fin del Registro de Actualizaciones**  
> Proyecto: *SoftRiddles — Ingeniería de Software Interactiva*  
> Última actualización: **31 de octubre de 2025**
