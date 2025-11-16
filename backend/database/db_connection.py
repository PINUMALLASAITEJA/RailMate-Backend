# backend/database/db_connection.py
import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")

def get_database():
    if not MONGO_URI:
        logger.error("❌ MONGO_URI not set in environment!")
        return None

    try:
        # Use modern PyMongo TLS flags
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=10000,
            tls=True,
            tlsAllowInvalidCertificates=True  # use False when on normal Wi-Fi
        )

        # Verify connection
        client.admin.command("ping")
        logger.info("✅ MongoDB connection successful.")
        return client.get_database()

    except Exception:
        logger.exception("❌ MongoDB connection failed:")
        return None


db = get_database()
