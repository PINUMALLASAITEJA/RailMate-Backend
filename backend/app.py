import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from database.db_connection import db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
logger.info("=== Starting RailMate Backend ===")

MONGO_URI = os.environ.get("MONGO_URI")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "railmate_secret_key")

if not MONGO_URI:
    logger.error("❌ MONGO_URI missing in environment.")
else:
    logger.info("✅ MONGO_URI loaded.")

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# Allow dynamic origins
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get("Origin", "")
    if origin and (
        origin.startswith("https://rail-mate-frontend")
        or origin.startswith("http://localhost")
        or origin.endswith("vercel.app")
    ):
        response.headers["Access-Control-Allow-Origin"] = origin

    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# ---- MongoDB connect ----
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

# ---- Routes ----
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
        "status": "🚆 RailMate API Active",
        "message": "Backend Running"
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
