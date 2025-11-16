import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from database.db_connection import db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

logger.info("=== Starting RailMate Backend ===")

# --- Load Environment Variables ---
MONGO_URI = os.environ.get("MONGO_URI")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "railmate_secret_key")

if not MONGO_URI:
    logger.error("❌ MONGO_URI missing in environment. Set it in .env for local or Vercel env vars for deployment.")
else:
    logger.info("✅ MONGO_URI loaded (hidden for security).")

# --- Initialize Flask ---
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# --- CORS ---
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://rail-mate-frontend.vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# --- Try Database Connection ---
def try_connect_mongo():
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000)
        client.admin.command("ping")
        logger.info("✅ MongoDB connection successful.")
        return client
    except Exception as e:
        logger.error("❌ MongoDB connection failed:")
        logger.error(e)
        return None

client = try_connect_mongo()

# --- Import Routes ---
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

# --- Home Route ---
@app.route("/")
def home():
    return jsonify({
        "status": "✅ RailMate API Active",
        "message": "Welcome to RailMate Cloud API",
        "available_endpoints": [
            "/auth/register",
            "/auth/login",
            "/auth/profile",
            "/trains",
            "/book_ticket",
            "/cancel_ticket",
            "/my_tickets"
        ]
    })

if __name__ == "__main__":
    logger.info("🚀 Starting local server on http://0.0.0.0:5000")
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
