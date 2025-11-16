from database.db_connection import db
from werkzeug.security import generate_password_hash, check_password_hash

class UserModel:
    def __init__(self):
        self.collection = db["users"]

    def create_user(self, username, email, password):
        hashed_pw = generate_password_hash(password)
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_pw
        }
        self.collection.insert_one(user_data)
        return user_data

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})

    def verify_password(self, stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
