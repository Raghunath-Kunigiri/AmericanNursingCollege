# Routes.py
import smtplib, secrets
from flask import render_template, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db, users_collection
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

users_collection = db['users']  # Collection for storing user information
@app.route('/')
def home():
    # Redirect to the login page
    return render_template('login.html')

@app.route('/')
def login():
    return render_template('login.html')

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Check if the user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400

        hashed_password = generate_password_hash(password)
        users_collection.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password
        })
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        # Log the exception
        print(f"Error occurred: {e}")
        return jsonify({'message': 'An error occurred. Please try again.'}), 500


# Login Route
@app.route('/login_user', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# # Forgot Password Route
# @app.route('/forgot_password', methods=['POST'])
# def forgot_password():
#     data = request.json
#     email = data.get('email')
#     new_password = data.get('new_password')

#     user = users_collection.find_one({'email': email})
#     if user:
#         hashed_password = generate_password_hash(new_password)
#         users_collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
#         return jsonify({'message': 'Password reset successful'}), 200
#     else:
#         return jsonify({'message': 'User not found'}), 404

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    user = users_collection.find_one({'email': email})
    if user:
        # Generate a random token
        reset_token = secrets.token_urlsafe(32)

        # Store the reset token in the database
        users_collection.update_one({'email': email}, {'$set': {'reset_token': reset_token}})

        # Send reset email (example using SMTP)
        msg = MIMEMultipart()
        msg['From'] = 'your_email@example.com'  # Replace with your email
        msg['To'] = email
        msg['Subject'] = 'Password Reset Request'
        body = f"Click this link to reset your password: http://your_app_url/reset_password/{reset_token}"
        msg.attach(MIMEText(body, 'plain'))
        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:  # Replace with your SMTP server
                server.starttls()
                server.login('your_email@example.com', 'your_password')  # Replace with your email and password
                server.sendmail('your_email@example.com', email, msg.as_string())
                return jsonify({'message': 'Password reset email sent'}), 200
        except Exception as e:
            return jsonify({'message': 'Error sending email'}), 500

    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    data = request.json
    new_password = data.get('new_password')

    user = users_collection.find_one({'reset_token': token})

    if user:
        hashed_password = generate_password_hash(new_password)
        users_collection.update_one({'email': user['email']}, {'$set': {'password': hashed_password, 'reset_token': None}})
        return jsonify({'message': 'Password reset successful'}), 200
    else:
        return jsonify({'message': 'Invalid or expired token'}), 400

   
