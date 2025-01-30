import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__, template_folder='src')# MongoDB connection

mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("No MONGO_URI environment variable set. Please check your .env file.")

try:
    client = MongoClient(mongo_uri, tls=True, )  # Ensure TLS is enabled
    db_name = mongo_uri.split("/")[-1].split("?")[0]  # Extract database name from URI
    db = client[db_name]  # Use the extracted database name
    users_collection = db['users']  # Collection for storing user information
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    exit(1)

from routes.routes import *

if __name__ == '__main__':
    app.run(debug=True)