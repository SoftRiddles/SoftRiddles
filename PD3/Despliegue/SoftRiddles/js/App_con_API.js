/*
  SoftRiddles App - JavaScript Principal
  ARQUITECTURA: 100% PHP/MySQL
  
  Parte 1-9: (COMPLETADO)
  Parte 10: Gestión de Cuenta (COMPLETADO)
  
  MEJORAS: 
  - Modal de error personalizado (reemplaza 'alert')
  - Toggle de visibilidad de contraseña
  - Corrección de bug visual en feedback de quiz
  - ¡NUEVO! Corrección de bug en registro duplicado
  
  ACTUALIZACIÓN:
  - Integración de API Python con fallback a RAG/Gemini.
*/

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const appState = {
    currentUser: null,
    isAdmin: false,
    selectedUnit: 'all', 
    currentRiddle: null
};

// --- ELEMENTOS DEL DOM (CACHEADOS) ---
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
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const resetPasswordModal = document.getElementById('reset-password-modal');
const showForgotPassword = document.getElementById('show-forgot-password');
const showLoginFromForgot = document.getElementById('show-login-from-forgot');
const closeForgot = document.getElementById('close-forgot');
const closeReset = document.getElementById('close-reset');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const resetPasswordInput = document.getElementById('reset-password');
const resetConfirmPasswordInput = document.getElementById('reset-confirm-password');
const resetSubmit = document.getElementById('reset-submit');
const resetPasswordMatch = document.getElementById('reset-password-match');
const editRiddleModal = document.getElementById('edit-riddle-modal');
const editRiddleForm = document.getElementById('edit-riddle-form');
const closeEditRiddle = document.getElementById('close-edit-riddle');
const userSearchInput = document.getElementById('user-search-input');
const usersList = document.getElementById('users-list');

// Elementos de Gestión de Cuenta
const accountBtn = document.getElementById('account-btn');
const accountModal = document.getElementById('account-modal');
const closeAccountModal = document.getElementById('close-account-modal');
const updateNameForm = document.getElementById('update-name-form');
const updatePasswordForm = document.getElementById('update-password-form');
const newPasswordInput = document.getElementById('new-password');
const newConfirmPasswordInput = document.getElementById('new-confirm-password');
const newPasswordMatch = document.getElementById('new-password-match');
const updatePasswordSubmit = document.getElementById('update-password-submit');

// ¡NUEVO! Elementos del Modal de Error
const errorModal = document.getElementById('error-modal');
const errorModalMessage = document.getElementById('error-modal-message');
const closeErrorModal = document.getElementById('close-error-modal');


// --- NAVEGACIÓN (Single Page App) ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        
        if (targetSection === 'admin-panel' && !appState.isAdmin) {
            showModalError('No tienes permisos para acceder a esta sección.');
            return;
        }
        if (targetSection === 'history') {
            updateHistoryAndStats();
        }
        if (targetSection === 'admin-panel') {
            loadAdminData();
        }
        showSection(targetSection);
    });
});
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    } else {
        console.error(`La sección con id "${sectionId}" no fue encontrada.`);
    }
}
startNowBtn.addEventListener('click', () => {
    if (!appState.currentUser) {
        showModalError('Debes iniciar sesión para acceder a los acertijos.'); 
        loginModal.style.display = 'flex';
        return;
    }
    showSection('riddles');
    loadRandomRiddle(); 
});

// --- MANEJO DE MODALES (Abrir/Cerrar) ---
loginBtn.addEventListener('click', () => { loginModal.style.display = 'flex'; });
registerBtn.addEventListener('click', () => { registerModal.style.display = 'flex'; });
closeLogin.addEventListener('click', () => { loginModal.style.display = 'none'; });
closeRegister.addEventListener('click', () => { registerModal.style.display = 'none'; });
closeSuccess.addEventListener('click', () => { successModal.style.display = 'none'; });
closeReport.addEventListener('click', () => { reportModal.style.display = 'none'; });
// ¡NUEVO! Cerrar modal de error
closeErrorModal.addEventListener('click', () => { errorModal.style.display = 'none'; });

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
if (closeEditRiddle) {
    closeEditRiddle.addEventListener('click', () => {
        editRiddleModal.style.display = 'none';
    });
}
showForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    forgotPasswordModal.style.display = 'flex';
});
showLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.style.display = 'none';
    loginModal.style.display = 'flex';
});
closeForgot.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'none';
});
closeReset.addEventListener('click', () => {
    resetPasswordModal.style.display = 'none';
});

