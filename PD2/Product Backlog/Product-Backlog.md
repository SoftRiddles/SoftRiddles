# PRODUCT BACKLOG

| FECHA | Requisitos | Tarea | TIEMPO ESTIMADO (horas) | PRIORIDAD | Responsable | CONDICION | ESTATUS | LEYENDA DE PRIORIDAD |
|-------|------------|-------|-------------------------|-----------|-------------|-----------|---------|---------------------|
|  | La página web deberá tener un sistema para registro e inicio de sesión | Crear formulario de registro e inicio de sesión en frontend | 24 | 3 |  | Pendiente | No aprobado | NO PRIORITARIO |
|  |  | Hacer que el botón de registro envíe los datos al backend |  |  |  | Pendiente | No aprobado | REGULAR |
|  |  | Implementar validaciones de campos (correo, contraseña) |  |  |  | Pendiente | No aprobado | PRIORIDAD |
|  |  | Crear endpoint register y login en backend |  |  |  | Pendiente | No aprobado |  |
|  |  | Encriptar contraseñas con Argon2id |  |  |  | Pendiente | No aprobado |  |
|  |  | Generar y almacenar token JWT para sesión |  |  |  | Pendiente | No aprobado |  |
|  |  | Implementar cierre de sesión y persistencia de sesión en frontend |  |  |  | Pendiente | No aprobado |  |
|  |  | Probar el flujo completo de login y registro |  |  |  | Pendiente | No aprobado |  |
|  | La pagína web deberá tener una base de datos enlazada | Crear base de datos (por ejemplo en MySQL) | 15 | 3 |  | Pendiente | No aprobado |  |
|  |  | Diseñar tablas: usuarios, ejercicios, reportes, historial |  |  |  | Pendiente | No aprobado |  |
|  |  | Configurar conexión con el backend |  |  |  | Pendiente | No aprobado |  |
|  |  | Probar la conexión e inserción de datos desde backend |  |  |  | Pendiente | No aprobado |  |
|  |  | Crear archivo de configuración segura (variables de entorno) |  |  |  | Pendiente | No aprobado |  |
|  | Diseñar primer prototipo de interfaz | Crear boceto en Figma o Canva con navegación básica | 12 | 3 |  | Pendiente | No aprobado |  |
|  |  | Diseñar pantallas de inicio, login, ejercicios y perfil |  |  |  | Pendiente | No aprobado |  |
|  |  | Establecer colores, tipografía y estilo general |  |  |  | Pendiente | No aprobado |  |
|  |  | Recoger retroalimentación del equipo o cliente |  |  |  | Pendiente | No aprobado |  |
|  | El sistema debe de tener una interfaz intuitiva | Aplicar principios UX/UI (consistencia, simplicidad, jerarquía visual) | 11 | 2 |  | Pendiente | No aprobado |  |
|  |  | Incluir botones y menús claros |  |  |  | Pendiente | No aprobado |  |
|  |  | Implementar retroalimentación visual (mensajes, alertas) |  |  |  | Pendiente | No aprobado |  |
|  |  | Realizar pruebas de usabilidad con usuarios |  |  |  | Pendiente | No aprobado |  |
|  | El sistema debe guardar definiciones y proveer ejercicios de los temas de Fundamentos de Ingeniería de software | Crear ejercicios en la base de datos | 15 | 3 |  | Pendiente | No aprobado |  |
|  |  | Diseñar formulario para eliminar y editar ejercicios |  |  |  | Pendiente | No aprobado |  |
|  |  | Implementar lógica de guardado desde backend |  |  |  | Pendiente | No aprobado |  |
|  |  | Mostrar lista de ejercicios en interfaz del usuario |  |  |  | Pendiente | No aprobado |  |
|  |  | Permitir acceder a las definiciones antes de cada ejercicio |  |  |  | Pendiente | No aprobado |  |
|  | El sistema debe generar acertijos nuevos por medio de una API de IA | Seleccionar API de IA (GeminiAI) | 26 | 2 |  | Pendiente | No aprobado |  |
|  |  | Obtener clave API y configurarla en backend. |  |  |  | Pendiente | No aprobado |  |
|  |  | Crear endpoint /generar-acertijo. |  |  |  | Pendiente | No aprobado |  |
|  |  | Definir prompt para generar acertijos de software. |  |  |  | Pendiente | No aprobado |  |
|  |  | Enviar solicitud POST a la API con el prompt. |  |  |  | Pendiente | No aprobado |  |
|  |  | Procesar y formatear respuesta de la IA. |  |  |  | Pendiente | No aprobado |  |
|  |  | Mostrar acertijo en interfaz del usuario. |  |  |  | Pendiente | No aprobado |  |
|  |  | Agregar botón "Siguiente acertijo". |  |  |  | Pendiente | No aprobado |  |
|  |  | Guardar acertijo en base de datos para usar despues |  |  |  | Pendiente | No aprobado |  |
|  | El sistema debe tener una opción para seleccionar una unidad específica de la materia para generar ejercicios únicamente de la misma | Crear campo desplegable con unidades (1, 2) | 11 | 2 |  | Pendiente | No aprobado |  |
|  |  | Enviar unidad seleccionada al backend |  |  |  | Pendiente | No aprobado |  |
|  |  | Filtrar ejercicios según la unidad elegida |  |  |  | Pendiente | No aprobado |  |
|  |  | Mostrar ejercicios filtrados en la interfaz |  |  |  | Pendiente | No aprobado |  |
|  | Los usuarios podrán reportar errores para cada ejercicio | Agregar botón "Reportar error" debajo de cada ejercicio | 14 | 2 |  | Pendiente | No aprobado |  |
|  |  | Crear formulario modal para escribir el problema |  |  |  | Pendiente | No aprobado |  |
|  |  | Enviar reporte al backend (endpoint /reportes) |  |  |  | Pendiente | No aprobado |  |
|  |  | Guardar reporte en tabla reportes |  |  |  | Pendiente | No aprobado |  |
|  |  | Confirmar al usuario que su reporte fue enviado |  |  |  | Pendiente | No aprobado |  |
|  | Los usuarios pueden ver su historial en una sección específica | Crear vista "Historial" en frontend. | 11 | 2 |  | Pendiente | No aprobado |  |
|  |  | Crear vista de ejercicios resueltos totales |  |  |  | Pendiente | No aprobado |  |
|  |  | Mostrar fecha, resultado y tema en una tabla. |  |  |  | Pendiente | No aprobado |  |
|  |  | Implementar búsqueda por filtrado de tiempo |  |  |  | Pendiente | No aprobado |  |
|  | El administrador va a poder asignar permisos de administrador a otros usuarios | Crear campo rol en tabla usuarios en la base de datos | 10 | 1 |  | Pendiente | No aprobado |  |
|  |  | Implementar vista "Gestión de usuarios" para administradores. |  |  |  | Pendiente | No aprobado |  |
|  |  | Añadir opción para cambiar rol de usuario a "admin". |  |  |  | Pendiente | No aprobado |  |
|  |  | Validar privilegios en backend. |  |  |  | Pendiente | No aprobado |  |
|  | Los administradores pueden cambiar y/o eliminar los ejercicios | Crear interfaz para edición y eliminación de ejercicios. | 12 | 3 |  | Pendiente | No aprobado |  |
|  |  | Implementar endpoints /editar-ejercicio y /eliminar-ejercicio. |  |  |  | Pendiente | No aprobado |  |
|  |  | Proteger rutas solo para usuarios admin. |  |  |  | Pendiente | No aprobado |  |
|  |  | Confirmar acción antes de eliminar. |  |  |  | Pendiente | No aprobado |  |
|  | Los administradores podrán ver los reportes que los usuarios hagan a determinados ejercicios | Crear vista "Reportes" solo accesible para administradores. | 11 | 2 |  | Pendiente | No aprobado |  |
|  |  | Obtener lista de reportes desde el backend. |  |  |  | Pendiente | No aprobado |  |
|  |  | Mostrar usuario, ejercicio y descripción del error. |  |  |  | Pendiente | No aprobado |  |
|  |  | Agregar filtro por fecha o tema. |  |  |  | Pendiente | No aprobado |  |
|  | Los ejercicios modificados por los administradores deben de ser reflejados para todos los usuarios | Configurar el frontend para que cargue los ejercicios directamente desde la base de datos. | 9 | 3 |  | Pendiente | No aprobado |  |
|  |  | Actualizar caché o estado al modificar ejercicios. |  |  |  | Pendiente | No aprobado |  |
|  |  | Probar que los cambios se vean en tiempo real. |  |  |  | Pendiente | No aprobado |  |
|  | La página web debe responder a toda solicitud en un tiempo menor o igual a 5 segundos | Optimizar consultas en base de datos | 11 | 2 |  | Pendiente | No aprobado |  |
|  |  | Implementar caché (si es necesario) |  |  |  | Pendiente | No aprobado |  |
|  |  | Minimizar archivos CSS/JS |  |  |  | Pendiente | No aprobado |  |
|  |  | Probar tiempos de carga con herramientas como Lighthouse |  |  |  | Pendiente | No aprobado |  |
|  | La página web debe ser capaz de operar con 100 usuarios activos simultáneamente | Realizar pruebas de carga (Stress Test con JMeter o Artillery) | 10 | 1 |  | Pendiente | No aprobado |  |
|  |  | Optimizar endpoints críticos |  |  |  | Pendiente | No aprobado |  |
|  |  | Configurar servidor con buena concurrencia |  |  |  | Pendiente | No aprobado |  |
|  |  | Usar balanceo de carga si aplica |  |  |  | Pendiente | No aprobado |  |
|  | Los datos de la página web solo podrán ser cambiados por los administradores | Añadir middleware de autenticación en backend | 9 | 3 |  | Pendiente | No aprobado |  |
|  |  | Validar token y rol antes de permitir modificaciones |  |  |  | Pendiente | No aprobado |  |
|  |  | Probar intentos de modificación con usuario normal |  |  |  | Pendiente | No aprobado |  |
|  | Los datos de usuarios estarán encriptados por Argon2id | Configurar encriptación al registrar usuario | 9 | 3 |  | Pendiente | No aprobado |  |
|  |  | Implementar comparación segura en login |  |  |  | Pendiente | No aprobado |  |
|  |  | Asegurar que no se almacenen contraseñas planas |  |  |  | Pendiente | No aprobado |  |
|  | La página web debe estar disponible el 99.9% del tiempo | Implementar monitoreo (busqueda de herramienta) | 4 | 1 |  | Pendiente | No aprobado |  |
|  |  | Usar hosting confiable (hostinger) |  |  |  | Pendiente | No aprobado |  |
|  | La página web debe estar disponible para usuarios de dispositivos móviles y computadoras | Usar diseño responsivo (Bootstrap) | 8 | 2 |  | Pendiente | No aprobado |  |
|  |  | Probar en distintos tamaños de pantalla |  |  |  | Pendiente | No aprobado |  |
|  |  | Ajustar botones, textos e imágenes |  |  |  | Pendiente | No aprobado |  |
|  | La página web debe mantener un mismo diseño para diferentes navegadores | Probar en Chrome, Edge, Firefox y Safari | 4 | 1 |  | Pendiente | No aprobado |  |
|  |  | Asegurar compatibilidad CSS/JS |  |  |  | Pendiente | No aprobado |  |