from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
# Assuming db_connection.py is correctly set up to export 'db'
from database.db_connection import db 
import logging

# Set up logger for auth routes
logger = logging.getLogger(__name__)

# ----------------------------------------
# BLUEPRINT SETUP
# ----------------------------------------
auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')
SECRET_KEY = "railmate_secret_key" # NOTE: For production, this should be loaded from os.environ.get('JWT_SECRET_KEY')

# Allowed origins for CORS (local + Vercel)
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://rail-mate-frontend.vercel.app",
    "https://rail-mate-frontend-agv82ux7v-pinumalla-sai-tejas-projects.vercel.app"
]

# ----------------------------------------
# REGISTER ROUTE
# ----------------------------------------
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
def register():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 400

    hashed_pw = generate_password_hash(password)
    db.users.insert_one({'username': username, 'email': email, 'password': hashed_pw})

    return jsonify({'success': True, 'message': 'Registration successful'}), 201


# ----------------------------------------
# LOGIN ROUTE - DEBUGGED
# ----------------------------------------
@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    
    # 💥 DEBUG STEP 1: Check what data was received from the frontend
    logger.info(f"Login attempt received. Data: {data}")
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
         logger.warning("Login attempt failed: Missing email or password in request.")
         return jsonify({'error': 'Invalid email or password'}), 400

    user = db.users.find_one({'email': email})
    
    # 💥 DEBUG STEP 2: Check if the user was found in the database
    if not user:
        logger.warning(f"Login failed for email '{email}': User not found in DB.")
        return jsonify({'error': 'Invalid email or password'}), 401
    
    logger.info(f"User found for email: {email}. Verifying password...")

    # 💥 DEBUG STEP 3: Check password hash verification
    if not check_password_hash(user['password'], password):
        logger.warning(f"Login failed for email '{email}': Password mismatch.")
        return jsonify({'error': 'Invalid email or password'}), 401
    
    logger.info(f"Login successful for user: {user.get('username')}")

    # --- If successful, generate token ---
    token = jwt.encode({
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'token': token,
        'username': user.get('username'),
        'message': 'Login successful'
    }), 200


# ----------------------------------------
# PROFILE ROUTE
# ----------------------------------------
@auth_bp.route('/profile', methods=['GET', 'OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
def profile():
    if request.method == 'OPTIONS':
        return '', 200

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Authorization header missing'}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        email = decoded['email']

        user = db.users.find_one({'email': email}, {'_id': 0, 'password': 0})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'username': user.get('username'),
            'email': user['email'],
            'message': 'Profile fetched successfully'
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
