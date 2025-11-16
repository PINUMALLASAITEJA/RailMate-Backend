from bson.objectid import ObjectId

class Train:
    def __init__(self, train_number, name, source, destination, seats):
        self.train_number = train_number
        self.name = name
        self.source = source
        self.destination = destination
        self.seats = seats

    def to_dict(self):
        return {
            "train_number": self.train_number,
            "name": self.name,
            "source": self.source,
            "destination": self.destination,
            "seats": self.seats
        }
