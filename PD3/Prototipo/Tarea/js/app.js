// Estado de la aplicación
const appState = {
    currentUser: null,
    isAdmin: false,
    selectedUnit: 'all',
    riddlesAnswered: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    history: [],
    usedRiddleIds: new Set(),
    currentRiddle: null,
    userRiddles: [],
    reports: [],
    registeredUsers: new Map() // Para almacenar usuarios registrados
};

// Base de datos de acertijos
const riddlesDatabase = [
    {
        id: 1,
        question: "¿Qué paradigma de desarrollo de software se centra en la creación de prototipos iterativos y la retroalimentación continua con el cliente?",
        options: ["Modelo en Cascada", "Desarrollo Ágil", "Modelo en V", "Modelo Espiral"],
        correctAnswer: 1,
        unit: "1"
    },
    {
        id: 2,
        question: "¿Qué documento describe las funcionalidades y restricciones de un sistema de software?",
        options: ["Diagrama de casos de uso", "Especificación de requisitos", "Documento de diseño", "Plan de pruebas"],
        correctAnswer: 1,
        unit: "2"
    },
    {
        id: 3,
        question: "¿Cuál de los siguientes NO es un modelo de proceso de software?",
        options: ["Modelo en Cascada", "Modelo de Prototipos", "Modelo de Datos", "Modelo Espiral"],
        correctAnswer: 2,
        unit: "1"
    },
    {
        id: 4,
        question: "¿Qué técnica de recolección de requisitos implica observar a los usuarios en su entorno natural?",
        options: ["Entrevistas", "Cuestionarios", "Observación", "Brainstorming"],
        correctAnswer: 2,
        unit: "2"
    },
    {
        id: 5,
        question: "¿Qué diagrama UML se utiliza para modelar el comportamiento dinámico de un sistema?",
        options: ["Diagrama de Clases", "Diagrama de Casos de Uso", "Diagrama de Secuencia", "Diagrama de Componentes"],
        correctAnswer: 2,
        unit: "2"
    },
    {
        id: 6,
        question: "¿Cuál es el principal objetivo de la fase de pruebas en el desarrollo de software?",
        options: ["Documentar el código", "Identificar y corregir errores", "Diseñar la interfaz de usuario", "Optimizar el rendimiento"],
        correctAnswer: 1,
        unit: "1"
    },
    {
        id: 7,
        question: "¿Qué representa un actor en un diagrama de casos de uso?",
        options: ["Una funcionalidad del sistema", "Un rol que interactúa con el sistema", "Una clase del sistema", "Un componente hardware"],
        correctAnswer: 1,
        unit: "2"
    },
    {
        id: 8,
        question: "¿Cuál de estas características es propia del modelo de desarrollo en cascada?",
        options: ["Iteraciones rápidas", "Retroalimentación constante", "Fases secuenciales", "Entrega incremental"],
        correctAnswer: 2,
        unit: "1"
    },
    {
        id: 9,
        question: "¿Qué es un requisito no funcional?",
        options: ["Una característica que el sistema debe tener", "Una restricción sobre cómo el sistema realiza sus funciones", "Un caso de uso del sistema", "Un diagrama del sistema"],
        correctAnswer: 1,
        unit: "2"
    },
    {
        id: 10,
        question: "¿En qué fase del desarrollo de software se definen los casos de prueba?",
        options: ["Diseño", "Implementación", "Pruebas", "Análisis de requisitos"],
        correctAnswer: 0,
        unit: "1"
    }
];

// Credenciales de administrador
const adminCredentials = {
    username: "admin",
    password: "Admin123!"
};