if(accountBtn) {
    accountBtn.addEventListener('click', () => {
        document.getElementById('account-name').value = appState.currentUser.nombre;
        updatePasswordForm.reset();
        validateNewPassword(); 
        accountModal.style.display = 'flex';
    });
}
if(closeAccountModal) {
    closeAccountModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
    });
}


// --- VALIDACIÓN DE CONTRASEÑA (Front-end) ---
passwordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validatePassword);
function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    updateRequirement('req-length', hasMinLength);
    updateRequirement('req-uppercase', hasUpperCase);
    updateRequirement('req-lowercase', hasLowerCase);
    updateRequirement('req-number', hasNumber);
    updateRequirement('req-special', hasSpecialChar);
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
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;
    registerSubmit.disabled = !isPasswordValid;
}
function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (!element) return; 
    const icon = isValid ? 'fa-check-circle' : 'fa-times-circle';
    const text = element.textContent.substring(element.textContent.indexOf(' ') + 1);
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
    element.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
}

// ¡NUEVA! Función auxiliar para mostrar errores
function showModalError(message) {
    errorModalMessage.textContent = message;
    errorModal.style.display = 'flex';
}

// ===============================================
// === PARTE 1: REGISTRO (CONECTADO) ===
// ===============================================
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    registerSubmit.disabled = true;
    registerSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({name: name, email: email, password: password})
        });
        const result = await response.json(); 
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        // =============================================
        // === ¡AQUÍ ESTÁ LA CORRECCIÓN! ===
        // =============================================
        // Ahora comprobamos el flag 'success' que viene del JSON
        if (result.success) {
            // Si es TRUE, mostramos el modal de éxito
            registerModal.style.display = 'none';
            document.querySelector('#success-modal h3').textContent = '¡Registro Exitoso!';
            document.querySelector('#success-modal p').textContent = result.message; // Mensaje de éxito real
            successModal.style.display = 'flex';
            registerForm.reset();
        } else {
            // Si es FALSE (ej. correo duplicado), mostramos el modal de error
            showModalError(result.message);
        }

    } catch (error) {
        console.error('Error en fetch() register:', error);
        showModalError(error.message || 'No se pudo conectar con el servidor.');
    }
    registerSubmit.disabled = false;
    registerSubmit.innerHTML = '<i class="fas fa-user-plus"></i> Registrarse';
});


// ===============================================
// === PARTE 2: LOGIN/LOGOUT (¡CORREGIDO!) ===
// ===============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginButton = loginForm.querySelector('button[type="submit"]');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: email, password: password})
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        if (result.success) {
            loginModal.style.display = 'none';
            loginForm.reset();
            updateUIAfterLogin(result.user);
        } else {
            showModalError(result.message);
        }

    } catch (error) {
        console.error('Error en fetch() login:', error);
        showModalError(error.message || 'No se pudo conectar con el servidor.');
    }
    loginButton.disabled = false;
    loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
});
logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('api/logout.php');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
    updateUIAfterLogout();
});
function updateUIAfterLogin(user) { 
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    usernameDisplay.textContent = user.nombre;
    appState.currentUser = user; 
    
    if(accountBtn) accountBtn.style.display = 'flex';

    if (user.rol === 'admin') {
        appState.isAdmin = true;
        if (!document.querySelector('a[data-section="admin-panel"]')) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = '<a href="#" data-section="admin-panel"><i class="fas fa-cogs"></i> Administración</a>';
            document.querySelector('nav ul').appendChild(adminLink);
            
            adminLink.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                loadAdminData(); 
                showSection('admin-panel');
            });
        }
        loadAdminData(); 
    } else {
        appState.isAdmin = false;
    }
    showSection('riddles');
    loadRandomRiddle(); 
}
function updateUIAfterLogout() {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    userInfo.style.display = 'none';
    appState.currentUser = null;
    appState.isAdmin = false;
    
    if(accountBtn) accountBtn.style.display = 'none';

    const adminLink = document.querySelector('a[data-section="admin-panel"]');
    if (adminLink) {
        adminLink.parentElement.remove();
    }
    showSection('home');
}


// ===============================================
// === PARTE 3: LÓGICA DE ACERTIJOS (¡CON IA!) ===
// ===============================================

unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        unitButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.selectedUnit = btn.getAttribute('data-unit');
        loadRandomRiddle();
    });
});

