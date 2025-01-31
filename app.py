import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__, template_folder='src')# MongoDB connection
mongo_uri = os.getenv("mongodb+srv://kunigiriraghunath9493:AppcsIAc12mLh7k1@acn.oa10h.mongodb.net/?retryWrites=true&w=majority")
client = MongoClient(mongo_uri)
db = client['sample_mflix']  # Replace with your database name
users_collection = db['users']  # Collection for storing user information
# Import routes
from routes.routes import *

if __name__ == '__main__':
    app.run(debug=True)