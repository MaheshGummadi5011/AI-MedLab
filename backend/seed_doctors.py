#!/usr/bin/env python
"""Seed mock doctors into MongoDB for testing"""

import pymongo
from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string
mongo_uri = os.getenv('MONGO_CONNECTION_STRING', 
    'mongodb+srv://aimedlab:VWTS8khWf7JvKmAA@aimedlab.xyq6l.mongodb.net/?retryWrites=true&w=majority')

# Connect to MongoDB
try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    db = client['AI-MedLab']
    doctors = db['doctors']
    
    # Test connection
    client.server_info()
    print("[MongoDB] Connected successfully!")
except Exception as e:
    print(f"[MongoDB] Connection failed: {e}")
    exit(1)

# Mock doctors data
mock_doctors = [
    {"username": "Dr. Amit Kumar", "email": "dr.amit@example.com", "password": "hashedpassword123", "specialization": "Cardiologist", "gender": "Male", "phone": "+91-9876543210", "verified": True, "status": "offline", "meet": False, "appointments": 245, "stars": 4.8, "fee": 500, "bio": "Experienced cardiologist with 15 years of practice"},
    {"username": "Dr. Priya Singh", "email": "dr.priya@example.com", "password": "hashedpassword123", "specialization": "Dermatologist", "gender": "Female", "phone": "+91-9876543211", "verified": True, "status": "offline", "meet": False, "appointments": 189, "stars": 4.6, "fee": 400, "bio": "Skin specialist with expertise in cosmetic dermatology"},
    {"username": "Dr. Rajesh Patel", "email": "dr.rajesh@example.com", "password": "hashedpassword123", "specialization": "Neurologist", "gender": "Male", "phone": "+91-9876543212", "verified": True, "status": "offline", "meet": False, "appointments": 156, "stars": 4.7, "fee": 550, "bio": "Specialist in neurological disorders and brain health"},
    {"username": "Dr. Anjali Sharma", "email": "dr.anjali@example.com", "password": "hashedpassword123", "specialization": "Pediatrician", "gender": "Female", "phone": "+91-9876543213", "verified": True, "status": "offline", "meet": False, "appointments": 312, "stars": 4.9, "fee": 350, "bio": "Child health expert with compassionate care approach"},
    {"username": "Dr. Vikram Reddy", "email": "dr.vikram@example.com", "password": "hashedpassword123", "specialization": "Orthopedic Surgeon", "gender": "Male", "phone": "+91-9876543214", "verified": True, "status": "offline", "meet": False, "appointments": 278, "stars": 4.5, "fee": 600, "bio": "Experienced in joint replacement and sports medicine"},
    {"username": "Dr. Neha Gupta", "email": "dr.neha@example.com", "password": "hashedpassword123", "specialization": "Psychiatrist", "gender": "Female", "phone": "+91-9876543215", "verified": True, "status": "offline", "meet": False, "appointments": 134, "stars": 4.8, "fee": 450, "bio": "Mental health professional with 12 years of experience"},
    {"username": "Dr. Arjun Verma", "email": "dr.arjun@example.com", "password": "hashedpassword123", "specialization": "Gastroenterologist", "gender": "Male", "phone": "+91-9876543216", "verified": True, "status": "offline", "meet": False, "appointments": 201, "stars": 4.6, "fee": 475, "bio": "Expert in digestive system disorders"},
    {"username": "Dr. Sneha Iyer", "email": "dr.sneha@example.com", "password": "hashedpassword123", "specialization": "Ophthalmologist", "gender": "Female", "phone": "+91-9876543217", "verified": True, "status": "offline", "meet": False, "appointments": 267, "stars": 4.7, "fee": 425, "bio": "Vision care specialist with advanced diagnostic equipment"},
    {"username": "Dr. Sanjay Nair", "email": "dr.sanjay@example.com", "password": "hashedpassword123", "specialization": "Pulmonologist", "gender": "Male", "phone": "+91-9876543218", "verified": True, "status": "offline", "meet": False, "appointments": 189, "stars": 4.4, "fee": 500, "bio": "Respiratory specialist with critical care experience"},
    {"username": "Dr. Meera Menon", "email": "dr.meera@example.com", "password": "hashedpassword123", "specialization": "Gynecologist", "gender": "Female", "phone": "+91-9876543219", "verified": True, "status": "offline", "meet": False, "appointments": 324, "stars": 4.9, "fee": 400, "bio": "Women's health specialist with obstetric expertise"}
]

# Insert doctors that don't already exist
inserted_count = 0
for doctor in mock_doctors:
    existing = doctors.find_one({"email": doctor["email"]})
    if not existing:
        doctors.insert_one(doctor)
        inserted_count += 1
        print(f"✓ Added: {doctor['username']}")
    else:
        print(f"- Already exists: {doctor['username']}")

print(f"\n✅ Seeding complete! Added {inserted_count} new doctors.")
client.close()