// Elementos del DOM
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const successModal = document.getElementById('success-modal');
const reportModal = document.getElementById('report-modal');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');
const closeSuccess = document.getElementById('close-success');
const closeReport = document.getElementById('close-report');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const reportForm = document.getElementById('report-form');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const nextRiddleBtn = document.getElementById('next-riddle');
const reportBtn = document.getElementById('report-btn');
const startNowBtn = document.getElementById('start-now-btn');
const totalAnswered = document.getElementById('total-answered');
const correctAnswers = document.getElementById('correct-answers');
const incorrectAnswers = document.getElementById('incorrect-answers');
const historyList = document.getElementById('history-list');
const registerSubmit = document.getElementById('register-submit');
const passwordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordMatch = document.getElementById('password-match');
const generatedUsername = document.getElementById('generated-username');
const currentQuestion = document.getElementById('current-question');
const currentUnit = document.getElementById('current-unit');
const currentRiddleNumber = document.getElementById('current-riddle-number');
const totalRiddles = document.getElementById('total-riddles');
const adminNav = document.querySelectorAll('.admin-nav');
const adminSections = document.querySelectorAll('.admin-section');
const reportsList = document.getElementById('reports-list');
const riddlesList = document.getElementById('riddles-list');
const unitButtons = document.querySelectorAll('.unit-btn');

// Navegación entre secciones
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        // Si el usuario no es admin y trata de acceder al panel de admin
        if (targetSection === 'admin-panel' && !appState.isAdmin) {
            alert('No tienes permisos para acceder al panel de administración.');
            return;
        }
        
        showSection(targetSection);
    });
});

// Función para mostrar una sección específica
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
}

// Botón "Comenzar Ahora" lleva directamente a acertijos
startNowBtn.addEventListener('click', () => {
    if (!appState.currentUser) {
        alert('Debes iniciar sesión para acceder a los acertijos.');
        loginModal.style.display = 'flex';
        return;
    }
    showSection('riddles');
});

// Mostrar modal de inicio de sesión
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Mostrar modal de registro
registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
});

// Cerrar modales
closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

closeRegister.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

closeSuccess.addEventListener('click', () => {
    successModal.style.display = 'none';
});

closeReport.addEventListener('click', () => {
    reportModal.style.display = 'none';
});

// Cambiar entre modales de login y registro
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Validación de contraseña en tiempo real
passwordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validatePassword);

function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validar requisitos de contraseña
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Actualizar indicadores visuales
    updateRequirement('req-length', hasMinLength);
    updateRequirement('req-uppercase', hasUpperCase);
    updateRequirement('req-lowercase', hasLowerCase);
    updateRequirement('req-number', hasNumber);
    updateRequirement('req-special', hasSpecialChar);
    
    // Verificar si las contraseñas coinciden
    const passwordsMatch = password === confirmPassword && password !== '';
    
    if (confirmPassword !== '') {
        if (passwordsMatch) {
            passwordMatch.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Las contraseñas coinciden';
        } else {
            passwordMatch.innerHTML = '<i class="fas fa-times-circle" style="color: var(--accent-color);"></i> Las contraseñas no coinciden';
        }
    } else {
        passwordMatch.innerHTML = '';
    }
    
    // Habilitar o deshabilitar el botón de registro
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;
    registerSubmit.disabled = !isPasswordValid;
}

function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        element.innerHTML = '<i class="fas fa-check-circle"></i> ' + element.textContent.substring(element.textContent.indexOf(' ') + 1);
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        element.innerHTML = '<i class="fas fa-times-circle"></i> ' + element.textContent.substring(element.textContent.indexOf(' ') + 1);
    }
}