async function loadRandomRiddle() {
    currentQuestion.textContent = "Buscando un acertijo...";
    optionsContainer.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    feedback.style.display = 'none';
    reportBtn.style.display = 'none'; 
    nextRiddleBtn.style.display = 'none'; 

    try {
        const unit = appState.selectedUnit;
        const response = await fetch(`api/get_riddle.php?unit=${unit}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        if (result.success) {
            renderRiddle(result.riddle);
        } else {
            // ¡No hay acertijos!
            
            // ===============================================
            // === ¡AQUÍ ESTÁ LA CORRECCIÓN DE SEGURIDAD! ===
            // ===============================================
            
            // 1. VERIFICAR SI EL USUARIO HA INICIADO SESIÓN
            if (!appState.currentUser) {
                // 2. Si NO hay usuario, mostrar modal de login y detenerse
                currentQuestion.textContent = "¡Has resuelto todos los acertijos disponibles!";
                optionsContainer.innerHTML = '<p style="text-align: center; padding: 0 2rem;">Inicia sesión para generar nuevos acertijos personalizados con IA.</p>';
                
                // Usamos tu modal de error y mostramos el de login
                showModalError('Debes iniciar sesión para generar nuevos acertijos.');
                loginModal.style.display = 'flex';
                return; // ¡Importante! Detener la ejecución aquí
            }
            
            // 3. Si SÍ hay usuario, proceder a generar (el código original)
            currentQuestion.textContent = "¡Felicidades! Has resuelto todo. Generando nuevos acertijos para ti...";
            optionsContainer.innerHTML = '<i class="fas fa-magic fa-spin"></i>';
            
            // Esta función ahora intentará con Python primero, y si falla, con Gemini/RAG
            await handleGenerateAINewRiddles();
        }
    } catch (error) {
        console.error('Error al cargar acertijo:', error);
        currentQuestion.textContent = error.message || "Error al conectar con el servidor.";
        optionsContainer.innerHTML = '';
    }
}

// ==================================================================
// === ¡FUNCIÓN MODIFICADA CON LÓGICA DE FALLBACK! ===
// ==================================================================
async function handleGenerateAINewRiddles() {
    const unit = appState.selectedUnit;
    
    // La API de Python sí acepta 'all', pero la de RAG/Gemini no.
    // Si la de Python falla, el fallback (RAG) necesita una unidad específica.
    if (unit === 'all') {
        currentQuestion.textContent = "Por favor, selecciona una unidad específica (I o II) para generar nuevos acertijos.";
        optionsContainer.innerHTML = '';
        return;
    }

    const PYTHON_API_URL = "https://softriddles.onrender.com/api/generar-quiz";
    
    // --- Intento 1: Usar el API de Python (Render) ---
    try {
        console.log("Intentando generar quiz con API de Python...");
        const pythonApiRequest = {
            unit: unit, // '1' o '2'. La API de Python también acepta 'all' pero lo filtramos arriba.
            num_questions: 5
        };
        
        const response = await fetch(PYTHON_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pythonApiRequest)
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.quiz_data || data.quiz_data.questions.length === 0) {
            // Si la API de Python falla (error 500, success:false, etc), lanza un error para activar el fallback
            throw new Error(data.message || 'La API de Python no devolvió un quiz válido.');
        }

        // ¡Éxito! La API de Python funcionó. Ahora guardamos las preguntas en nuestra DB local.
        console.log("API de Python exitosa. Guardando preguntas en la base de datos local...");
        
        // Llamamos a nuestro nuevo endpoint PHP para guardar las preguntas
        const saveResponse = await fetch('api/save_python_quiz.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ questions: data.quiz_data.questions })
        });

        const saveResult = await saveResponse.json();
        
        if (!saveResponse.ok || !saveResult.success) {
            // Si falla el guardado en nuestra BD, también activamos el fallback
            throw new Error(saveResult.message || 'Error al guardar el quiz de Python en la BD local.');
        }

        // ¡Todo salió bien! Recargamos el acertijo (que ahora está en la BD)
        currentQuestion.textContent = "¡Nuevos acertijos listos! Cargando...";
        setTimeout(loadRandomRiddle, 1000); // Esperamos 1 seg y volvemos a llamar a loadRandomRiddle

    } catch (error) {
        // --- Fallback: Usar el sistema RAG/Gemini (el código original) ---
        console.warn("Falló el API de Python (o el guardado): ", error.message);
        console.log("Usando sistema de fallback (RAG / Gemini)...");

        try {
            // Este es el código original que tenías
            const response = await fetch(`api/generate_riddle_ai.php?unit=${unit}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error en el servidor de fallback');
            }

            if (result.success) {
                currentQuestion.textContent = "¡Nuevos acertijos generados (fallback)! Cargando...";
                setTimeout(loadRandomRiddle, 1000); 
            } else {
                currentQuestion.textContent = `Error al generar acertijo con IA (fallback): ${result.message}.`;
                optionsContainer.innerHTML = '';
            }
        } catch (fallbackError) {
            // Si ambos sistemas fallan, mostramos un error final
            console.error('Error fatal: Falló tanto la API de Python como el fallback de RAG/Gemini:', fallbackError);
            currentQuestion.textContent = `Error en ambos sistemas: ${fallbackError.message}`;
            optionsContainer.innerHTML = '';
        }
    }
}
// ==================================================================
// === FIN DE LA FUNCIÓN MODIFICADA ===
// ==================================================================


