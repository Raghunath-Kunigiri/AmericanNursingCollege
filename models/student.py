from datetime import datetime, date
from bson import ObjectId
import re
import logging
from email_validator import validate_email, EmailNotValidError
from config.database import get_students_collection

logger = logging.getLogger(__name__)

class ValidationError(Exception):
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.validation_errors = errors or []

class Student:
    # Program choices
    PROGRAM_CHOICES = [
        'General Nursing',
        'Bachelor in Nursing',
        'Paramedical Nursing',
        'Medical Lab Technician',
        'Cardiology Technician',
        'Multipurpose Health Assistant',
        'General Nursing and Midwifery (GNM)',
        'Bachelor of Science in Nursing (BSc Nursing)',
        'Paramedical Courses'
    ]
    
    # Gender choices
    GENDER_CHOICES = ['Male', 'Female', 'Other']
    
    # Application status choices
    STATUS_CHOICES = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Waitlisted']
    
    def __init__(self, data=None):
        self.collection = get_students_collection()
        if data:
            self.data = data
            self._id = data.get('_id')
        else:
            self.data = {}
            self._id = None
    
    @classmethod
    def create(cls, student_data):
        """Create a new student application"""
        student = cls()
        
        # Validate data
        errors = student._validate_data(student_data)
        if errors:
            raise ValidationError("Validation failed", errors)
        
        # Check if email already exists (only if email is provided)
        if student_data.get('email'):
            try:
                existing_email = student.collection.find_one({'email': student_data['email'].lower()})
                if existing_email:
                    raise ValidationError("A student with this email already exists", ["Email already exists"])
            except Exception as e:
                # Database not available, skip duplicate check
                logger.warning(f"Database not available for email check: {e}")
        
        # Check if phone number already exists
        if student_data.get('phone'):
            try:
                existing_phone = student.collection.find_one({'phone': student_data['phone']})
                if existing_phone:
                    raise ValidationError("A student with this phone number already exists", ["Phone number already exists"])
            except Exception as e:
                # Database not available, skip duplicate check
                logger.warning(f"Database not available for phone check: {e}")
        
        # Prepare data for insertion
        student.data = student._prepare_data(student_data)
        student.data['createdAt'] = datetime.utcnow()
        student.data['updatedAt'] = datetime.utcnow()
        
        # Insert into database
        try:
            result = student.collection.insert_one(student.data)
            student._id = result.inserted_id
            student.data['_id'] = result.inserted_id
            
            return student
        except Exception as db_error:
            # Handle database insertion errors
            error_msg = str(db_error)
            if 'duplicate key' in error_msg.lower():
                raise ValidationError("Duplicate entry detected", ["A record with this information already exists"])
            else:
                raise ValidationError(f"Database error: {error_msg}", ["Database insertion failed"])
    
    @classmethod
    def find_by_id(cls, student_id):
        """Find student by ID or Application ID"""
        collection = get_students_collection()
        
        # First try to find by Application ID (new format)
        if isinstance(student_id, str) and student_id.startswith('ANC'):
            data = collection.find_one({'applicationId': student_id})
            if data:
                return cls(data)
        
        # Then try to find by MongoDB ObjectId
        try:
            data = collection.find_one({'_id': ObjectId(student_id)})
            if data:
                return cls(data)
        except:
            pass
        
        # Finally try to find by phone number (legacy support)
        if isinstance(student_id, str) and student_id.isdigit():
            data = collection.find_one({'phone': student_id})
            if data:
                return cls(data)
        
        return None
    
    @classmethod
    def find_by_email(cls, email):
        """Find student by email"""
        collection = get_students_collection()
        data = collection.find_one({'email': email.lower()})
        if data:
            return cls(data)
        return None
    
    @classmethod
    def find_by_phone(cls, phone):
        """Find student by phone number"""
        collection = get_students_collection()
        data = collection.find_one({'phone': phone})
        if data:
            return cls(data)
        return None
    
    @classmethod
    def get_all(cls, filters=None, page=1, limit=10):
        """Get all students with pagination and filters"""
        collection = get_students_collection()
        
        # Build query
        query = filters or {}
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get students
        cursor = collection.find(query).sort('createdAt', -1).skip(skip).limit(limit)
        students = [cls(data) for data in cursor]
        
        # Get total count
        total = collection.count_documents(query)
        
        return {
            'students': students,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit,
            'limit': limit
        }
    
    @classmethod
    def get_statistics(cls):
        """Get student statistics"""
        collection = get_students_collection()
        
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'totalApplications': {'$sum': 1},
                    'approvedStudents': {
                        '$sum': {'$cond': [{'$eq': ['$applicationStatus', 'Approved']}, 1, 0]}
                    },
                    'pendingApplications': {
                        '$sum': {'$cond': [{'$eq': ['$applicationStatus', 'Pending']}, 1, 0]}
                    }
                }
            }
        ]
        
        result = list(collection.aggregate(pipeline))
        overview = result[0] if result else {
            'totalApplications': 0,
            'approvedStudents': 0,
            'pendingApplications': 0
        }
        
        # Program distribution
        program_pipeline = [
            {
                '$group': {
                    '_id': '$program',
                    'count': {'$sum': 1}
                }
            },
            {'$sort': {'count': -1}}
        ]
        
        program_stats = list(collection.aggregate(program_pipeline))
        
        return {
            'overview': overview,
            'programDistribution': program_stats
        }
    
    def save(self):
        """Save student data"""
        if self._id:
            # Update existing
            self.data['updatedAt'] = datetime.utcnow()
            self.collection.update_one(
                {'_id': self._id},
                {'$set': self.data}
            )
        else:
            # Create new
            self.data['createdAt'] = datetime.utcnow()
            self.data['updatedAt'] = datetime.utcnow()
            result = self.collection.insert_one(self.data)
            self._id = result.inserted_id
            self.data['_id'] = result.inserted_id
        
        return self
    
    def update_status(self, status, notes=None):
        """Update application status"""
        if status not in self.STATUS_CHOICES:
            raise ValidationError(f"Invalid status: {status}")
        
        self.data['applicationStatus'] = status
        self.data['updatedAt'] = datetime.utcnow()
        
        if notes:
            if 'notes' not in self.data:
                self.data['notes'] = []
            self.data['notes'].append({
                'content': notes,
                'addedBy': 'Admin',
                'addedAt': datetime.utcnow()
            })
        
        # Generate student ID if approved and not already generated
        if status == 'Approved' and not self.data.get('studentId'):
            self.data['studentId'] = self._generate_student_id()
        
        self.save()
        return self
    
    def to_dict(self, include_sensitive=False):
        """Convert to dictionary"""
        data = self.data.copy()
        
        # Convert ObjectId to string
        if '_id' in data:
            data['_id'] = str(data['_id'])
        
        # Add virtual fields
        data['fullName'] = self.get_full_name()
        data['age'] = self.get_age()
        
        # Remove sensitive data if not requested
        if not include_sensitive:
            sensitive_fields = ['notes', 'documents']
            for field in sensitive_fields:
                data.pop(field, None)
        
        return data
    
    def get_full_name(self):
        """Get full name"""
        first_name = self.data.get('firstName', '')
        last_name = self.data.get('lastName', '')
        return f"{first_name} {last_name}".strip()
    
    def get_age(self):
        """Calculate age from date of birth"""
        dob = self.data.get('dateOfBirth')
        if not dob:
            return None
        
        if isinstance(dob, str):
            dob = datetime.fromisoformat(dob.replace('Z', '+00:00')).date()
        elif isinstance(dob, datetime):
            dob = dob.date()
        
        today = date.today()
        age = today.year - dob.year
        
        if today.month < dob.month or (today.month == dob.month and today.day < dob.day):
            age -= 1
        
        return age
    
    def _validate_data(self, data):
        """Validate student data"""
        errors = []
        
        # Required fields
        required_fields = [
            'firstName', 'lastName', 'phone', 'dateOfBirth',
            'gender', 'program', 'admissionYear'
        ]
        # Email is optional
        
        for field in required_fields:
            if not data.get(field):
                errors.append(f"{field} is required")
        
        # Email validation (only if provided)
        email = data.get('email', '').strip()
        if email:
            try:
                validate_email(email)
            except EmailNotValidError:
                errors.append("Please provide a valid email")
            except ImportError:
                # Email validation library not available, skip validation
                pass
        
        # Phone validation
        if data.get('phone'):
            phone_pattern = r'^\+?[\d\s\-\(\)]{10,}$'
            if not re.match(phone_pattern, data['phone']):
                errors.append("Please provide a valid phone number")
        
        # Gender validation
        if data.get('gender') and data['gender'] not in self.GENDER_CHOICES:
            errors.append("Invalid gender selection")
        
        # Program validation
        if data.get('program') and data['program'] not in self.PROGRAM_CHOICES:
            errors.append("Invalid program selection")
        
        # Date of birth validation
        if data.get('dateOfBirth'):
            try:
                if isinstance(data['dateOfBirth'], str):
                    dob = datetime.fromisoformat(data['dateOfBirth'].replace('Z', '+00:00'))
                else:
                    dob = data['dateOfBirth']
                
                if dob.date() >= date.today():
                    errors.append("Date of birth must be in the past")
            except:
                errors.append("Invalid date of birth format")
        
        # Admission year validation
        if data.get('admissionYear'):
            current_year = datetime.now().year
            if data['admissionYear'] < current_year:
                errors.append("Admission year cannot be in the past")
        
        # Address validation (only if address is provided and has content)
        if data.get('address') and any(data['address'].values()):
            address_required = ['street', 'city', 'state', 'zipCode']
            for field in address_required:
                if not data['address'].get(field):
                    errors.append(f"Address {field} is required")
        
        # Previous education validation (only if education data is provided and has content)
        if data.get('previousEducation') and any(data['previousEducation'].values()):
            edu_required = ['qualification', 'institution', 'yearOfCompletion', 'percentage']
            for field in edu_required:
                if not data['previousEducation'].get(field):
                    errors.append(f"Previous education {field} is required")
            
            # Year validation
            year = data['previousEducation'].get('yearOfCompletion')
            if year and (year < 1990 or year > datetime.now().year):
                errors.append("Invalid year of completion")
            
            # Percentage validation
            percentage = data['previousEducation'].get('percentage')
            if percentage and (percentage < 0 or percentage > 100):
                errors.append("Percentage must be between 0 and 100")
        
        return errors
    
    def _prepare_data(self, data):
        """Prepare data for database insertion"""
        prepared = data.copy()
        
        # Convert email to lowercase
        if 'email' in prepared:
            prepared['email'] = prepared['email'].lower()
        
        # Set default values
        prepared['applicationStatus'] = 'Pending'
        prepared['isActive'] = True
        
        # Generate Application ID if not provided
        course_field = prepared.get('course') or prepared.get('program')
        if not prepared.get('applicationId') and prepared.get('phone') and course_field:
            prepared['applicationId'] = self._generate_application_id(course_field, prepared['phone'])
        
        # Ensure program field is set (backwards compatibility)
        if prepared.get('course') and not prepared.get('program'):
            prepared['program'] = prepared['course']
        
        # Set admission year if not provided
        if not prepared.get('admissionYear'):
            prepared['admissionYear'] = datetime.now().year + 1
        
        # Set default country
        if 'address' in prepared and 'country' not in prepared['address']:
            prepared['address']['country'] = 'India'
        
        # Convert date strings to datetime objects
        if 'dateOfBirth' in prepared and isinstance(prepared['dateOfBirth'], str):
            prepared['dateOfBirth'] = datetime.fromisoformat(prepared['dateOfBirth'].replace('Z', '+00:00'))
        
        return prepared
    
    def _generate_application_id(self, course, phone):
        """Generate Application ID: ANC + Course Initials + Year + Last 5 Phone Digits"""
        course_initials = {
            'General Nursing': 'GNM',
            'General Nursing & Midwifery': 'GNM',
            'General Nursing and Midwifery (GNM)': 'GNM',
            'Bachelor in Nursing': 'BSN',
            'Bachelor of Science in Nursing': 'BSN',
            'Bachelor of Science in Nursing (BSc Nursing)': 'BSN',
            'Paramedical Nursing': 'PMN',
            'Paramedical in Nursing': 'PMN',
            'Paramedical Courses': 'PMN',
            'Medical Lab Technician': 'MLT',
            'Cardiology Technician': 'CTN',
            'Multipurpose Health Assistant': 'MHA'
        }
        
        course_code = course_initials.get(course, 'GEN')
        year = datetime.now().year + 1  # Next year for admission (2025)
        last_5_digits = str(phone)[-5:] if len(str(phone)) >= 5 else str(phone)
        
        return f"ANC{course_code}{year}{last_5_digits}"
    
    def _generate_student_id(self):
        """Generate unique student ID"""
        year = datetime.now().year % 100  # Last 2 digits of year
        program_code = self.data['program'].split(' ')[0][:3].upper()
        
        # Find last student with similar pattern
        pattern = f"ACN{year:02d}{program_code}"
        last_student = self.collection.find_one(
            {'studentId': {'$regex': f'^{pattern}'}},
            sort=[('studentId', -1)]
        )
        
        sequence = 1
        if last_student and last_student.get('studentId'):
            try:
                last_sequence = int(last_student['studentId'][-3:])
                sequence = last_sequence + 1
            except:
                sequence = 1
        
        return f"{pattern}{sequence:03d}" 