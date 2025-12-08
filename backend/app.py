import os
import logging
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from database.db_connection import db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
logger.info("=== Starting RailMate Backend ===")

# --- Load Environment Variables ---
MONGO_URI = os.environ.get("MONGO_URI")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "railmate_secret_key")

if not MONGO_URI:
    logger.error("❌ MONGO_URI missing in environment.")
else:
    logger.info("✅ MONGO_URI loaded (hidden for security).")

# --- Initialize Flask ---
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# --- Allowed CORS Origins ---
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://rail-mate-frontend.vercel.app",
    "https://rail-mate-frontend-4kb9zahza-pinumalla-sai-tejas-projects.vercel.app"
]

# --- Enable CORS ---
CORS(
    app,
    supports_credentials=True,
    origins=ALLOWED_ORIGINS,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

# --- Manual OPTIONS handler ---
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        origin = request.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200

# --- Try Database Connection ---
def try_connect_mongo():
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=7000)
        client.admin.command("ping")
        logger.info("✅ MongoDB connection successful.")
        return client
    except Exception as e:
        logger.error("❌ MongoDB connection failed:")
        logger.error(e)
        return None

client = try_connect_mongo()

# --- ROUTES ---
from routes.auth_routes import auth_bp
from routes.trains_routes import trains_bp
from routes.booking import booking_bp
from routes.bookings_routes import bookings_bp
from routes.cancel_booking import cancel_bp
from routes.history_routes import history_bp

app.register_blueprint(auth_bp)
app.register_blueprint(trains_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(cancel_bp)
app.register_blueprint(history_bp)

@app.route("/")
def home():
    return jsonify({
        "status": "✅ RailMate API Active",
        "message": "Welcome to RailMate Cloud API"
    })

if __name__ == "__main__":
    logger.info("🚀 Running locally at http://0.0.0.0:5000")
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
