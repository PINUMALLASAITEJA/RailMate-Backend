from flask import Blueprint, request, jsonify
from database.db_connection import db

history_bp = Blueprint('history', __name__)

@history_bp.route('/booking_history', methods=['GET'])
def booking_history():
    passenger_name = request.args.get('passenger_name')

    if not passenger_name:
        return jsonify({"error": "Passenger name is required"}), 400

    # Find all bookings for this passenger
    bookings = list(db.bookings.find({"passenger_name": passenger_name}))

    if not bookings:
        return jsonify({"message": "No bookings found for this passenger"}), 404

    # Format the output
    formatted = []
    for booking in bookings:
        formatted.append({
            "id": str(booking["_id"]),
            "train_number": booking["train_number"],
            "passenger_name": booking["passenger_name"],
            "seats_booked": booking["seats_booked"]
        })

    return jsonify({
        "passenger_name": passenger_name,
        "total_bookings": len(formatted),
        "bookings": formatted
    }), 200
