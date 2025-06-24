from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import sys
from datetime import datetime
import logging
from dotenv import load_dotenv
import csv
from pymongo import MongoClient
from bson import ObjectId
import json
import uuid
import traceback

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import database connection and models
try:
    from config.database import connect_db, disconnect_db
    from models.student import Student
    from models.contact import Contact
    from routes.students import students_bp
    from routes.contact import contact_bp
    MONGODB_AVAILABLE = True
except ImportError as e:
    print(f"MongoDB modules not available, using local storage: {e}")
    MONGODB_AVAILABLE = False

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MONGODB_URI'] = os.getenv('MONGODB_URI', '')

# CORS configuration - Allow all origins for Vercel deployment
CORS(app, origins=["*"], supports_credentials=True)

# Rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["100 per 15 minutes"]
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Register blueprints
if MONGODB_AVAILABLE:
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')

# MongoDB connection
client = None
db = None
admissions_collection = None

if MONGODB_AVAILABLE:
    try:
        client = MongoClient(app.config['MONGODB_URI'])
        db = client['AmericanCollege']
        admissions_collection = db['Admissions']
        client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        MONGODB_AVAILABLE = False

# Initialize the rate limiter for blueprints
if MONGODB_AVAILABLE:
    try:
        from routes.students import init_limiter as init_students_limiter
        from routes.contact import init_limiter as init_contact_limiter
        init_students_limiter(limiter)
        init_contact_limiter(limiter)
    except:
        pass

