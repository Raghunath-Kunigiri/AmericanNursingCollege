from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://kunigiriraghunath9493:Kunimango@1998@cluster0.ckryr.mongodb.net/")
db = client['your_database_name']  # Replace with your database name
users_collection = db['users']  # Collection for storing user information

# Home Route
@app.route('/')
def home():
    return render_template('Login.html')

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
@app.route('/login', methods=['POST'])
def login():
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

if __name__ == '__main__':
    app.run(debug=True)