// Generar nombre de usuario único
function generateUsername(name) {
    const baseName = name.split(' ')[0].toLowerCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${baseName}${randomNum}`;
}

// Procesar registro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validar que el nombre no esté vacío
    if (!name.trim()) {
        alert('Por favor, ingresa tu nombre completo.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    // Generar nombre de usuario único
    const username = generateUsername(name);
    
    // Guardar usuario en el sistema
    appState.registeredUsers.set(username, {
        name: name,
        password: password,
        username: username
    });
    
    // Mostrar modal de éxito con el nombre de usuario
    generatedUsername.textContent = username;
    registerModal.style.display = 'none';
    successModal.style.display = 'flex';
    
    // Limpiar formulario
    registerForm.reset();
});

// Procesar inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Verificar credenciales de administrador
    if (username === adminCredentials.username && password === adminCredentials.password) {
        appState.currentUser = username;
        appState.isAdmin = true;
        updateUIAfterLogin();
        loginModal.style.display = 'none';
        loginForm.reset();
        showSection('admin-panel');
        return;
    }
    
    // Verificar credenciales de usuario regular
    const user = appState.registeredUsers.get(username);
    if (user && user.password === password) {
        appState.currentUser = username;
        appState.isAdmin = false;
        updateUIAfterLogin();
        loginModal.style.display = 'none';
        loginForm.reset();
        showSection('home');
    } else {
        alert('Credenciales incorrectas. Verifica tu nombre de usuario y contraseña.');
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    appState.currentUser = null;
    appState.isAdmin = false;
    updateUIAfterLogout();
});

// Actualizar UI después del login
function updateUIAfterLogin() {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    usernameDisplay.textContent = appState.currentUser;
    
    // Si es admin, agregar enlace al panel de administración
    if (appState.isAdmin) {
        const adminLink = document.createElement('li');
        adminLink.innerHTML = '<a href="#" data-section="admin-panel"><i class="fas fa-cogs"></i> Administración</a>';
        document.querySelector('nav ul').appendChild(adminLink);
        
        // Agregar evento al nuevo enlace
        adminLink.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            showSection('admin-panel');
        });
        
        // Cargar datos de administración
        loadAdminData();
    } else {
        // Cargar un acertijo para usuarios normales
        loadRandomRiddle();
    }
}

// Actualizar UI después del logout
function updateUIAfterLogout() {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    userInfo.style.display = 'none';
    
    // Eliminar enlace de administración si existe
    const adminLink = document.querySelector('a[data-section="admin-panel"]');
    if (adminLink) {
        adminLink.parentElement.remove();
    }
    
    // Volver a la sección de inicio
    showSection('home');
    
    // Reiniciar estado de acertijos
    appState.usedRiddleIds.clear();
    appState.currentRiddle = null;
}

// Selector de unidades
unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar clase active de todos los botones
        unitButtons.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón seleccionado
        btn.classList.add('active');
        
        // Actualizar unidad seleccionada
        appState.selectedUnit = btn.getAttribute('data-unit');
        
        // Reiniciar acertijos usados para la nueva unidad
        appState.usedRiddleIds.clear();
        
        // Cargar un nuevo acertijo
        loadRandomRiddle();
    });
});

// Cargar un acertijo aleatorio que no se haya mostrado antes
function loadRandomRiddle() {
    // Si ya se han mostrado todos los acertijos, reiniciar
    if (appState.usedRiddleIds.size >= riddlesDatabase.length) {
        appState.usedRiddleIds.clear();
    }
    
    // Filtrar acertijos por unidad seleccionada
    let availableRiddles = riddlesDatabase.filter(riddle => 
        !appState.usedRiddleIds.has(riddle.id) && 
        (appState.selectedUnit === 'all' || riddle.unit === appState.selectedUnit)
    );
    
    if (availableRiddles.length === 0) {
        // Si no hay acertijos disponibles, mostrar mensaje
        currentQuestion.textContent = "¡Has completado todos los acertijos disponibles para esta unidad!";
        optionsContainer.innerHTML = "";
        return;
    }
    
    // Seleccionar un acertijo aleatorio
    const randomIndex = Math.floor(Math.random() * availableRiddles.length);
    const riddle = availableRiddles[randomIndex];
    
    // Marcar como usado
    appState.usedRiddleIds.add(riddle.id);
    appState.currentRiddle = riddle;
    
    // Actualizar la interfaz
    currentQuestion.textContent = riddle.question;
    currentUnit.textContent = riddle.unit === "1" ? "Unidad I" : "Unidad II";
    currentRiddleNumber.textContent = appState.usedRiddleIds.size;
    totalRiddles.textContent = riddlesDatabase.filter(r => 
        appState.selectedUnit === 'all' || r.unit === appState.selectedUnit
    ).length;
    
    // Limpiar opciones anteriores
    optionsContainer.innerHTML = "";
    
    // Crear botones para cada opción
    riddle.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.setAttribute('data-index', index);
        
        optionBtn.addEventListener('click', handleAnswerSelection);
        
        optionsContainer.appendChild(optionBtn);
    });
    
    // Restablecer feedback
    feedback.style.display = 'none';
    feedback.className = 'feedback';
}

// Manejar selección de respuesta
function handleAnswerSelection(e) {
    // Solo permitir respuesta si el usuario ha iniciado sesión
    if (!appState.currentUser) {
        alert('Debes iniciar sesión para responder acertijos.');
        return;
    }
    
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
    const isCorrect = selectedIndex === appState.currentRiddle.correctAnswer;
    
    // Deshabilitar todas las opciones después de seleccionar una
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        
        // Resaltar la respuesta correcta
        if (parseInt(option.getAttribute('data-index')) === appState.currentRiddle.correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Aplicar estilos según si es correcta o incorrecta
    if (isCorrect) {
        selectedOption.classList.add('correct');
        feedback.textContent = '¡Correcto!';
        feedback.classList.add('correct');
        appState.correctAnswers++;
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = 'Incorrecto. Intenta con el siguiente acertijo.';
        feedback.classList.add('incorrect');
        appState.incorrectAnswers++;
    }
    
    feedback.style.display = 'block';
    appState.riddlesAnswered++;
    
    // Actualizar estadísticas
    updateStats();
    
    // Agregar al historial
    const historyItem = {
        question: appState.currentRiddle.question,
        correct: isCorrect,
        date: new Date().toLocaleDateString()
    };
    
    appState.history.unshift(historyItem);
    updateHistory();
}

// Siguiente acertijo
nextRiddleBtn.addEventListener('click', () => {
    loadRandomRiddle();
});

// Mostrar modal de reporte
reportBtn.addEventListener('click', () => {
    if (!appState.currentUser) {
        alert('Debes iniciar sesión para reportar problemas.');
        return;
    }
    
    reportModal.style.display = 'flex';
});

// Enviar reporte
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('report-description').value;
    
    // Crear reporte
    const report = {
        id: Date.now(),
        user: appState.currentUser,
        riddle: appState.currentRiddle.question,
        description: description,
        date: new Date().toLocaleDateString()
    };
    
    // Agregar a la lista de reportes
    appState.reports.push(report);
    
    alert('Reporte enviado. Gracias por tu feedback.');
    reportModal.style.display = 'none';
    reportForm.reset();
});

// Navegación en el panel de administración
adminNav.forEach(nav => {
    nav.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = nav.getAttribute('data-section');
        
        adminNav.forEach(n => n.classList.remove('active'));
        nav.classList.add('active');
        
        adminSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`${targetSection}-section`).classList.add('active');
    });
});

// Cargar datos para el panel de administración
function loadAdminData() {
    // Cargar reportes
    if (appState.reports.length > 0) {
        reportsList.innerHTML = '';
        appState.reports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `
                <div class="report-header">
                    <strong>Reporte #${report.id}</strong>
                    <span>Fecha: ${report.date}</span>
                </div>
                <p><strong>Usuario:</strong> ${report.user}</p>
                <p><strong>Acertijo:</strong> ${report.riddle}</p>
                <p><strong>Problema reportado:</strong> ${report.description}</p>
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="markReportAsResolved(${report.id})"><i class="fas fa-check"></i> Marcar como Resuelto</button>
                    <button class="btn btn-danger" onclick="deleteReport(${report.id})"><i class="fas fa-trash"></i> Eliminar Reporte</button>
                </div>
            `;
            reportsList.appendChild(reportItem);
        });
    } else {
        reportsList.innerHTML = '<div class="empty-state"><i class="fas fa-flag"></i><p>No hay reportes pendientes</p></div>';
    }
    
    // Cargar acertijos de usuarios (simulado)
    if (appState.userRiddles.length > 0) {
        riddlesList.innerHTML = '';
        appState.userRiddles.forEach(riddle => {
            const riddleItem = document.createElement('div');
            riddleItem.className = 'riddle-item';
            riddleItem.innerHTML = `
                <div class="riddle-header">
                    <strong>Acertijo #${riddle.id}</strong>
                    <span>Usuario: ${riddle.user}</span>
                </div>
                <p><strong>Pregunta:</strong> ${riddle.question}</p>
                <p><strong>Opciones:</strong> 
                    <ul>
                        ${riddle.options.map((option, index) => `<li>${String.fromCharCode(65 + index)}) ${option}</li>`).join('')}
                    </ul>
                </p>
                <p><strong>Respuesta correcta:</strong> ${String.fromCharCode(65 + riddle.correctAnswer)}) ${riddle.options[riddle.correctAnswer]}</p>
                <div class="riddle-actions">
                    <button class="btn btn-primary" onclick="editRiddle(${riddle.id})"><i class="fas fa-edit"></i> Modificar</button>
                    <button class="btn btn-danger" onclick="deleteRiddle(${riddle.id})"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `;
            riddlesList.appendChild(riddleItem);
        });
    } else {
        riddlesList.innerHTML = '<div class="empty-state"><i class="fas fa-puzzle-piece"></i><p>No hay acertijos enviados por usuarios</p></div>';
    }
}

// Funciones para el panel de administración (simuladas)
window.markReportAsResolved = function(reportId) {
    appState.reports = appState.reports.filter(report => report.id !== reportId);
    loadAdminData();
    alert('Reporte marcado como resuelto.');
};

window.deleteReport = function(reportId) {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
        appState.reports = appState.reports.filter(report => report.id !== reportId);
        loadAdminData();
    }
};

window.editRiddle = function(riddleId) {
    alert(`Funcionalidad de edición para acertijo ${riddleId} (simulada)`);
};

window.deleteRiddle = function(riddleId) {
    if (confirm('¿Estás seguro de que quieres eliminar este acertijo?')) {
        appState.userRiddles = appState.userRiddles.filter(riddle => riddle.id !== riddleId);
        loadAdminData();
    }
};

// Actualizar estadísticas
function updateStats() {
    totalAnswered.textContent = appState.riddlesAnswered;
    correctAnswers.textContent = appState.correctAnswers;
    incorrectAnswers.textContent = appState.incorrectAnswers;
}

// Actualizar historial
function updateHistory() {
    if (appState.history.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No hay historial disponible. Resuelve algunos acertijos para ver tu progreso.</p></div>';
        return;
    }
    
    historyList.innerHTML = '';
    appState.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div>
                <strong>${item.question}</strong>
                <div style="margin-top: 0.5rem; color: ${item.correct ? 'var(--success-color)' : 'var(--accent-color)'}; display: flex; align-items: center;">
                    <i class="fas fa-${item.correct ? 'check' : 'times'}-circle" style="margin-right: 5px;"></i>
                    ${item.correct ? 'Correcto' : 'Incorrecto'}
                </div>
            </div>
            <div>${item.date}</div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Inicializar la aplicación
updateStats();
updateHistory();

// Agregar algunos acertijos de usuarios para demostración
appState.userRiddles.push({
    id: 101,
    user: "usuario123",
    question: "¿Qué es un diagrama de clases en UML?",
    options: ["Representa la estructura estática del sistema", "Muestra la interacción entre objetos", "Describe los casos de uso", "Modela el flujo de datos"],
    correctAnswer: 0,
    unit: "2"
});