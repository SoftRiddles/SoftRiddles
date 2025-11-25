import google.generativeai as genai
import json
import random
import os
from datetime import datetime
from dotenv import load_dotenv

# =============================================================================
# CONFIGURACIÓN
# =============================================================================
load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY no encontrada")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# =============================================================================
# BASE DE CONOCIMIENTO COMPLETA (Tus 50 conceptos organizados)
# =============================================================================

KNOWLEDGE_BASE = {
    "unidad_1": [
        "CRISIS DEL SOFTWARE: Problemas de calidad, costo y plazo en el desarrollo de software durante las décadas de 1960-1970 que llevaron a la necesidad de metodologías formales",
        "SOFTWARE: Instrucciones de ordenador, estructuras de datos y documentos que permiten la operación correcta de programas y transformación de información",
        "DUALIDAD DEL SOFTWARE: Funciona como producto entregable y como vehículo para distribuir funcionalidad y control",
        "CARACTERÍSTICAS DEL SOFTWARE: Se desarrolla intelectualmente, no se fabrica; no se desgasta físicamente pero se deteriora con cambios; mayormente construido a la medida",
        "ENFOQUE SISTÉMICO VS ARTESANAL: Distinción entre desarrollo profesional con métodos de ingeniería versus aproximación informal sin técnicas sistemáticas",
        "PROBLEMAS DE DESARROLLO: Planificación imprecisa, baja productividad, falta de control de calidad, documentación insuficiente y dificultades de comunicación",
        "ÉXITO DE PROYECTOS: Solo el 16.2% se completan a tiempo, dentro del presupuesto y con todas las características especificadas (Standish Group)",
        "MITOS DEL SOFTWARE: Creencias erróneas sobre administración, clientes y desarrolladores que afectan negativamente el desarrollo",
        "INGENIERÍA DE SOFTWARE: Aplicación de enfoque sistemático, disciplinado y cuantificable al desarrollo, operación y mantenimiento de software",
        "PROGRAMADOR VS INGENIERO: El programador implementa código mientras el ingeniero aborda todo el ciclo de vida con métodos sistemáticos",
        "PRINCIPIOS DE INGENIERÍA: 18 principios fundamentales que guían la práctica, incluyendo calidad, gestión, diseño documentado y mejora continua",
        "PRODUCTO SOFTWARE: Programas, documentos y datos que configuran el software desde perspectivas técnicas y de usuario",
        "PRODUCTOS GENÉRICOS VS PERSONALIZADOS: Software desarrollado para mercado abierto versus sistemas específicos para clientes particulares",
        "ATRIBUTOS DE CALIDAD: Mantenibilidad, confiabilidad, eficiencia, usabilidad, portabilidad, integridad, robustez, reutilización y compatibilidad",
        "PROCESO SOFTWARE: Serie de pasos predecibles para construir software que proporciona estabilidad, control y organización",
        "ESTRATOS DE INGENIERÍA: Herramientas, métodos y procesos sobre una base de calidad que forman la tecnología multicapa",
        "ACTIVIDADES ESTRUCTURALES: Comunicación, planeación, modelado, construcción y despliegue como marco para todo proyecto software",
        "ACTIVIDADES SOMBRILLA: Gestión de proyectos, riesgo, calidad, revisiones técnicas, medición y configuración aplicadas transversalmente",
        "DIMENSIONES DEL PROYECTO: Features (características), Staff (personal), Quality (calidad), Schedule (tiempo) y Cost (costo) como factores interdependientes",
        "ROLES DE LAS DIMENSIONES: Drivers (objetivos clave), Constraints (factores limitantes) y Grados de Libertad (dimensiones flexibles) según prioridades del proyecto"
    ],
    
    "unidad_2": [
        "PROCESO SOFTWARE: Serie de pasos predecibles para construir un producto software que proporciona estabilidad, control y organización al desarrollo",
        "HERRAMIENTAS CASE: Software que proporciona soporte automático o semiautomático para los métodos de desarrollo, incluyendo editores, compiladores y administradores de código",
        "MÉTODOS DE DESARROLLO: Conjunto de técnicas que indican cómo construir técnicamente el software, incluyendo planificación, análisis, diseño y pruebas",
        "GESTIÓN DE CALIDAD: Cultura de mejora continua del proceso que conduce al desarrollo de enfoques efectivos para la ingeniería de software",
        "DIMENSIONES DE PROYECTO SOFTWARE: Cinco factores clave (características, personal, cronograma, costo, calidad) que pueden ser drivers, constraints o grados de libertad",
        "INGENIERÍA DE REQUERIMIENTOS: Proceso para entender las necesidades del cliente, analizar requerimientos, evaluar factibilidad y especificar la solución sin ambigüedades",
        "REQUERIMIENTOS DEL USUARIO: Enunciados en lenguaje natural sobre los servicios esperados del sistema y las restricciones bajo las cuales debe operar",
        "REQUERIMIENTOS DEL SISTEMA: Descripciones detalladas de las funciones, servicios y restricciones operacionales del software a implementar",
        "REQUERIMIENTOS FUNCIONALES: Sentencias que describen servicios que el sistema debe realizar y cómo debe responder a entradas específicas",
        "REQUERIMIENTOS NO FUNCIONALES: Restricciones en los servicios o funciones del sistema, incluyendo eficiencia, confiabilidad, seguridad y estándares",
        "VALIDACIÓN DE REQUERIMIENTOS: Proceso para demostrar que los requerimientos definen el sistema que el cliente realmente quiere, detectando inconsistencias y ambigüedades",
        "DOCUMENTO DE REQUERIMIENTOS: Especificación escrita en términos comprensibles para el usuario que presenta lo que el cliente espera que el sistema realice",
        "DISEÑO DE SOFTWARE: Proceso de aplicar técnicas y principios para definir un sistema con suficiente detalle que permita su realización física, traduciendo requisitos en representación del software",
        "DISEÑO ARQUITECTÓNICO: Describe la estructura y organización del software a alto nivel e identifica sus componentes principales",
        "DISEÑO DETALLADO: Describe cada componente con suficiente detalle para permitir su construcción e implementación",
        "ARQUITECTURA SOFTWARE: Estructura general de los componentes del programa, su forma de interacción y las estructuras de datos que utilizan",
        "ABSTRACCIÓN: Concentrarse en un problema a cierto nivel de generalización sin considerar datos irrelevantes de bajo nivel",
        "MODULARIDAD: División del software en componentes con nombres distintos y abordables por separado que se integran para satisfacer los requisitos",
        "OCULTAMIENTO DE INFORMACIÓN: Técnica que hace que la información de un módulo sea inaccesible para otros que no la necesiten",
        "INDEPENDENCIA FUNCIONAL: Característica de módulos que resuelven subconjuntos específicos de requerimientos con interfaces sencillas hacia otras partes del programa",
        "COHESIÓN: Indicador de la fortaleza relativa funcional de un módulo, idealmente realizando una sola tarea",
        "ACOPLAMIENTO: Indicador de la independencia relativa entre módulos, donde se busca el mínimo acoplamiento posible",
        "PRUEBAS DE SOFTWARE: Técnicas dinámicas que generan entradas al sistema para detectar fallos cuando el sistema ejecuta dichas entradas",
        "VERIFICACIÓN: Proceso para determinar si los productos de una fase cumplen los requisitos establecidos en la fase anterior (¿creamos el producto correctamente?)",
        "VALIDACIÓN: Evaluación del software al final del desarrollo para asegurar el cumplimiento de necesidades del cliente (¿creamos el producto correcto?)",
        "MANTENIMIENTO CORRECTIVO: Modificación del software para localizar y eliminar defectos en programas después de su entrega",
        "MANTENIMIENTO ADAPTATIVO: Modificación de un programa debido a cambios en el entorno de hardware o software donde se ejecuta",
        "MANTENIMIENTO PERFECTIVO: Cambios en la especificación debidos a modificaciones en los requisitos del producto software",
        "MANTENIMIENTO PREVENTIVO: Modificación del software para mejorar sus propiedades sin alterar sus especificaciones funcionales"
    ]
}

