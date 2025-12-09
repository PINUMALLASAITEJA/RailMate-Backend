from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.db_connection import db
import jwt
from datetime import datetime, timedelta
from flask import current_app

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

users_collection = db["users"]

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username") or email.split("@")[0]

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    new_user = {
        "email": email,
        "username": username,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully!"}), 201


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Incorrect password"}), 401

    token = jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(hours=12)},
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256",
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "username": user["username"]
    }), 200


# PROFILE
@auth_bp.route("/profile", methods=["GET"])
def profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        email = decoded.get("email")
        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"username": user["username"], "email": user["email"]}), 200

    except:
        return jsonify({"error": "Invalid or expired token"}), 401