function renderRiddle(riddle) {
    appState.currentRiddle = riddle; 
    currentQuestion.textContent = riddle.Pregunta;
    if (currentUnit) {
        currentUnit.textContent = `Unidad ${riddle.IdUnidad}`; 
    }
    optionsContainer.innerHTML = ''; 
    optionsContainer.appendChild(createOptionButton(riddle.OpcionA, 'A'));
    optionsContainer.appendChild(createOptionButton(riddle.OpcionB, 'B'));
    optionsContainer.appendChild(createOptionButton(riddle.OpcionC, 'C'));
    optionsContainer.appendChild(createOptionButton(riddle.OpcionD, 'D'));
    reportBtn.style.display = 'inline-block';
    nextRiddleBtn.style.display = 'inline-block';
}


function createOptionButton(text, option) {
    const optionBtn = document.createElement('div');
    optionBtn.className = 'option-btn';
    optionBtn.textContent = text;
    optionBtn.setAttribute('data-option', option); 
    optionBtn.addEventListener('click', handleAnswerSelection);
    return optionBtn;
}

async function handleAnswerSelection(e) {
    document.querySelectorAll('.option-btn').forEach(btn => btn.style.pointerEvents = 'none');
    
    const selectedOption = e.target.getAttribute('data-option');
    
    if (!appState.currentRiddle || !appState.currentRiddle.IdEjercicio) {
        showModalError("Error: Este acertijo no tiene un ID. No se puede guardar la respuesta.");
        return;
    }
    const riddleId = appState.currentRiddle.IdEjercicio;

    try {
        const response = await fetch('api/submit_answer.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                riddleId: riddleId,
                option: selectedOption
            })
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        if (result.success) {
            const correctAnswer = result.correctAnswer;
            
            feedback.classList.remove('correct', 'incorrect');

            if (result.isCorrect) {
                e.target.classList.add('correct');
                feedback.textContent = '¡Correcto!';
                feedback.classList.add('correct');
            } else {
                e.target.classList.add('incorrect');
                feedback.textContent = 'Incorrecto.';
                feedback.classList.add('incorrect');
                const correctBtn = document.querySelector(`.option-btn[data-option="${correctAnswer}"]`);
                if(correctBtn) correctBtn.classList.add('correct');
            }
            feedback.style.display = 'block';
        } else {
            showModalError(result.message);
        }
    } catch (error) {
        console.error('Error al enviar respuesta:', error);
        showModalError(error.message || 'Error de red al enviar tu respuesta.');
    }
}
nextRiddleBtn.addEventListener('click', () => {
    loadRandomRiddle(); 
});


