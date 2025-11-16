from flask import Blueprint, jsonify
from database.db_connection import db

bookings_bp = Blueprint('bookings', __name__, url_prefix='/bookings')

@bookings_bp.route('/', methods=['GET'])
def get_all_bookings():
    bookings = list(db.bookings.find())
    # Convert ObjectId to string
    for b in bookings:
        b['id'] = str(b['_id'])
        del b['_id']
    return jsonify(bookings)
