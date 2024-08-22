# app.py
import os
from dotenv import load_dotenv
from flask import Flask
from pymongo import MongoClient, errors
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__, template_folder='src')# MongoDB connection

mongo_uri = os.getenv("mongodb://atlas-sql-66b7bf92b8c439525f7d2eac-ckryr.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin")
try:
    client = MongoClient(mongo_uri)
    db = client['sample_mflix']  # Replace with your database name
    users_collection = db['users']
    print("Connected to MongoDB successfully!")
except errors.ConnectionFailure as e:
    print(f"Error connecting to MongoDB: {e}")
    exit(1)
# Import routes
from routes.routes import *

if __name__ == '__main__':
    app.run(debug=True)