// ===============================================
// === PARTE 4: HISTORIAL Y ESTADÍSTICAS (CONECTADO) ===
// ===============================================
async function updateHistoryAndStats() {
    historyList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Cargando historial...</p></div>';
    totalAnswered.textContent = '-';
    correctAnswers.textContent = '-';
    incorrectAnswers.textContent = '-';
    try {
        const response = await fetch('api/get_history.php');
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        if (result.success) {
            const stats = result.stats;
            totalAnswered.textContent = stats.total;
            correctAnswers.textContent = stats.correct;
            incorrectAnswers.textContent = stats.incorrect;
            if (result.history.length === 0) {
                historyList.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No hay historial disponible. ¡Resuelve algunos acertijos!</p></div>';
            } else {
                historyList.innerHTML = ''; 
                result.history.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    const esCorrecto = item.FueCorrecto == 1;
                    historyItem.innerHTML = `
                        <div>
                            <strong>${item.Pregunta}</strong>
                            <div style="margin-top: 0.5rem; color: ${esCorrecto ? 'var(--success-color)' : 'var(--accent-color)'}; display: flex; align-items: center;">
                                <i class="fas fa-${esCorrecto ? 'check' : 'times'}-circle" style="margin-right: 5px;"></i>
                                ${esCorrecto ? 'Correcto' : 'Incorrecto'}
                            </div>
                        </div>
                        <div>${new Date(item.Fecha).toLocaleDateString()}</div>
                    `;
                    historyList.appendChild(historyItem);
                });
            }
        } else {
            showModalError(result.message);
            historyList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>No se pudo cargar el historial.</p></div>';
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
        historyList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${error.message || 'Error de red al cargar el historial.'}</p></div>`;
    }
}


// ===============================================
// === PARTE 5: REPORTAR ERRORES (CONECTADO) ===
// ===============================================
reportBtn.addEventListener('click', () => {
    if (!appState.currentUser) { showModalError('Debes iniciar sesión para reportar problemas.'); return; }
    if (!appState.currentRiddle || !appState.currentRiddle.IdEjercicio) { 
        showModalError('No hay un acertijo válido seleccionado para reportar.'); 
        return; 
    }
    reportForm.reset();
    reportModal.style.display = 'flex';
});
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('report-description').value;
    const riddleId = appState.currentRiddle.IdEjercicio;
    const submitButton = reportForm.querySelector('button[type="submit"]');
    if (!description.trim()) { showModalError('Por favor, escribe una descripción del problema.'); return; }
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    try {
        const response = await fetch('api/submit_report.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ riddleId: riddleId, description: description })
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en el servidor');
        }

        if (result.success) {
            reportModal.style.display = 'none';
            alert(result.message); 
        } else {
            showModalError(result.message);
        }
    } catch (error) {
        console.error('Error al enviar reporte:', error);
        showModalError(error.message || 'Error de red al enviar tu reporte.');
    }
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Reporte';
});


// ===============================================
// === PARTE 6: ADMIN (CRUD Acertijos) ===
// ===============================================

async function loadAdminData() {
    reportsList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Cargando reportes...</p></div>';
    try {
        const response = await fetch('api/get_reports.php');
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        if (result.success) {
            renderReportsList(result.reports);
        } else {
            reportsList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${result.message}</p></div>`;
        }
    } catch (error) {
        console.error('Error al cargar reportes:', error);
        reportsList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${error.message}</p></div>`;
    }
    
    riddlesList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Cargando acertijos...</p></div>';
    loadAdminRiddles(); 

    usersList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Usa la barra de búsqueda para encontrar usuarios.</p></div>';
}

// --- Funciones de Reportes ---
function renderReportsList(reports) {
    if (reports.length === 0) {
        reportsList.innerHTML = '<div class="empty-state"><i class="fas fa-flag"></i><p>No hay reportes pendientes</p></div>';
        return;
    }
    reportsList.innerHTML = ''; 
    reports.forEach(report => {
        const reportItem = document.createElement('div');
        reportItem.className = 'report-item';
        if (report.Estado === 'resuelto') {
            reportItem.style.opacity = '0.6';
            reportItem.style.backgroundColor = '#f9f9f9';
        }
        const reportDate = new Date(report.FechaReporte).toLocaleDateString();
        reportItem.innerHTML = `
            <div class="report-header">
                <strong>Reporte #${report.IdReporte} (${report.Estado})</strong>
                <span>Fecha: ${reportDate}</span>
            </div>
            <p><strong>Usuario:</strong> ${report.UsuarioNombre}</p>
            <p><strong>Acertijo:</strong> ${report.EjercicioPregunta}</p>
            <p><strong>Problema reportado:</strong> ${report.Descripcion}</p>
            <div class="report-actions">
                ${report.Estado === 'pendiente' ? 
                `<button class="btn btn-primary btn-resolver-reporte" data-report-id="${report.IdReporte}">
                    <i class="fas fa-check"></i> Marcar como Resuelto
                 </button>` : 
                '<p style="color: var(--success-color); font-weight: bold;">¡Resuelto!</p>'}
            </div>
        `;
        reportsList.appendChild(reportItem);
    });
    addReportButtonListeners();
}
function addReportButtonListeners() {
    document.querySelectorAll('.btn-resolver-reporte').forEach(button => {
        button.addEventListener('click', handleResolveReport);
    });
}
async function handleResolveReport(e) {
    const button = e.currentTarget; 
    const reportId = button.dataset.reportId;
    if (!confirm(`¿Estás seguro de que quieres marcar el reporte #${reportId} como resuelto?`)) { return; }
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resolviendo...';
    try {
        const response = await fetch('api/resolve_report.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ reportId: reportId })
        });
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        if (result.success) {
            loadAdminData();
        } else {
            showModalError(result.message);
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-check"></i> Marcar como Resuelto';
        }
    } catch (error) {
        console.error('Error al resolver reporte:', error);
        showModalError(error.message || 'Error de red al resolver el reporte.');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-check"></i> Marcar como Resuelto';
    }
}
// --- FIN Funciones de Reportes ---


