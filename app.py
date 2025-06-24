
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
                'POST /save-admission': 'Submit student admission application',
                'GET /api/students/check-email/<email>': 'Check if email exists',
                'GET /api/students/programs': 'Get available programs',
                'GET /api/students/stats': 'Get student statistics'
            },
            'contact': {
                'GET /api/contact/inquiry-types': 'Get inquiry types',
                'GET /api/contact/stats': 'Get contact statistics'
            }
        }
    })

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
            'applicationId': application_id,
            'name': data.get('name'),
            'email': data.get('email', ''),
            'phone': phone_number,
            'course': data.get('course'),
            'message': data.get('message', ''),
            'timestamp': datetime.now(),
            'status': 'pending',
            'admissionYear': datetime.now().year + 1
        }

        if MONGODB_AVAILABLE and admissions_collection is not None:
            try:
                result = admissions_collection.insert_one(admission_data)
                print(f"✅ Application saved to MongoDB with ID: {application_id}")
            except Exception as e:
                print(f"❌ MongoDB save failed, falling back to file: {e}")
                admission_data['timestamp'] = datetime.now().isoformat()
                applications = load_applications_from_file()
                applications.append(admission_data)
                save_applications_to_file(applications)
        else:
            admission_data['timestamp'] = datetime.now().isoformat()
            applications = load_applications_from_file()
            applications.append(admission_data)
            save_applications_to_file(applications)
            print(f"✅ Application saved to file with ID: {application_id}")

        try:
            file_exists = os.path.isfile('admissions.csv')
            with open('admissions.csv', 'a', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['Application ID', 'Name', 'Email', 'Phone', 'Course', 'Message', 'Timestamp', 'Status']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                if not file_exists:
                    writer.writeheader()
                timestamp_str = admission_data['timestamp']
                if not isinstance(timestamp_str, str):
                    timestamp_str = timestamp_str.strftime('%Y-%m-%d %H:%M:%S')
                writer.writerow({
                    'Application ID': application_id,
                    'Name': admission_data['name'],
                    'Email': admission_data['email'],
                    'Phone': admission_data['phone'],
                    'Course': admission_data['course'],
                    'Message': admission_data['message'],
                    'Timestamp': timestamp_str,
                    'Status': admission_data['status']
                })
        except Exception as csv_error:
            print(f"⚠️ CSV backup failed: {csv_error}")

        return jsonify({'success': True, 'applicationId': application_id}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'message': 'Failed to save application'}), 500

@app.route('/api/students/check-email/<email>', methods=['GET'])
def check_email_exists(email):
    try:
        email_exists = False
        if MONGODB_AVAILABLE and admissions_collection is not None:
            existing = admissions_collection.find_one({'email': email})
            email_exists = existing is not None
        else:
            applications = load_applications_from_file()
            email_exists = any(app.get('email') == email for app in applications)
        return jsonify({'success': True, 'exists': email_exists}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'message': 'Failed to check email'}), 500

# Additional API endpoints that the frontend expects
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
        {'id': 'admission', 'name': 'Admission Inquiry'},
        {'id': 'course', 'name': 'Course Information'},
        {'id': 'fees', 'name': 'Fee Structure'},
        {'id': 'placement', 'name': 'Placement Assistance'},
        {'id': 'other', 'name': 'Other'}
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

