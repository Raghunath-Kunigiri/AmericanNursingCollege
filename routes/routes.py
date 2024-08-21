from flask import render_template, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db

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

# Forgot Password Route
@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    user = users_collection.find_one({'email': email})
    if user:
        hashed_password = generate_password_hash(new_password)
        users_collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
        return jsonify({'message': 'Password reset successful'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# @app.route('/forgot_password', methods=['POST'])
# def forgot_password():
#         data = request.get_json()
#         email = data.get('email')  # Extract email from JSON data

#         if not email:
#             return jsonify({"error": "Email is required"}), 400

#         user = db.users.find_one({"email": email})
#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         # Generate a unique token
#         token = str(uuid.uuid4())
#         reset_link = f"http://127.0.0.1:5000/reset_password/{token}"

#         # Save the token in the database
#         db.password_resets.update_one(
#             {"email": email},
#             {"$set": {"token": token}},
#             upsert=True
#         )

#         subject = "Password Reset Request"
#         body = f"Click the link to reset your password: {reset_link}"
        
#         try:
#             send_email(subject, body, email)
#             return jsonify({"message": "Password reset email sent"}), 200
#         except Exception as e:
#             return jsonify({"error": str(e)}), 500

# @app.route('/reset_password/<token>', methods=['GET', 'POST'])
# def reset_password(token):
#         if request.method == 'POST':
#             data = request.get_json()
#             new_password = data.get('password')

#             if not new_password:
#                 return jsonify({"error": "Password is required"}), 400

#             reset_entry = db.password_resets.find_one({"token": token})

#             if not reset_entry:
#                 return jsonify({"error": "Invalid or expired token"}), 400

#             email = reset_entry['email']
#             hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

#             # Update the user's password
#             db.users.update_one(
#                 {"email": email},
#                 {"$set": {"password": hashed_password}}
#             )

#             # Remove the token entry after successful password reset
#             db.password_resets.delete_one({"token": token})

#             return jsonify({"message": "Password has been reset successfully"}), 200

#         return render_template('reset_password.html', token=token)

   