// --- Funciones de Gestión de Acertijos ---
async function loadAdminRiddles() {
    try {
        const response = await fetch('api/get_all_riddles.php');
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        if (result.success) {
            renderRiddlesList(result.riddles);
        } else {
            riddlesList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${result.message}</p></div>`;
        }
    } catch (error) {
        console.error('Error al cargar acertijos:', error);
        riddlesList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${error.message}</p></div>`;
    }
}

function renderRiddlesList(riddles) {
    if (riddles.length === 0) {
        riddlesList.innerHTML = '<div class="empty-state"><i class="fas fa-puzzle-piece"></i><p>No hay acertijos en la base de datos.</p></div>';
        return; 
    }
    
    riddlesList.innerHTML = ''; 
    riddles.forEach(riddle => {
        const riddleItem = document.createElement('div');
        riddleItem.className = 'riddle-item'; 
        riddleItem.innerHTML = `
            <div class="riddle-header">
                <strong>Acertijo #${riddle.IdEjercicio} (Unidad ${riddle.IdUnidad})</strong>
            </div>
            <p>${riddle.Pregunta.substring(0, 100)}...</p>
            <div class="riddle-actions">
                <button class="btn btn-primary btn-editar-acertijo" data-riddle-id="${riddle.IdEjercicio}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-eliminar-acertijo" data-riddle-id="${riddle.IdEjercicio}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        riddlesList.appendChild(riddleItem);
    });
    document.querySelectorAll('.btn-editar-acertijo').forEach(button => {
        button.addEventListener('click', handleEditRiddleClick);
    });
    document.querySelectorAll('.btn-eliminar-acertijo').forEach(button => {
        button.addEventListener('click', handleDeleteRiddleClick);
    });
}
async function handleEditRiddleClick(e) {
    const riddleId = e.currentTarget.dataset.riddleId;
    try {
        const response = await fetch(`api/get_single_riddle.php?id=${riddleId}`);
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        if (result.success) {
            const riddle = result.riddle;
            document.getElementById('edit-riddle-id').value = riddle.IdEjercicio;
            document.getElementById('edit-pregunta').value = riddle.Pregunta;
            document.getElementById('edit-opciona').value = riddle.OpcionA;
            document.getElementById('edit-opcionb').value = riddle.OpcionB;
            document.getElementById('edit-opcionc').value = riddle.OpcionC;
            document.getElementById('edit-opciond').value = riddle.OpcionD;
            document.getElementById('edit-respuesta').value = riddle.RespuestaCorrecta;
            document.getElementById('edit-unidad').value = riddle.IdUnidad;
            editRiddleModal.style.display = 'flex';
        } else {
            showModalError(result.message);
        }
    } catch (error) {
        console.error('Error al obtener acertijo:', error);
        showModalError(error.message || 'Error de red al cargar datos del acertijo.');
    }
}
async function handleDeleteRiddleClick(e) {
    const riddleId = e.currentTarget.dataset.riddleId;
    if (!confirm(`¿Estás seguro de que quieres ELIMINAR el acertijo #${riddleId}? Esta acción es irreversible y borrará su historial y reportes.`)) {
        return;
    }
    try {
        const response = await fetch('api/delete_riddle.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ riddleId: riddleId })
        });
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        if (result.success) {
            alert(result.message);
            loadAdminRiddles(); 
        } else {
            showModalError(result.message);
        }
    } catch (error) {
        console.error('Error al eliminar acertijo:', error);
        showModalError(error.message || 'Error de red al eliminar el acertijo.');
    }
}
if (editRiddleForm) {
    editRiddleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editRiddleForm);
        const data = Object.fromEntries(formData.entries()); 
        const submitButton = editRiddleForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        try {
            const response = await fetch('api/update_riddle.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || 'Error'); }
            if (result.success) {
                alert(result.message);
                editRiddleModal.style.display = 'none';
                loadAdminRiddles(); 
            } else {
                showModalError(result.message);
            }
        } catch (error) {
            console.error('Error al actualizar acertijo:', error);
            showModalError(error.message || 'Error de red al guardar los cambios.');
        }
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    });
}
// --- FIN Funciones de Gestión de Acertijos ---


// --- Navegación interna del panel de admin ---
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


// ===============================================
// === PARTE 8: RECUPERAR (CONECTADO) ===
// ===============================================

