from flask import Blueprint, request, jsonify
from database.db_connection import db
import datetime
import random
from bson import ObjectId

booking_bp = Blueprint('booking', __name__)

# ✅ Convert ObjectId for JSON
def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    else:
        return obj


# ✅ Generate random PNR
def generate_pnr():
    today = datetime.datetime.utcnow().strftime("%Y%m%d")
    rand = random.randint(1000, 9999)
    return f"RM{today}-{rand}"


# ✅ Smart seat allocator
def assign_seat_types(seat_count, preference):
    seat_types = []
    type_order = {
        "window": ["window", "aisle", "middle"],
        "aisle": ["aisle", "window", "middle"],
        "middle": ["middle", "aisle", "window"],
        "any": ["window", "aisle", "middle"]
    }[preference]

    distribution = {"window": 0.4, "aisle": 0.4, "middle": 0.2}
    available = {k: int(v * seat_count) for k, v in distribution.items()}

    for _ in range(seat_count):
        for t in type_order:
            if available[t] > 0:
                seat_types.append(t)
                available[t] -= 1
                break
        else:
            seat_types.append(random.choice(["window", "aisle", "middle"]))
    return seat_types


# ✅ BOOK TICKET API (with WAITLIST logic)
@booking_bp.route('/book_ticket', methods=['POST', 'OPTIONS'])
def book_ticket():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json() or {}
    train_number = data.get('train_number')
    passengers = data.get('passengers', [])
    seats_requested = data.get('seats')
    seat_preference = data.get('seat_preference', 'any').lower()
    booked_by = data.get('booked_by')
    journey_date = data.get('journey_date')

    if not train_number or not passengers or not seats_requested:
        return jsonify({"error": "Missing required fields"}), 400

    train = db.trains.find_one({"train_number": train_number})
    if not train:
        return jsonify({"error": "Train not found"}), 404

    total_seats = train.get("total_seats", 0)
    available_seats = train.get("available_seats", total_seats)
    seats_already_allocated = total_seats - available_seats

    pnr = generate_pnr()
    booking_time = datetime.datetime.utcnow().isoformat() + "Z"

    # ✅ CASE 1: Enough seats → Confirmed
    if available_seats >= seats_requested:
        status = "CONFIRMED"
        start_seat = seats_already_allocated + 1
        seat_numbers = list(range(start_seat, start_seat + seats_requested))
        seat_types = assign_seat_types(seats_requested, seat_preference)
        db.trains.update_one({"train_number": train_number}, {"$inc": {"available_seats": -seats_requested}})
        queue_position = None

    # ✅ CASE 2: Some seats left → Partial Confirm
    elif available_seats > 0:
        confirmed = available_seats
        waitlisted = seats_requested - available_seats
        seat_numbers = list(range(seats_already_allocated + 1, total_seats + 1))
        seat_types = assign_seat_types(confirmed, seat_preference) + ["WAITLISTED"] * waitlisted
        status = "PARTIALLY_CONFIRMED"
        db.trains.update_one({"train_number": train_number}, {"$set": {"available_seats": 0}})

        # assign waitlist queue position
        last_waitlist = db.tickets.count_documents({
            "train.number": train_number,
            "status": {"$in": ["WAITLISTED", "PARTIALLY_CONFIRMED"]}
        })
        queue_position = last_waitlist + 1

    # ✅ CASE 3: No seats left → Waitlisted
    else:
        status = "WAITLISTED"
        seat_numbers = []
        seat_types = ["WAITLISTED"] * seats_requested
        last_waitlist = db.tickets.count_documents({
            "train.number": train_number,
            "status": {"$in": ["WAITLISTED", "PARTIALLY_CONFIRMED"]}
        })
        queue_position = last_waitlist + 1

    # ✅ Store ticket
    ticket_data = {
        "pnr": pnr,
        "train": {
            "number": train.get("train_number"),
            "name": train.get("train_name"),
            "source": train.get("source"),
            "destination": train.get("destination")
        },
        "passengers": passengers,
        "seats": [{"seat_no": sn, "type": st} for sn, st in zip(seat_numbers, seat_types)],
        "status": status,
        "queue_position": queue_position,
        "issued_on": booking_time,
        "journey_date": journey_date,
        "booked_by": booked_by
    }

    db.tickets.insert_one(ticket_data)
    updated_train = db.trains.find_one({"train_number": train_number}, {"_id": 0})

    return jsonify(convert_objectid({
        "message": f"Booking successful ({status})",
        "pnr": pnr,
        "status": status,
        "queue_position": queue_position,
        "ticket": ticket_data,
        "train": updated_train
    })), 200


# ✅ Get all user tickets
@booking_bp.route('/my_tickets', methods=['GET'])
def my_tickets():
    booked_by = request.args.get('booked_by')
    if not booked_by:
        return jsonify({"error": "Missing booked_by"}), 400

    tickets = list(db.tickets.find({"booked_by": booked_by}, {"_id": 0}).sort("issued_on", -1))
    if not tickets:
        return jsonify({"message": "No tickets found"}), 404

    return jsonify(convert_objectid({"tickets": tickets})), 200


# ✅ View a single ticket by PNR
@booking_bp.route('/ticket/<pnr>', methods=['GET'])
def view_ticket(pnr):
    ticket = db.tickets.find_one({"pnr": pnr}, {"_id": 0})
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    return jsonify(convert_objectid({"ticket": ticket})), 200
