# Matriz de Trazabilidad de Requisitos

| ID Requisito | Descripción del Requisito | Tipo de requisito | Prioridad | Ubicación en el Prototipo | Estado de Implementación | Observaciones |
|--------------|---------------------------|-------------------|-----------|------------------------|----------------------|-------------|
| SR-001 | Sistema de registro e inicio de sesión | Funcional | Alta | Sección "Registro" e "Inicio de sesión" | Implementado | Formularios funcionando correctamente |
| SR-002 | Base de datos enlazada | Funcional | Alta | Backend | Implementado | Registro y recuperación de datos en la Base de Datos funcionando |
| SR-003 | Interfaz de usuario completa y consistente | No funcional | Alta | Todas las secciones frontend del prototipo | Implementado | Diseño consistente en todas las pantallas |
| SR-004 | Proveer ejercicios de FIS | Funcional | Alta | Sección "Quiz" | Implementado | Los ejercicios se muestran correctamente |
| SR-005 | Administradores pueden modificar ejercicios | Funcional | Alta | Sección "Administración">"Gestionar Quiz" (solo admin) | Implementado | La ventana para gestionar los quizzes permite eliminar una pregunta o modificar sus elementos (pregunta, opciones, respuesta correcta, unidad), guardando los cambios correctamente |
| SR-006 | Cambios reflejados inmediatamente | No funcional | Alta | Sección "Administración" y "Quiz" | Implementado | Los cambios se muestran correctamente después de modificar preguntas |
| SR-007 | Encriptación Argon2id | No funcional | Alta | Backend | Implementado | La información sensible de los usuarios está encriptada en la BD |
| SR-008 | Interfaz intuitiva | No funcional | Media | Todas las secciones | Implementado | Navegación clara y consistente según pruebas informales |
| SR-009 | Generar acertijos via API | Funcional | Media | Sección "Quiz" | Implementado | Endpoint funcional en Render.com. URL: https://softriddles.onrender.com/api/generar-quiz |
| SR-010 | Seleccionar unidad específica | Funcional | Media | Selector de unidad en "Quiz" | Implementado | Filtra por Unidad I, II o ambas, con botones correctamente |
| SR-011 | Reportar errores en ejercicios | Funcional | Media | Botón "Reportar problema" en cada quiz | Implementado | Botón y formulario de reporte funcionando |
| SR-012 | Ver historial de actividades | Funcional | Media | Sección "Historial" | Implementado | Se muestra el historial preguntas resueltas por el usuario correctamente |
| SR-013 | Los administradores pueden ver reportes | Funcional | Media | Sección "Administración">"Reportes de Usuarios" (solo admin) | Implementado | Se muestran los reportes de los usuarios y permite marcarlos como resueltos correctamente |
| SR-014 | Tiempo respuesta menor o igual a 5 segundos | No funcional | Media | Backend | Implementado | Todas las funcionalidades responden dentro del margen de tiempo establecido |
| SR-015 | Diseño responsivo | No funcional | Media | Todas las secciones | Implementado | La interfaz se adapta a móviles, portátiles y computadores de escritorio correctamente |
| SR-016 | Información básica del ejercicio | No funcional | Media | Sección "Quiz" | Implementado | Cada pregunta muestra su unidad y los botones de navegación correspondientes |
| SR-017 | Indicador visual de respuestas | No funcional | Media | Sección "Quiz" | Implementado | Retroalimentación visual inmediata al seleccionar respuestas, con colores distintivos (verde y rojo) |
| SR-018 | Asignar roles de administrador | Funcional | Baja | Sección "Administración">"Gestión de Usuarios" (solo admin) | Implementado | Funcionalidades de "Hacer admin" y "Quitar admin" se ejecutan correctamente |
| SR-019 | Soporte para 100 usuarios simultáneos | No funcional | Baja | N/A (prueba técnica) | Implementado | Prueba de conexiones exitosa |
| SR-020 | Disponibilidad 99.9% | No funcional | Baja | N/A (prueba técnica) | Implementado | Página web y API estuvieron disponibles durante una semana |
| SR-021 | Compatibilidad de diseño en diferentes navegadores | No funcional | Baja | N/A (prueba técnica) | Implementado | Pruebas superadas en navegadores populares (Opera, Chrome, Brave, Edge, Firefox y Safari) |