resetPasswordInput.addEventListener('input', validateResetPassword);
resetConfirmPasswordInput.addEventListener('input', validateResetPassword);
function validateResetPassword() { 
    const password = resetPasswordInput.value;
    const confirmPassword = resetConfirmPasswordInput.value;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    updateResetRequirement('reset-req-length', hasMinLength);
    updateResetRequirement('reset-req-uppercase', hasUpperCase);
    updateResetRequirement('reset-req-lowercase', hasLowerCase);
    updateResetRequirement('reset-req-number', hasNumber);
    updateResetRequirement('reset-req-special', hasSpecialChar);
    const passwordsMatch = password === confirmPassword && password !== '';
    if (confirmPassword !== '') {
        if (passwordsMatch) {
            resetPasswordMatch.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Las contraseñas coinciden';
        } else {
            resetPasswordMatch.innerHTML = '<i class="fas fa-times-circle" style="color: var(--accent-color);"></i> Las contraseñas no coinciden';
        }
    } else {
        resetPasswordMatch.innerHTML = '';
    }
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;
    resetSubmit.disabled = !isPasswordValid;
}
function updateResetRequirement(id, isValid) { 
    const element = document.getElementById(id);
    if (!element) return;
    const icon = isValid ? 'fa-check-circle' : 'fa-times-circle';
    const text = element.textContent.substring(element.textContent.indexOf(' ') + 1);
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
    element.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
}

// --- Formularios de reseteo (¡CONECTADOS!) ---
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        const response = await fetch('api/forgot_password.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ email: email })
        });
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }
        
        if (result.success) {
            alert(result.message);
            forgotPasswordModal.style.display = 'none';
            loginModal.style.display = 'flex';
        } else {
            showModalError(result.message);
        }

    } catch (error) {
        console.error('Error al enviar email de reseteo:', error);
        showModalError(error.message || `Error de red.`);
    }

    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Enlace de Recuperación';
});

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const token = params.get('token');

    if (!token) {
        showModalError("Error: No se encontró ningún token de reseteo. Por favor, usa el enlace de tu correo.");
        return;
    }

    const password = document.getElementById('reset-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;
    const submitButton = resetPasswordForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const response = await fetch('api/reset_password.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ 
                token: token,
                password: password,
                confirmPassword: confirmPassword
            })
        });
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }

        if (result.success) {
            alert(result.message);
            resetPasswordModal.style.display = 'none';
            loginModal.style.display = 'flex';
            window.location.hash = '';
        } else {
            showModalError(result.message);
        }

    } catch (error)
    {
        console.error('Error al resetear contraseña:', error);
        showModalError(error.message || `Error de red.`);
    }

    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-save"></i> Restablecer Contraseña';
});


// ===============================================
// === PARTE 9: GESTIÓN DE USUARIOS (SR-017) ===
// ===============================================

if (userSearchInput) {
    userSearchInput.addEventListener('input', (e) => {
        setTimeout(() => {
            if (e.target.value === userSearchInput.value) {
                loadAdminUsers(e.target.value);
            }
        }, 300);
    });
}

async function loadAdminUsers(search = '') {
    if (!search.trim()) {
        usersList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>Usa la barra de búsqueda para encontrar usuarios.</p></div>';
        return;
    }

    usersList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Buscando usuarios...</p></div>';

    try {
        const response = await fetch(`api/admin_get_users.php?search=${encodeURIComponent(search)}`);
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }

        if (result.success) {
            renderUserList(result.users);
        } else {
            usersList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${result.message}</p></div>`;
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        usersList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${error.message}</p></div>`;
    }
}

function renderUserList(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>No se encontraron usuarios.</p></div>';
        return;
    }

    usersList.innerHTML = ''; 
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item'; 
        
        let actionButton = '';
        if (user.IdUsuario === appState.currentUser.idUsuario) {
            actionButton = '<p> (Eres tú)</p>';
        } else if (user.Rol === 'usuario') {
            actionButton = `
                <button class="btn btn-success btn-cambiar-rol" data-user-id="${user.IdUsuario}" data-new-role="admin">
                    <i class="fas fa-user-shield"></i> Hacer Admin
                </button>`;
        } else {
            actionButton = `
                <button class="btn btn-warning btn-cambiar-rol" data-user-id="${user.IdUsuario}" data-new-role="usuario">
                    <i class="fas fa-user-times"></i> Quitar Admin
                </button>`;
        }

        userItem.innerHTML = `
            <div class="user-info">
                <p><strong>${user.Nombre}</strong></p>
                <span>${user.Correo} - (Rol: ${user.Rol})</span>
            </div>
            <div class="user-actions">
                ${actionButton}
            </div>
        `;
        usersList.appendChild(userItem);
    });

    document.querySelectorAll('.btn-cambiar-rol').forEach(button => {
        button.addEventListener('click', handleUpdateRoleClick);
    });
}

