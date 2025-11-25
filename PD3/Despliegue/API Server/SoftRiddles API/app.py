from flask import Flask, request, jsonify
from flask_cors import CORS
import quiz_api
import os
from dotenv import load_dotenv

# =============================================================================
# CONFIGURACIÓN MÍNIMA
# =============================================================================
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# =============================================================================
# ÚNICO ENDPOINT ESENCIAL
# =============================================================================

@app.route('/api/generar-quiz', methods=['POST'])
def generar_quiz():
    """
    Endpoint único: Genera quiz completo de 5 preguntas
    Body JSON: {"unit": "1", "num_questions": 5}
    """
    try:
        # 1. Obtener parámetros
        data = request.get_json() or {}
        unit = data.get('unit', 'all')
        num_questions = data.get('num_questions', 5)

        # 2. Validaciones básicas
        if unit not in ['1', '2', 'all']:
            return jsonify({
                "success": False,
                "error": "La unidad debe ser '1', '2' o 'all'"
            }), 400

        if not isinstance(num_questions, int) or num_questions < 1 or num_questions > 10:
            return jsonify({
                "success": False, 
                "error": "El número de preguntas debe ser entre 1 y 10"
            }), 400

        # 3. Generar quiz
        resultado = quiz_api.generar_quiz_completo(unit, num_questions)
        
        # 4. Devolver respuesta directa
        if resultado["success"]:
            return jsonify(resultado)
        else:
            return jsonify(resultado), 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error interno: {str(e)}"
        }), 500

# =============================================================================
# ENDPOINT DE SALUDO (solo para pruebas)
# =============================================================================

@app.route('/api/saludar', methods=['GET'])
def saludar():
    """Endpoint simple para verificar que la API funciona"""
    return jsonify({
        "message": "✅ API SoftRiddles funcionando",
        "version": "2.0",
        "endpoint_activo": "POST /api/generar-quiz"
    })

# =============================================================================
# MANEJO DE ERRORES GLOBALES
# =============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Endpoint no encontrado. Usa: POST /api/generar-quiz"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False, 
        "error": "Método no permitido. Usa POST para /api/generar-quiz"
    }), 405

# =============================================================================
# INICIALIZACIÓN
# =============================================================================

if __name__ == '__main__':
    print("🚀 SoftRiddles API 2.0 - Minimalista")
    print("📍 Endpoint único: POST /api/generar-quiz")
    print("🌐 Ejecutando en: http://localhost:5000")
    
    app.run(debug=False, host='0.0.0.0', port=5000)