# =============================================================================
# SISTEMA RAG MEJORADO
# =============================================================================

class RAGSystem:
    def __init__(self):
        self.model = model
    
    def get_relevant_knowledge(self, unit, num_concepts=8):
        """Selecciona conceptos relevantes de forma aleatoria pero balanceada"""
        if unit == "all":
            # Mezclar conceptos de ambas unidades
            all_concepts = KNOWLEDGE_BASE["unidad_1"] + KNOWLEDGE_BASE["unidad_2"]
            selected = random.sample(all_concepts, min(num_concepts, len(all_concepts)))
        else:
            unit_key = f"unidad_{unit}"
            if unit_key in KNOWLEDGE_BASE:
                selected = random.sample(KNOWLEDGE_BASE[unit_key], 
                                       min(num_concepts, len(KNOWLEDGE_BASE[unit_key])))
            else:
                selected = []
        
        return selected
    
    def generate_quiz(self, unit="all", num_questions=5):
        """Genera un quiz completo con 5 preguntas usando RAG"""
        try:
            # 1. Obtener conocimiento relevante
            relevant_concepts = self.get_relevant_knowledge(unit, num_concepts=10)
            
            if not relevant_concepts:
                raise Exception("No se pudo obtener conocimiento para generar el quiz")
            
            # 2. Construir contexto para Gemini
            context = "CONTEXTO PARA GENERAR PREGUNTAS - FUNDAMENTOS DE INGENIERÍA DE SOFTWARE:\n\n"
            for i, concept in enumerate(relevant_concepts, 1):
                context += f"{i}. {concept}\n"
            
            # 3. Prompt optimizado para 5 preguntas
            unit_text = self._get_unit_text(unit)
            
            prompt = f"""
{context}

INSTRUCCIONES ESPECÍFICAS:
- Genera EXACTAMENTE {num_questions} preguntas de opción múltiple sobre Fundamentos de Ingeniería de Software
- Basa las preguntas ÚNICAMENTE en el contexto proporcionado
- Las preguntas deben ser AUTOCONTENIDAS y NO hacer referencia al "contexto", "materiales proporcionados" o "texto anterior"
- Formula las preguntas como si fueran para un examen estándar, sin mencionar fuentes
- Cada pregunta debe tener 4 opciones de respuesta (A, B, C, D)
- Solo una opción debe ser correcta
- Las opciones incorrectas deben ser plausibles pero incorrectas
- Las opciones deben contener SOLO el texto, SIN incisos (A), B), etc.)
- Incluye la respuesta correcta como letra (A, B, C, o D)
- Especifica la unidad correspondiente (1 o 2)
            
            FORMATO JSON OBLIGATORIO:
            {{
                "quiz_title": "Quiz de Fundamentos de Ingeniería de Software - {unit_text}",
                "questions": [
                    {{
                        "id": 1,
                        "pregunta": "Texto claro de la pregunta",
                        "opcionA": "Texto opción A sin inciso",
                        "opcionB": "Texto opción B sin inciso", 
                        "opcionC": "Texto opción C sin inciso",
                        "opcionD": "Texto opción D sin inciso",
                        "respuestaCorrecta": "B",
                        "idUnidad": 1
                    }}
                ]
            }}
            
            Solo devuelve el JSON válido.
            """
            
            # 4. Generar con Gemini
            response = self.model.generate_content(prompt)
            json_text = self._clean_json_response(response.text)
            quiz_data = json.loads(json_text)
            
            # 5. Validar y retornar
            return self._validate_quiz_data(quiz_data)
            
        except Exception as e:
            print(f"Error generando quiz: {e}")
            raise Exception(f"Error al generar el quiz: {str(e)}")
    
    def _clean_json_response(self, text):
        """Limpia la respuesta JSON de Gemini"""
        cleaned = text.strip()
        cleaned = cleaned.replace('```json', '').replace('```', '')
        return cleaned.strip()
    
    def _get_unit_text(self, unit):
        """Obtiene texto descriptivo de la unidad"""
        units = {
            "1": "Unidad I",
            "2": "Unidad II", 
            "all": "Todas las Unidades"
        }
        return units.get(unit, "Unidad General")
    
    def _validate_quiz_data(self, quiz_data):
        """Valida la estructura del quiz generado"""
        if "questions" not in quiz_data:
            raise ValueError("Estructura de quiz inválida")
        
        expected_questions = 5
        if len(quiz_data["questions"]) != expected_questions:
            print(f"⚠️ Gemini generó {len(quiz_data['questions'])} preguntas en lugar de {expected_questions}")
        
        return quiz_data

# =============================================================================
# FUNCIONES PRINCIPALES
# =============================================================================

rag_system = RAGSystem()

def generar_quiz_completo(unit="all", num_questions=5):
    """
    Función principal para generar quiz completo
    """
    try:
        quiz_data = rag_system.generate_quiz(unit, num_questions)
        
        return {
            "success": True,
            "quiz_data": quiz_data,
            "message": f"Quiz de {num_questions} preguntas generado exitosamente"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Error al generar el quiz"
        }

# =============================================================================
# PRUEBA RÁPIDA
# =============================================================================

if __name__ == "__main__":
    print("🧪 Probando generación de quiz...")
    resultado = generar_quiz_completo(unit="1", num_questions=5)
    
    if resultado["success"]:
        quiz = resultado["quiz_data"]
        print(f"✅ Quiz generado: {quiz['quiz_title']}")
        print(f"📊 Preguntas: {len(quiz['questions'])}")
        for q in quiz['questions']:
            print(f"  ❓ {q['pregunta'][:80]}...")
    else:
        print(f"❌ Error: {resultado['error']}")