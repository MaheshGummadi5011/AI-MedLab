#!/usr/bin/env python3
"""Direct MongoDB seeding script - bypasses Flask entirely"""

import pymongo
from pymongo.server_api import ServerApi
import os
import sys

# Get connection string from app.py
sys.path.insert(0, r'C:\Users\dell\Downloads\AI-MedLab\backend')

try:
    from dotenv import load_dotenv
    load_dotenv()
    URI = os.getenv("DBURL")
    if not URI:
        raise ValueError("DBURL environment variable not set")
except:
    print("Error loading .env, using fallback connection string")
    URI = "mongodb+srv://aimedlab:VWTS8khWf7JvKmAA@aimedlab.xyq6l.mongodb.net/?retryWrites=true&w=majority"

print(f"Connecting to MongoDB...")
try:
    client = pymongo.MongoClient(
        URI, 
        server_api=ServerApi('1'),
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        retryWrites=True,
        tlsAllowInvalidCertificates=False
    )
    client.admin.command('ping')
    print("[✓] MongoDB connected successfully!")
    
    db = client.get_database("ai-medlab")
    doctors = db.doctors
    
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
    
    inserted = 0
    for doctor in mock_doctors:
        if not doctors.find_one({"email": doctor["email"]}):
            doctors.insert_one(doctor)
            inserted += 1
            print(f"[+] {doctor['username']}")
        else:
            print(f"[-] {doctor['username']} (already exists)")
    
    print(f"\n[✓✓✓] SUCCESS! Added {inserted}/10 mock doctors to database")
    print(f"[✓✓✓] All doctors set to status='offline' as requested")
    
    client.close()
    
except Exception as e:
    print(f"[✗] Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
