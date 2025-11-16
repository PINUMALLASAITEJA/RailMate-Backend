from flask import Blueprint, jsonify, request
from database.db_connection import db
from bson.objectid import ObjectId

trains_bp = Blueprint('trains', __name__, url_prefix='/trains')

@trains_bp.route('/', methods=['GET'])
def get_trains():
    source = request.args.get('source')
    destination = request.args.get('destination')
    train_number = request.args.get('train_number')

    query = {}
    if source:
        query['source'] = source
    if destination:
        query['destination'] = destination
    if train_number:
        query['train_number'] = train_number

    trains_cursor = db.trains.find(query)
    trains = []
    for train in trains_cursor:
        trains.append({
            "id": str(train["_id"]),
            "train_number": train["train_number"],
            "train_name": train["train_name"],
            "source": train["source"],
            "destination": train["destination"],
            "total_seats": train["total_seats"],
            "available_seats": train["available_seats"]
        })
    if not trains:
        return jsonify({"message": "No trains found for the given filters"}), 404
    return jsonify(trains)
