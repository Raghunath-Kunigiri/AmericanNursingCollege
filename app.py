from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from datetime import datetime
import logging
from dotenv import load_dotenv
import csv
from pymongo import MongoClient
from bson import ObjectId
import json
import uuid
import traceback
import atexit

# Import database connection and models
try:
    from config.database import connect_db, disconnect_db
    from models.student import Student
    from models.contact import Contact
    from routes.students import students_bp
    from routes.contact import contact_bp
    MONGODB_AVAILABLE = True
except ImportError:
    print("MongoDB modules not available, using local storage")
    MONGODB_AVAILABLE = False

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MONGODB_URI'] = os.getenv('MONGODB_URI', '')

# CORS configuration
cors_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
if os.getenv('NODE_ENV') == 'production':
    cors_origins = [os.getenv('PRODUCTION_DOMAIN')]

CORS(app, origins=cors_origins, supports_credentials=True)

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
    from routes.students import init_limiter as init_students_limiter
    from routes.contact import init_limiter as init_contact_limiter
    init_students_limiter(limiter)
    init_contact_limiter(limiter)

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

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Serve images
@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

# Serve manifest.json
@app.route('/manifest.json')
def manifest():
    return send_file('manifest.json', mimetype='application/manifest+json')

# Serve main website
@app.route('/')
def index():
    return send_file('index.html')

# Serve admin dashboard
@app.route('/admin.html')
def admin():
    return send_file('admin.html')

@app.route('/api/health')
def health_check():
    return jsonify({
        'success': True,
        'message': 'American College of Nursing API is running',
        'timestamp': datetime.now().isoformat(),
        'environment': os.getenv('NODE_ENV', 'development')
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

# Legacy endpoint for backward compatibility
@app.route('/save-admission', methods=['POST'])
def save_admission():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        required_fields = ['name', 'phone', 'course']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field.capitalize()} is required'}), 400

        # Generate Application ID: ANC + Course Initials + Year + Last 5 Phone Digits
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
            year = datetime.now().year + 1  # Next year for admission (2025)
            last_5_digits = phone[-5:] if len(phone) >= 5 else phone
            
            return f"ANC{course_code}{year}{last_5_digits}"
        
        # Generate or use provided application ID
        application_id = data.get('applicationId') or generate_application_id(data.get('course'), data.get('phone'))
        phone_number = data.get('phone')
        
        # Check if phone number already exists (using phone as unique identifier)
        phone_exists = False
        if MONGODB_AVAILABLE and admissions_collection is not None:
            existing = admissions_collection.find_one({'phone': phone_number})
            phone_exists = existing is not None
        else:
            applications = load_applications_from_file()
            phone_exists = any(app.get('phone') == phone_number for app in applications)
        
        if phone_exists:
            return jsonify({'success': False, 'message': 'Application with this phone number already exists'}), 400
        
        admission_data = {
            '_id': application_id,
            'name': data.get('name'),
            'email': data.get('email', ''),
            'phone': phone_number,
            'course': data.get('course'),
            'message': data.get('message', ''),
            'timestamp': datetime.now().isoformat(),
            'status': 'pending'
        }

        # Save to MongoDB if available
        if MONGODB_AVAILABLE and admissions_collection is not None:
            try:
                admission_data['_id'] = ObjectId()
                admissions_collection.insert_one(admission_data)
                print(f"✅ Admission data saved to MongoDB: {application_id}")
            except Exception as mongo_error:
                print(f"⚠️ MongoDB save failed: {mongo_error}")
                # Fallback to file storage
                applications = load_applications_from_file()
                applications.append(admission_data)
                save_applications_to_file(applications)
        else:
            # File storage fallback
            applications = load_applications_from_file()
            applications.append(admission_data)
            save_applications_to_file(applications)
            print(f"✅ Admission data saved to file: {application_id}")

        # Save to CSV backup
        try:
            file_exists = os.path.isfile('admissions.csv')
            with open('admissions.csv', 'a', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['_id', 'name', 'email', 'phone', 'course', 'message', 'timestamp', 'status']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                if not file_exists:
                    writer.writeheader()
                
                writer.writerow(admission_data)
            print(f"✅ CSV backup created: {application_id}")
        except Exception as csv_error:
            print(f"⚠️ CSV backup failed: {csv_error}")

        return jsonify({'success': True, 'applicationId': application_id}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'message': 'Failed to save application'}), 500

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
        return save_admission()

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
            'total_students': 3240,
            'placement_rate': 98,
            'years_experience': 36,
            'expert_faculty': 25
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
            'total_inquiries': 1250,
            'response_rate': 95,
            'avg_response_time': '2 hours',
            'satisfaction_rate': 98
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
            
            # For now, just return success
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

# Cleanup function
def cleanup():
    if client:
        client.close()
        print("✅ MongoDB connection closed")

atexit.register(cleanup)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('NODE_ENV') != 'production'
    
    print(f"🚀 Starting American College of Nursing API on port {port}")
    print(f"🔧 Debug mode: {'ON' if debug else 'OFF'}")
    print(f"🗄️ MongoDB: {'Connected' if MONGODB_AVAILABLE else 'Using file storage'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
