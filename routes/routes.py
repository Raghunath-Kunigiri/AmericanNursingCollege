import smtplib, secrets
from flask import render_template, request, jsonify, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db


# Collection for storing user information
users_collection = db['users']  

@app.route('/')
def home():
    if 'user_id' in session:
        return render_template('dashboard.html')
    else:
        return render_template('index.html')

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/apply')
def apply():
    return render_template('apply.html')

@app.route('/aboutUs')
def about_us():
    return render_template('aboutUs.html')

@app.route('/course')
def course():
    return render_template('course.html')

@app.route('/faculties')
def faculties():
    return render_template('faculties.html')

@app.route('/residence')
def residence():
    return render_template('hall.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')



@app.route('/admission', methods=['GET', 'POST'])
def admission():
    if request.method == 'POST':
        # Collect data from the form
        data = request.form
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        address = data.get('address')
        selected_courses = data.getlist('courses')  # Multiple selections
        
        # Validate and process the data (e.g., save to database)
        admissions_collection = db['admissions']
        admissions_collection.insert_one({
            'name': name,
            'email': email,
            'phone': phone,
            'address': address,
            'courses': selected_courses
        })

        return jsonify({'message': 'Admission application submitted successfully!'}), 200
    
    courses = ['Nursing Fundamentals', 'Anatomy and Physiology', 'Pharmacology', 'Medical-Surgical Nursing', 'Pediatrics Nursing', 'Mental Health Nursing']
    return render_template('admission_form.html', courses=courses)
