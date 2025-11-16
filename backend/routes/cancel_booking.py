from flask import Blueprint, request, jsonify
from database.db_connection import db

cancel_bp = Blueprint('cancel_booking', __name__)

@cancel_bp.route('/cancel_ticket', methods=['POST'])
def cancel_ticket():
    data = request.get_json() or {}
    pnr = data.get('pnr')
    passenger_name = data.get('passenger_name')

    if not pnr or not passenger_name:
        return jsonify({"error": "PNR and passenger_name are required"}), 400

    # ✅ Find the ticket
    ticket = db.tickets.find_one({"pnr": pnr})
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    train_number = ticket["train"]["number"]
    train = db.trains.find_one({"train_number": train_number})
    if not train:
        return jsonify({"error": "Train not found"}), 404

    # ✅ Find the passenger to remove
    remaining_passengers = [p for p in ticket["passengers"] if p["name"] != passenger_name]
    cancelled_passenger = next((p for p in ticket["passengers"] if p["name"] == passenger_name), None)

    if not cancelled_passenger:
        return jsonify({"error": f"Passenger '{passenger_name}' not found in this ticket"}), 404

    # ✅ If passenger had a seat, free it
    seat_to_free = None
    if ticket.get("seats"):
        for seat in ticket["seats"]:
            if seat["seat_no"] and seat["type"] != "WAITLISTED":
                seat_to_free = seat
                break

    if seat_to_free:
        db.trains.update_one({"train_number": train_number}, {"$inc": {"available_seats": 1}})

    # ✅ Remove the passenger and corresponding seat
    remaining_seats = ticket["seats"][:-1] if len(ticket["seats"]) > 0 else []
    status = "CANCELLED" if len(remaining_passengers) == 0 else ticket["status"]

    # ✅ Update ticket
    db.tickets.update_one(
        {"pnr": pnr},
        {"$set": {"passengers": remaining_passengers, "seats": remaining_seats, "status": status}}
    )

    # ✅ Try to promote waitlisted users silently
    promote_waitlisted_users(train_number)

    # ✅ Return clean response
    return jsonify({
        "message": f"🚫 Ticket cancelled for {passenger_name}",
        "pnr": pnr,
        "remaining_passengers": remaining_passengers,
        "status": status
    }), 200


def promote_waitlisted_users(train_number):
    """
    Promotes waiting passengers silently if seats become available.
    """
    train = db.trains.find_one({"train_number": train_number})
    available = train.get("available_seats", 0)
    if available <= 0:
        return

    waitlisted = list(db.tickets.find(
        {"train.number": train_number, "status": {"$in": ["WAITLISTED", "PARTIALLY_CONFIRMED"]}}
    ).sort("issued_on", 1))

    for t in waitlisted:
        if available <= 0:
            break

        # Promote one passenger at a time
        for seat in t["seats"]:
            if seat["type"] == "WAITLISTED" and available > 0:
                seat["type"] = "CONFIRMED"
                available -= 1
                db.trains.update_one({"train_number": train_number}, {"$inc": {"available_seats": -1}})

        # Update status
        all_confirmed = all(s["type"] == "CONFIRMED" for s in t["seats"])
        new_status = "CONFIRMED" if all_confirmed else "PARTIALLY_CONFIRMED"

        db.tickets.update_one(
            {"pnr": t["pnr"]},
            {"$set": {"seats": t["seats"], "status": new_status}}
        )