@app.route('/api/applications', methods=['GET'])
def get_applications():
    try:
        # Get query parameters
        search_query = request.args.get('search', '').strip()
        sort_by = request.args.get('sort', 'date')  # date, name, status
        sort_order = request.args.get('order', 'desc')  # asc, desc
        
        all_applications = []
        
        # Get applications from the old system (admissions_collection)
        if MONGODB_AVAILABLE and admissions_collection is not None:
            # Build MongoDB query
            query = {}
            if search_query:
                query = {
                    '$or': [
                        {'name': {'$regex': search_query, '$options': 'i'}},
                        {'email': {'$regex': search_query, '$options': 'i'}},
                        {'phone': {'$regex': search_query, '$options': 'i'}},
                        {'_id': {'$regex': search_query, '$options': 'i'}}  # Application ID search
                    ]
                }
            
            # Build sort criteria
            sort_field = 'timestamp'
            if sort_by == 'name':
                sort_field = 'name'
            elif sort_by == 'status':
                sort_field = 'status'
            
            sort_direction = -1 if sort_order == 'desc' else 1
            old_applications = list(admissions_collection.find(query).sort(sort_field, sort_direction))
            all_applications.extend(old_applications)
        else:
            applications = load_applications_from_file()
            
            # Filter applications based on search query
            if search_query:
                filtered_apps = []
                for app in applications:
                    if (search_query.lower() in app.get('name', '').lower() or
                        search_query.lower() in app.get('email', '').lower() or
                        search_query.lower() in app.get('phone', '').lower() or
                        search_query.lower() in app.get('_id', '').lower()):
                        filtered_apps.append(app)
                applications = filtered_apps
            
            all_applications.extend(applications)
        
        # Get applications from the new system (Student model)
        if MONGODB_AVAILABLE:
            try:
                from models.student import Student
                from routes.students import students_bp
                
                # Get all students from the Student model (without pagination)
                result = Student.get_all(filters={}, page=1, limit=1000)  # High limit to get all
                students = result['students']
                
                # Convert student data to application format for admin panel
                for student in students:
                    student_data = student.data if hasattr(student, 'data') else student
                    
                    # Create application format
                    app_data = {
                        '_id': student_data.get('applicationId', str(student_data.get('_id', ''))),
                        'name': f"{student_data.get('firstName', '')} {student_data.get('lastName', '')}".strip(),
                        'email': student_data.get('email', ''),
                        'phone': student_data.get('phone', ''),
                        'course': student_data.get('program', student_data.get('course', '')),
                        'message': student_data.get('message', ''),
                        'timestamp': student_data.get('createdAt', student_data.get('timestamp', '')),
                        'status': student_data.get('applicationStatus', 'pending')
                    }
                    
                    # Apply search filter
                    if search_query:
                        if not (search_query.lower() in app_data.get('name', '').lower() or
                                search_query.lower() in app_data.get('email', '').lower() or
                                search_query.lower() in app_data.get('phone', '').lower() or
                                search_query.lower() in app_data.get('_id', '').lower()):
                            continue
                    
                    all_applications.append(app_data)
                    
            except Exception as e:
                print(f"Warning: Could not load Student applications: {e}")
        
        # Sort all applications
        if sort_by == 'name':
            all_applications.sort(key=lambda x: x.get('name', '').lower(), reverse=(sort_order == 'desc'))
        elif sort_by == 'status':
            all_applications.sort(key=lambda x: x.get('status', ''), reverse=(sort_order == 'desc'))
        else:  # date
            all_applications.sort(key=lambda x: x.get('timestamp', ''), reverse=(sort_order == 'desc'))
        
        return jsonify({'success': True, 'data': all_applications}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'message': 'Failed to fetch applications'}), 500

@app.route('/api/applications/<application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'success': False, 'message': 'Status is required'}), 400
        
        application_found = False
        
        # Try to update in Student model first (new system)
        if MONGODB_AVAILABLE:
            try:
                from models.student import Student
                student = Student.find_by_id(application_id)
                if student:
                    # Map admin status to student status
                    status_mapping = {
                        'approved': 'Approved',
                        'rejected': 'Rejected',
                        'reviewed': 'Under Review',
                        'pending': 'Pending'
                    }
                    mapped_status = status_mapping.get(new_status.lower(), new_status)
                    student.update_status(mapped_status)
                    application_found = True
            except Exception as e:
                print(f"Warning: Could not update Student status: {e}")
        
        # If not found in Student model, try old admissions collection
        if not application_found:
            if MONGODB_AVAILABLE and admissions_collection is not None:
                result = admissions_collection.update_one(
                    {'_id': application_id},
                    {'$set': {'status': new_status}}
                )
                if result.matched_count > 0:
                    application_found = True
            else:
                applications = load_applications_from_file()
                for app in applications:
                    if app.get('_id') == application_id:
                        app['status'] = new_status
                        application_found = True
                        break
                
                if application_found:
                    save_applications_to_file(applications)
        
        if not application_found:
            return jsonify({'success': False, 'message': 'Application not found'}), 404
        
        return jsonify({'success': True, 'message': 'Status updated successfully'}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'message': 'Failed to update status'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith('/api/'):
        return jsonify({
            'success': False,
            'message': 'API endpoint not found',
            'path': request.path
        }), 404
    # For non-API routes, serve index.html (SPA support)
    return send_file('index.html')

@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f'Global error handler: {str(error)}')
    status_code = getattr(error, 'code', 500)
    return jsonify({
        'success': False,
        'message': str(error) if app.debug else 'Internal server error'
    }), status_code

if MONGODB_AVAILABLE:
    atexit.register(disconnect_db)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    debug = os.getenv('NODE_ENV') != 'production'
    print(f"🚀 Server running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