async function handleUpdateRoleClick(e) {
    const button = e.currentTarget;
    const userId = button.dataset.userId;
    const newRole = button.dataset.newRole;

    if (!confirm(`¿Estás seguro de que quieres cambiar el rol de este usuario a "${newRole}"?`)) {
        return;
    }

    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('api/admin_update_role.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({ userId: userId, newRole: newRole })
        });
        const result = await response.json();
        if (!response.ok) { throw new Error(result.message || 'Error'); }

        if (result.success) {
            alert(result.message);
            loadAdminUsers(userSearchInput.value); 
        } else {
            showModalError(result.message);
        }

    } catch (error) {
        console.error('Error al cambiar rol:', error);
        showModalError(error.message || 'Error de red.');
    }
}


// ===============================================
// === ¡NUEVO! PARTE 10: GESTIÓN DE CUENTA ===
// ===============================================

if(updateNameForm) {
    updateNameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('account-name').value;
        const submitButton = updateNameForm.querySelector('button[type="submit"]');

        if (!newName.trim()) {
            showModalError('El nombre no puede estar vacío.');
            return;
        }
        if (newName === appState.currentUser.nombre) {
            showModalError('No has cambiado tu nombre.');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        try {
            const response = await fetch('api/update_my_name.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({ newName: newName })
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || 'Error'); }

            if (result.success) {
                alert(result.message);
                appState.currentUser.nombre = result.newName;
                usernameDisplay.textContent = result.newName;
                accountModal.style.display = 'none';
            } else {
                showModalError(result.message);
            }
        } catch (error) {
            console.error('Error al actualizar nombre:', error);
            showModalError(error.message || 'Error de red.');
        }

        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Nombre';
    });
}

if(updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const submitButton = updatePasswordForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        try {
            const response = await fetch('api/update_my_password.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({ 
                    currentPassword: currentPassword,
                    newPassword: newPassword 
                })
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || 'Error'); }
            
            // Corrección: El resultado exitoso no siempre tiene un mensaje, pero el error sí.
            if(result.success) {
                 alert('¡Contraseña actualizada con éxito!');
                updatePasswordForm.reset();
                accountModal.style.display = 'none';
            } else {
                // Si success es false o no existe, mostramos el mensaje de error
                 showModalError(result.message || "Error desconocido al cambiar contraseña.");
            }

        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            // El error.message vendrá del throw new Error() que captura el JSON
            showModalError(error.message || 'Error de red.');
        }

        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-lock"></i> Cambiar Contraseña';
    });

    newPasswordInput.addEventListener('input', validateNewPassword);
    newConfirmPasswordInput.addEventListener('input', validateNewPassword);
}

function validateNewPassword() {
    const password = newPasswordInput.value;
    const confirmPassword = newConfirmPasswordInput.value;
    
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    updateResetRequirement('req-new-length', hasMinLength);
    updateResetRequirement('req-new-uppercase', hasUpperCase);
    updateResetRequirement('req-new-lowercase', hasLowerCase);
    updateResetRequirement('req-new-number', hasNumber);
    updateResetRequirement('req-new-special', hasSpecialChar);
    
    const passwordsMatch = password === confirmPassword && password !== '';
    
    if (confirmPassword !== '') {
        if (passwordsMatch) {
            newPasswordMatch.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Las contraseñas coinciden';
        } else {
            newPasswordMatch.innerHTML = '<i class="fas fa-times-circle" style="color: var(--accent-color);"></i> Las contraseñas no coinciden';
        }
    } else {
        newPasswordMatch.innerHTML = '';
    }
    
    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;
    updatePasswordSubmit.disabled = !isPasswordValid;
}


// ===============================================
// === INICIALIZACIÓN DE LA APLICACIÓN ===
// ===============================================
document.addEventListener('DOMContentLoaded', async () => {
    
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-password')) {
            const icon = e.target;
            const input = icon.previousElementSibling;

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = "password";
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        }
    });

    try {
        const response = await fetch('api/check_session.php');
        const result = await response.json();
        
        if (result.success) {
            updateUIAfterLogin(result.user);
        }
    } catch (error) {
        console.error('Error al comprobar la sesión:', error);
    }
    
    if (window.location.hash.startsWith('#reset?token=')) {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        if (params.get('token')) {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            forgotPasswordModal.style.display = 'none';
            resetPasswordModal.style.display = 'flex';
        }
    }
});