# populate_trains.py

from database.db_connection import db

# Sample train data
trains_data = [
    {
        "train_number": "12345",
        "train_name": "Express One",
        "source": "Hyderabad",
        "destination": "Bangalore",
        "total_seats": 100,
        "available_seats": 100
    },
    {
        "train_number": "23456",
        "train_name": "Express Two",
        "source": "Chennai",
        "destination": "Mumbai",
        "total_seats": 150,
        "available_seats": 150
    },
    {
        "train_number": "34567",
        "train_name": "Express Three",
        "source": "Delhi",
        "destination": "Kolkata",
        "total_seats": 120,
        "available_seats": 120
    }
]

def populate_trains():
    trains_collection = db.trains  # collection name: trains
    result = trains_collection.insert_many(trains_data)
    print(f"Inserted {len(result.inserted_ids)} trains successfully.")

if __name__ == "__main__":
    populate_trains()