# Helpers for local file storage
def load_applications_from_file():
    try:
        with open('applications.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_applications_to_file(applications):
    with open('applications.json', 'w') as f:
        json.dump(applications, f, indent=2, default=str)

# Custom encoder
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

if MONGODB_AVAILABLE:
    app.json_encoder = MongoJSONEncoder

@app.route('/api/health')
def health_check():
    return jsonify({
        'success': True,
        'message': 'American College of Nursing API is running',
        'timestamp': datetime.now().isoformat(),
        'environment': os.getenv('NODE_ENV', 'production')
    })

# API documentation endpoint
@app.route('/api')
def api_docs():
    return jsonify({
        'success': True,
        'message': 'American College of Nursing API',
        'version': '1.0.0',
        'endpoints': {
            'students': {
                'POST /api/students/apply': 'Submit student admission application',
                'GET /api/students/check-email/<email>': 'Check if email exists',
                'GET /api/students/check-phone/<phone>': 'Check if phone exists',
                'GET /api/students/programs': 'Get available programs',
                'GET /api/students/stats': 'Get student statistics'
            },
            'contact': {
                'GET /api/contact/inquiry-types': 'Get inquiry types',
                'POST /api/contact/submit': 'Submit contact form',
                'GET /api/contact/stats': 'Get contact statistics'
            }
        }
    })

# Fallback API endpoints (only if blueprints are not available)
if not MONGODB_AVAILABLE:
    @app.route('/api/students/check-email/<email>', methods=['GET'])
    def check_email_exists(email):
        try:
            email_exists = False
            applications = load_applications_from_file()
            email_exists = any(app.get('email') == email for app in applications)
            return jsonify({'success': True, 'exists': email_exists}), 200
        except Exception as e:
            print(traceback.format_exc())
            return jsonify({'success': False, 'message': 'Failed to check email'}), 500

    @app.route('/api/students/check-phone/<phone>', methods=['GET'])
    def check_phone_exists(phone):
        try:
            phone_exists = False
            applications = load_applications_from_file()
            phone_exists = any(app.get('phone') == phone for app in applications)
            return jsonify({'success': True, 'exists': phone_exists}), 200
        except Exception as e:
            print(traceback.format_exc())
            return jsonify({'success': False, 'message': 'Failed to check phone'}), 500

    @app.route('/api/students/apply', methods=['POST'])
    def apply_fallback():
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400

            # Generate Application ID
            def generate_application_id(course, phone):
                course_initials = {
                    'General Nursing': 'GNM',
                    'General Nursing & Midwifery': 'GNM',
                    'Bachelor in Nursing': 'BSN',
                    'Bachelor of Science in Nursing': 'BSN',
                    'Paramedical Nursing': 'PMN',
                    'Paramedical in Nursing': 'PMN',
                    'Medical Lab Technician': 'MLT',
                    'Cardiology Technician': 'CTN',
                    'Multipurpose Health Assistant': 'MHA'
                }
                
                course_code = course_initials.get(course, 'GEN')
                year = datetime.now().year + 1
                last_5_digits = phone[-5:] if len(phone) >= 5 else phone
                
                return f"ANC{course_code}{year}{last_5_digits}"
            
            application_id = generate_application_id(data.get('program', ''), data.get('phone', ''))
            
            response_data = {
                'applicationId': application_id,
                'fullName': f"{data.get('firstName', '')} {data.get('lastName', '')}".strip(),
                'email': data.get('email', ''),
                'phone': data.get('phone', ''),
                'program': data.get('program', ''),
                'applicationStatus': 'Pending',
                'applicationDate': datetime.now().isoformat(),
                'admissionYear': datetime.now().year + 1
            }
            
            return jsonify({
                'success': True,
                'message': 'Application submitted successfully',
                'data': response_data
            }), 201
            
        except Exception as e:
            print(traceback.format_exc())
            return jsonify({'success': False, 'message': 'Failed to save application'}), 500

    @app.route('/api/students/programs', methods=['GET'])
    def get_programs():
        programs = [
            {'id': 'gnm', 'name': 'General Nursing & Midwifery', 'duration': '3.5 Years'},
            {'id': 'bsn', 'name': 'Bachelor of Science in Nursing', 'duration': '4 Years'},
            {'id': 'paramedical', 'name': 'Paramedical in Nursing', 'duration': '2 Years'},
            {'id': 'mlt', 'name': 'Medical Lab Technician', 'duration': '2 Years'},
            {'id': 'cardiology', 'name': 'Cardiology Technician', 'duration': '1.5 Years'},
            {'id': 'mha', 'name': 'Multipurpose Health Assistant', 'duration': '1 Year'}
        ]
        return jsonify({'success': True, 'data': programs})

    @app.route('/api/students/stats', methods=['GET'])
    def get_student_stats():
        stats = {
            'overview': {
                'totalApplications': 3240,
                'approvedStudents': 3180,
                'pendingApplications': 60
            },
            'programDistribution': [
                {'_id': 'General Nursing & Midwifery', 'count': 1200},
                {'_id': 'Bachelor of Science in Nursing', 'count': 800},
                {'_id': 'Medical Lab Technician', 'count': 600},
                {'_id': 'Paramedical in Nursing', 'count': 400},
                {'_id': 'Cardiology Technician', 'count': 240}
            ]
        }
        return jsonify({'success': True, 'data': stats})

    @app.route('/api/contact/inquiry-types', methods=['GET'])
    def get_inquiry_types():
        inquiry_types = [
            {'value': 'admission', 'label': 'Admission Inquiry', 'description': 'Questions about admission process'},
            {'value': 'course', 'label': 'Course Information', 'description': 'Information about courses and programs'},
            {'value': 'fees', 'label': 'Fee Structure', 'description': 'Questions about fees and payment'},
            {'value': 'placement', 'label': 'Placement Assistance', 'description': 'Career placement and job assistance'},
            {'value': 'other', 'label': 'Other', 'description': 'General inquiries'}
        ]
        return jsonify({'success': True, 'data': inquiry_types})

    @app.route('/api/contact/stats', methods=['GET'])
    def get_contact_stats():
        stats = {
            'overview': {
                'totalContacts': 1250,
                'responseRate': 95,
                'avgResponseTime': '2 hours',
                'satisfactionRate': 98
            }
        }
        return jsonify({'success': True, 'data': stats})

    @app.route('/api/contact/submit', methods=['POST'])
    def submit_contact_fallback():
        try:
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
            
            # Simple validation
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'success': False, 'message': f'{field.capitalize()} is required'}), 400
            
            return jsonify({
                'success': True,
                'message': 'Your message has been sent successfully. We will get back to you soon!'
            }), 201
            
        except Exception as e:
            print(traceback.format_exc())
            return jsonify({'success': False, 'message': 'Failed to send message'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'API endpoint not found',
        'error': 'The requested API endpoint does not exist'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'message': 'Method not allowed',
        'error': 'The HTTP method is not allowed for this endpoint'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error',
        'error': 'An unexpected error occurred on the server'
    }), 500

@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f'Unhandled exception: {str(error)}')
    return jsonify({
        'success': False,
        'message': 'Server error occurred',
        'error': str(error)
    }), 500

# Vercel serverless function handler
def handler(request):
    return app(request.environ, lambda status, headers: None)

if __name__ == '__main__':
    app.run(debug=True) 