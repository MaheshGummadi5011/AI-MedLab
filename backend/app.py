import datetime
import uuid
from flask import Flask, request, Response, redirect, render_template, send_from_directory, jsonify, url_for, make_response
import secrets
import stripe
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required
from flask_cors import CORS
# ✅ FIXED: Added Flask-Limiter for rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import pymongo
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import json
from threading import Thread
import requests
from twilio.rest import Client
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
from utils.imageUploader import upload_file
from bson import ObjectId
from flask_swagger_ui import get_swaggerui_blueprint
from flasgger import Swagger
# import google.generativeai as genai
# from utils.analyzeReport import extract_text_from_pdf

load_dotenv()
secret_key = secrets.token_hex(16)

app = Flask(__name__)
swagger = Swagger(app)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = os.getenv('SECRET')
# ✅ FIXED: Added MAX_CONTENT_LENGTH to prevent file upload DoS
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB limit

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = os.getenv('PORT')
app.config['MAIL_USERNAME'] = os.getenv('HOST_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
mail = Mail(app)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
jwt = JWTManager(app)

# ✅ FIXED: Initialize rate limiter for /login and /register endpoints
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# ✅ FIXED: Simplified CORS configuration for Vercel - support all frontend URLs
CORS(app, 
     origins=["https://ai-med-lab-98qa.vercel.app", "https://ai-med-lab-eight.vercel.app", "http://localhost:3000", "http://localhost:5173"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
     supports_credentials=True,
     max_age=3600)

# ✅ FIXED: Add OPTIONS method to all routes for preflight requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        origin = request.headers.get('Origin')
        allowed_origins = [
            "https://ai-med-lab-98qa.vercel.app",
            "https://ai-med-lab-eight.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
        ]
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200

# ✅ FIXED: Ensure CORS headers are on every response
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed_origins = [
        "https://ai-med-lab-98qa.vercel.app",
        "https://ai-med-lab-eight.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response
bcrypt = Bcrypt(app)

# Twilio Whatsapp notification variables
URI = os.getenv("DBURL")

# Twilio Whatsapp notification variables
twilioWhatsappAccountSid = os.getenv("TWILIO_WHATSAPP_ACCOUNT_SID")
twilioWhatsappAuthToken = os.getenv("TWILIO_WHATSAPP_AUTH_TOKEN")
twilioWhatsappFrom = os.getenv("TWILIO_WHATSAPP_FROM")
whatsappclient = Client(twilioWhatsappAccountSid, twilioWhatsappAuthToken)

firebase_config = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),  
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
}

if firebase_config:
    try:
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        print("[Firebase] Initialized successfully!")
    except Exception as e:
        print(f"[Firebase Init Error]: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
else:
    print("[Firebase] Error: Credentials not found in environment variables.")

# Global database client and collections
db_client = None
doctors = None
patients = None
website_feedback = None

def init_db():
    """Initialize database collections on first call"""
    global db_client, doctors, patients, website_feedback
    
    if db_client is not None:
        return doctors, patients, website_feedback
    
    try:
        # Enhanced MongoDB connection with SSL/TLS settings
        db_client = pymongo.MongoClient(
            URI, 
            server_api=ServerApi('1'),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000,
            retryWrites=True,
            tlsAllowInvalidCertificates=False  # ✅ FIXED: Enabled TLS validation for security
        )
        db_client.admin.command('ping')
        print("[MongoDB] Connected successfully!")
        
        db = db_client.get_database("ai-medlab")
        doctors = db.doctors
        patients = db.patients
        website_feedback = db.website_feedback
        return doctors, patients, website_feedback
    except Exception as e:
        print(f"[MongoDB] Connection failed: {e}")
        # Try reconnecting with more aggressive retry
        try:
            print("[MongoDB] Retrying with alternative SSL settings...")
            db_client = pymongo.MongoClient(
                URI, 
                server_api=ServerApi('1'),
                serverSelectionTimeoutMS=15000,
                connectTimeoutMS=15000,
                socketTimeoutMS=15000,
                retryWrites=True,
                tlsAllowInvalidCertificates=False  # ✅ FIXED: Consistent TLS validation
            )
            db_client.admin.command('ping')
            print("[MongoDB] Connected successfully on retry!")
            
            db = db_client.get_database("ai-medlab")
            doctors = db.doctors
            patients = db.patients
            website_feedback = db.website_feedback
            return doctors, patients, website_feedback
        except Exception as retry_error:
            print(f"[MongoDB] Retry also failed: {retry_error}")
            return None, None, None

# Try to initialize on app load
def get_db_collections():
    """Get database collections, initializing if needed"""
    global db_client, doctors, patients, website_feedback
    
    if doctors is not None and patients is not None:
        return doctors, patients, website_feedback
    
    return init_db()

print("Initializing MongoDB on app startup...")
docs, pats, feeds = get_db_collections()
if docs is not None:
    doctors = docs
    patients = pats
    website_feedback = feeds
    print("[MongoDB] Database collections initialized")
    
    # Auto-seed mock doctors if they don't exist
    mock_doctors_emails = [
        "dr.amit@example.com", "dr.priya@example.com", "dr.rajesh@example.com",
        "dr.anjali@example.com", "dr.vikram@example.com", "dr.neha@example.com",
        "dr.arjun@example.com", "dr.sneha@example.com", "dr.sanjay@example.com",
        "dr.meera@example.com"
    ]
    
    existing_mock = docs.count_documents({"email": {"$in": mock_doctors_emails}})
    if existing_mock == 0:
        print("[Seeding] Adding mock doctors to database...")
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
        docs.insert_many(mock_doctors)
        print(f"[Seeding] ✅ Inserted 10 mock doctors with status='offline'")
else:
    print("[MongoDB] Failed to initialize collections - they will be initialized on first request")

YOUR_DOMAIN = os.getenv('DOMAIN') 

## Swagger specific ###
SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (ex. http://your-domain/api/docs)
API_URL = '/static/swagger.yaml'  # URL where your swagger.yaml is stored
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={ 'app_name': "Authentication API" }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
## End Swagger specific ###

# MongoDB status will be shown from initial connection attempt above

@app.get("/")
def getInfo():
    return "WelCome to 💖AI-MedLab server !!!! "

@app.get("/health")
def health_check():
    docs, pats, feeds = get_db_collections()
    return jsonify({
        "status": "running",
        "firebase": "initialized",
        "mongodb": "connected" if docs is not None and pats is not None else "initializing"
    }), 200

@app.get("/debug")
def debug_info():
    docs, pats, feeds = get_db_collections()
    return jsonify({
        "backend": "running",
        "cors": "configured",
        "database": {
            "doctors": "connected" if docs is not None else "not initialized",
            "patients": "connected" if pats is not None else "not initialized",
            "feedback": "connected" if feeds is not None else "not initialized"
        },
        "routes": [
            "/health", "/debug", "/website_feedback", "/get_cart", 
            "/add_to_cart", "/increase_quantity", "/decrease_quantity",
            "/add_wallet_history", "/get_wallet_history"
        ]
    }), 200

@app.get("/hello")
def hello_greeting():
    return "Helloo.... please feel free to explore 💖AI-MedLab & lets make it better together !!!!"

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

def whatsapp_message(msg):
    try:
        # Extract recipient and message content from the msg dictionary
        to = msg.get('to')  
        body = msg.get('body')  

        # Prepare the message sending parameters
        message_params = {
            "from_": twilioWhatsappFrom,
            "to": to,
            "body": body
        }

        # Send the WhatsApp message
        message = whatsappclient.messages.create(**message_params)

        return {"status": "success", "message_sid": message.sid}
    
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return {"status": "error", "message": str(e)}

# Set up Gemini
# GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# ----------- stripe payment routes -----------------

@app.route('/checkout')
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                {   
                    # ✅ FIXED: Use environment variable for pricing
                    "price": os.getenv('STRIPE_PRICE_ID', 'price_1MxPc3SAmG5gMbbMjAeavhpb'),
                    "quantity": 1
                }
            ],
            mode="payment",
            success_url=YOUR_DOMAIN + "success",
            cancel_url = YOUR_DOMAIN + "failed"
        )
    except Exception as e:
        return str(e)
 
    return jsonify({'url': checkout_session.url})

@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.get_json()
        
        if not data or 'amount' not in data:
            return jsonify({'error': 'Amount is required'}), 400
            
        amount = float(data['amount'])
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency='inr',
            automatic_payment_methods={
                'enabled': True,
            },
        )

        return jsonify({
            'clientSecret': intent.client_secret
        })

    except stripe.error.StripeError as e:
        # Handle Stripe-specific errors
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Handle other errors
        print(f"Payment intent creation error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ----------- Authentication routes ----------------

# ✅ FIXED: Added rate limiting to prevent brute force attacks
@app.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    # Ensure collections are initialized
    if doctors is None or patients is None:
        docs_col, pats_col, _ = get_db_collections()
        if pats_col is None or docs_col is None:
            return jsonify({'message': 'Database service temporarily unavailable'}), 503
    else:
        docs_col = doctors
        pats_col = patients
    
    data = None
    cloudinary_url = None

    if 'registerer' in request.form:
        data = request.form.to_dict()
    else:
        data = {}

    # Firebase Google Register
    if 'id_token' in data:
        try:
            decoded_token = auth.verify_id_token(data['id_token'])
            email = decoded_token.get('email')
            print(f"[Firebase Register] Successfully verified token for email: {email}")
        except Exception as e:
            print(f"[Firebase Register Error]: {str(e)}")
            return jsonify({'message': f'Invalid Firebase token: {str(e)}'}), 401
    else:
        email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400
      
    if 'profile_picture' in request.files: 
        image_file = request.files['profile_picture']
        cloudinary_url = upload_file(image_file) 

    # Custom Register
    if data['registerer'] == 'patient':
        if docs_col.find_one({'email': email}) or pats_col.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400
        
        if 'id_token' not in data:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
        
        # Default values
        data.setdefault('username', 'Patient-' + email.split('@')[0])
        data.setdefault('age', '')
        data.setdefault('gender', '')
        data.setdefault('phone', '')
        data.setdefault('cart', [])
        data.setdefault('wallet', 0)
        data.setdefault('meet', False)
        data.setdefault('wallet_history', [])
        data.setdefault('upcomingAppointments', [])
        data.setdefault('completedMeets', [])
        if cloudinary_url:
            data['profile_picture'] = cloudinary_url
        if 'specialization' in data:
            del data['specialization']
        if 'doctorId' in data:
            del data['doctorId']
        
        pats_col.insert_one(data)

        if 'phone' in data:
            whatsapp_message({
                "to": f"whatsapp:{data['phone']}",
                "body": "Thank You for Signing up on AI-MedLab"
            })

        # ✅ FIXED: Generate and return access token on signup
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'User created successfully',
            "access_token": access_token,
            "username": data["username"],
            "usertype": "patient",
            "gender": data["gender"],
            "phone": data["phone"],
            "email": data["email"],
            "age": data["age"],
            "profile_picture": data.get("profile_picture"),
            "verified": False
        }), 200
    
    elif data['registerer'] == 'doctor':
        if pats_col.find_one({'email': email}) or docs_col.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400

        if 'id_token' not in data:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
        
        # Default values
        data.setdefault('username', 'Doctor-' + email.split('@')[0])
        data.setdefault('specialization', '')
        data.setdefault('gender', '')
        data.setdefault('phone', '')
        data.setdefault('appointments', 0)
        data.setdefault('stars', 0)
        data.setdefault('status', 'offline')
        data.setdefault('upcomingAppointments', [])
        data.setdefault('completedMeets', [])
        data.setdefault('fee', 0)
        data.setdefault('verified', False)
        data.setdefault('cart', [])
        data.setdefault('wallet_history', [])
        data.setdefault('wallet', 0)
        data.setdefault('meet', False)
        data.setdefault('doctorId', "")
        if cloudinary_url:
            data['profile_picture'] = cloudinary_url

        docs_col.insert_one(data)

        # ✅ FIXED: Generate and return access token on signup
        access_token = create_access_token(identity=email)

        return jsonify({
            'message': 'User created successfully',
            "access_token": access_token,
            "username": data["username"],
            "usertype": "doctor",
            "gender": data["gender"],
            "phone": data["phone"],
            "email": data["email"],
            "specialization": data["specialization"],
            "doctorId": data["doctorId"],
            "verified": data["verified"],
            "profile_picture": data.get("profile_picture"),
            "fee": data["fee"]
        }), 200
    
    else:
        return jsonify({'message': 'Invalid registerer type'}), 400

# ✅ FIXED: Added rate limiting to prevent brute force attacks
@app.route('/login', methods=['POST'])
@limiter.limit("10 per hour")
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Ensure collections are initialized
    if doctors is None or patients is None:
        docs_col, pats_col, _ = get_db_collections()
        if pats_col is None or docs_col is None:
            return jsonify({'message': 'Database service temporarily unavailable'}), 503
    else:
        docs_col = doctors
        pats_col = patients

    # Firebase Google Login
    if 'id_token' in data:
        try:
            decoded_token = auth.verify_id_token(data['id_token'])
            email = decoded_token.get('email')
            print(f"[Firebase Login] Successfully verified token for email: {email}")
        except Exception as e:
            print(f"[Firebase Login Error]: {type(e).__name__}: {str(e)}")
            # ✅ FIXED: Don't expose internal Firebase errors to clients
            return jsonify({'message': 'Authentication failed'}), 401
    else:
        email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Custom Login
    var = pats_col.find_one({'email': email})
    if var:
        if 'id_token' in data:
            # Google login - no password check needed
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "patient",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "age": var["age"],
                "profile_picture": var.get("profile_picture")
            }), 200
        elif 'passwd' in data and var.get('passwd') and bcrypt.check_password_hash(var['passwd'], data['passwd']):
            # Traditional password login
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "patient",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "age": var["age"],
                "profile_picture": var.get("profile_picture")
            }), 200
        return jsonify({'message': 'Invalid password'}), 400

    var = docs_col.find_one({'email': email})
    if var:
        if 'id_token' in data:
            # Google login - no password check needed
            docs_col.update_one({'email': email}, {'$set': {'status': 'online'}})
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "doctor",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "specialization": var["specialization"],
                "doctorId": var["doctorId"],
                "verified": var.get("verified", False),
                "profile_picture": var.get("profile_picture")
            }), 200
        elif 'passwd' in data and var.get('passwd') and bcrypt.check_password_hash(var['passwd'], data['passwd']):
            # Traditional password login
            docs_col.update_one({'email': email}, {'$set': {'status': 'online'}})
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "doctor",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "specialization": var["specialization"],
                "doctorId": var["doctorId"],
                "verified": var.get("verified", False),
                "profile_picture": var.get("profile_picture")
            }), 200
        return jsonify({'message': 'Invalid password'}), 400
    
    return jsonify({'message': 'User does not exist'}), 404
        
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    # ✅ FIXED: Validate input before accessing
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    
    # Find the document with the given email
    var = doctors.find_one({'email': email})
    
    if var:
        # If the document exists, check if 'verified' field exists
        if 'verified' not in var:
            # If 'verified' field doesn't exist, add it and set to True
            doctors.update_one({'email': email}, {'$set': {'verified': True}})
        else:
            # If 'verified' exists, just ensure it's set to True
            doctors.update_one({'email': email}, {'$set': {'verified': True}})
        
        verified = True  # Since we just set it to True
    else:
        verified = False  # If the document doesn't exist, treat as unverified
    
    return jsonify({'message': 'verification details', "verified": verified}), 200

# ✅ FIXED: Added data validation
@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    
    user = patients.find_one({'email': email}) or doctors.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Generate a password reset token
    token = secrets.token_urlsafe(16)

    # Store the token in the user's document with an expiration time
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    patients.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})
    doctors.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})

    # Send the token to the user's email
    reset_url = url_for('reset_password', token=token, _external=True)
    msg = Message("Password Reset Request",
                    sender=os.getenv('HOST_EMAIL'),
                    recipients=[email])
    msg.body = f"To reset your password, visit the following link: https://ai-medlab.vercel.app/reset-password/{token}"
    mail.send(msg)

    return jsonify({'message': 'Password reset link sent'}), 200

# ✅ FIXED: Added data validation
@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    if not data or 'password' not in data:
        return jsonify({'error': 'Password is required'}), 400
    new_password = data['password']
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Find the user with the token and check if it's still valid
    user = patients.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}}) or \
           doctors.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}})
    
    if not user:
        return jsonify({'message': 'The reset link is invalid or has expired'}), 400

    # Update the user's password and remove the reset token
    patients.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})
    doctors.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})

    return jsonify({'message': 'Password has been reset'}), 200

        
# ✅ FIXED: Added JWT authentication and data validation
@app.route('/doc_status', methods=['PUT'])
@jwt_required()
def doc_status():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    user = data['email']
    doctors.update_one({'email': user}, {'$set': {'status': 'offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

# @app.route('/meet_end', methods=['PUT'])
# def meet_end():
#     data = request.get_json()
#     user = data['email']
#     doctor.update_one({'email': user}, {'$set': {'meet': False}})
#     return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctors.find():
        if i.get('verified', False):
            count += 1
            details.append({"email": i["email"], "status": i.get("status", "offline"), "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "isInMeet": i["meet"], "noOfAppointments": i["appointments"], "noOfStars": i["stars"], "id": count, 'fee': i.get('fee', 199)})
    return jsonify({"details": details}), 200

# ✅ NEW: Seed mock doctors data
@app.route('/test123', methods=['GET'])
def test():
    return jsonify({"test": "working"}), 200

# ✅ NEW: Seed mock doctors data
@app.route('/api/seed-doctors', methods=['POST'])
def seed():
    """Add mock doctors to database for testing and demonstration"""
    try:
        docs_col, _, _ = get_db_collections()
        if docs_col is None:
            return jsonify({"error": "Database connection failed"}), 500
        
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
            if not docs_col.find_one({"email": doctor["email"]}):
                docs_col.insert_one(doctor)
                inserted += 1
        
        return jsonify({"message": f"Seeded {inserted} doctors", "count": inserted, "total": len(mock_doctors)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def send_message_async(msg):
    with app.app_context():
        mail.send(msg)
        # os.remove(os.path.join(app.root_path, 'upload', 'Receipt.pdf'))

@app.get('/media/<path:path>')
def send_media(path):
    return send_from_directory(
        directory='upload', path=path
    )

# ✅ FIXED: Added JWT authentication and file validation
@app.route('/mail_file', methods=['POST'])
@jwt_required()
def mail_file():
    # Get form data
    demail = request.form.get("demail")
    pemail = request.form.get("pemail")
    meetLink = request.form.get("meetLink")
    # ✅ FIXED: Validate file exists before accessing
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f = request.files['file']
    
    # Save the uploaded file
    file_path = os.path.join(app.root_path, 'Receipt.pdf')
    f.save(file_path)

    # Upload the file to Cloudinary
    file_url = upload_file(file_path)

    if "http" not in file_url:
        return jsonify({"error": "File upload failed", "details": file_url}), 500
    
    # Retrieve patient and doctor details from the database
    pat = patients.find_one({'email': pemail})
    doc = doctors.find_one({'email': demail})

    if not pat or not doc:
        return jsonify({"error": "Doctor or Patient not found"}), 404

    appointment_found = False 

    # Find the upcoming appointment based on meetLink
    for appointment in pat.get('upcomingAppointments', []):
        if appointment.get('link') == meetLink:
            appointment['prescription'] = file_url  # Add prescription link
            appointment_found = True
            break

    for appointment in doc.get('upcomingAppointments', []):
        if appointment.get('link') == meetLink:
            appointment['prescription'] = file_url  # Add prescription link
            appointment_found = True
            break

    # If not found in upcomingAppointments, check completedMeets
    if not appointment_found:
        for appointment in pat.get('completedMeets', []):
            if appointment.get('link') == meetLink:
                appointment['prescription'] = file_url  # Add prescription link
                appointment_found = True
                break

        for appointment in doc.get('completedMeets', []):
            if appointment.get('link') == meetLink:
                appointment['prescription'] = file_url  # Add prescription link
                appointment_found = True
                break

    # If appointment was found, update the database
    if appointment_found:
        patients.update_one({'email': pemail}, {"$set": {"upcomingAppointments": pat.get('upcomingAppointments', []), "completedMeets": pat.get('completedMeets', [])}})
        doctors.update_one({'email': demail}, {"$set": {"upcomingAppointments": doc.get('upcomingAppointments', []), "completedMeets": doc.get('completedMeets', [])}})

    # Prepare the email message
    msg = Message(
        "Receipt cum Prescription for your Consultancy",
        recipients=[pemail]
    )
    
    # Render the email HTML template with patient's username
    msg.html = render_template('email.html', Name=pat['username'])
    
    # Prepare and send the WhatsApp message with the PDF link
    whatsapp_message({
        "to": f"whatsapp:{pat['phone']}",
        "body": f"Thank you for taking our consultancy. Please find your prescription here: {file_url}",
    })
    
    # Attach the receipt PDF to the email message
    with app.open_resource(file_path) as fp:
        msg.attach("Receipt.pdf", "application/pdf", fp.read())
    thread = Thread(target=send_message_async, args=(msg,))
    thread.start()

    # Delete the local file after sending the email
    try:
        os.remove(file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    return jsonify({"message": "Success"}), 200

# ----------- appointment routes -----------------

# ✅ FIXED: Added JWT authentication
@app.route('/doctor_apo', methods=['POST', 'PUT'])
@jwt_required()
def doctor_apo():
    data = request.get_json()
    if not data or 'demail' not in data:
        return jsonify({'error': 'Doctor email is required'}), 400
    email = data['demail']
    doc = doctors.find_one({'email': email})
    if not doc:
        return jsonify({'error': 'Doctor not found'}), 404

    if request.method == 'POST':
        return jsonify({'message': 'Doctor Appointments', 'upcomingAppointments': doc['upcomingAppointments']}), 200
    else:
        # Validate all required fields for PUT request
        required_fields = ['date', 'time', 'patient', 'link']
        if not all(field in data for field in required_fields):
            return jsonify({'error': f'Missing required fields: {", ".join([f for f in required_fields if f not in data])}'}), 400
        
        doc['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "patient": data['patient'],
            "demail": data['demail'],
            "link": data['link'],
        })
        doctors.update_one({'email': email}, {'$set': {'upcomingAppointments': doc['upcomingAppointments']}})
        return jsonify({
            'message': 'Doctor status updated successfully',
            'upcomingAppointments': doc['upcomingAppointments']
        }), 200

@app.route('/update_doctor_ratings', methods=['PUT'])
def doctor_app():
    data = request.get_json()

    # Extract from request
    pemail = data.get('pemail')
    demail = data.get('demail')
    meet_link = data.get('meetLink')
    stars = data.get('stars')

    # Validate required fields
    if not all([pemail, demail, meet_link, stars]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Find patient's upcoming appointment
    patient_doc = patients.find_one({'email': pemail, 'upcomingAppointments.link': meet_link})
    if not patient_doc:
        return jsonify({'error': 'Patient not found or appointment does not exist'}), 404

    # Find doctor's upcoming appointment
    doctor_doc = doctors.find_one({'email': demail, 'upcomingAppointments.link': meet_link})
    if not doctor_doc:
        return jsonify({'error': 'Doctor not found or appointment does not exist'}), 404

    # Retrieve the appointment object from patient's record
    appointment = next(
        (appt for appt in patient_doc.get('upcomingAppointments', []) if appt['link'] == meet_link),
        None
    )

    if not appointment:
        return jsonify({'error': 'Appointment details not found'}), 404

    # ✅ FIXED: Added type validation and bounds check for star rating
    try:
        stars_int = int(stars)
        if stars_int < 0 or stars_int > 5:
            return jsonify({'error': 'Stars must be between 0 and 5'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Stars must be a valid integer'}), 400

    # Add stars to appointment
    appointment['stars'] = stars_int

    # Remove appointment from patient's upcomingAppointments
    patients.update_one(
        {'email': pemail},
        {'$pull': {'upcomingAppointments': {'link': meet_link}}}
    )

    # Remove appointment from doctor's upcomingAppointments
    doctors.update_one(
        {'email': demail},
        {'$pull': {'upcomingAppointments': {'link': meet_link}}}
    )

    # Append to patient's completedMeet
    patients.update_one(
        {'email': pemail},
        {'$push': {'completedMeets': appointment}}
    )

    # Append to doctor's completedMeet
    doctors.update_one(
        {'email': demail},
        {'$push': {'completedMeets': appointment}}
    )

    # Update doctor's ratings and appointment count
    rating_update = doctors.update_one(
        {'email': demail},
        {'$inc': {'appointments': 1, 'stars': stars}}
    )

    if rating_update.matched_count == 0:
        return jsonify({'error': 'Doctor rating update failed'}), 404

    return jsonify({'message': 'Appointment completed and ratings updated successfully'}), 200

# ✅ FIXED: Added data validation
@app.route('/set_appointment', methods=['POST', 'PUT'])
def set_appointment():
    data = request.get_json()
    # Validate required fields
    required_fields = ['demail', 'pemail', 'date', 'time']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': f'Missing required fields: {", ".join([f for f in required_fields if f not in (data or {})])}'}), 400
    
    demail = data['demail']
    pemail = data['pemail']

    doc = doctors.find_one({'email': demail})
    pat = patients.find_one({'email': pemail})

    whatsapp_message({
        "to": f"whatsapp:{pat['phone']}",
        "body": "Your Appointment has been booked on " + data['date'] + " at "+ data['time'] + " with Dr. " + doc['username'] +"."+" "+doc['email']
    })

    return jsonify({
        'message': 'Appoitment Fixed Successfully', 
    }), 200

# ✅ FIXED: Added data validation
@app.route('/patient_apo', methods=['POST', 'PUT'])
def patient_apo():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    pat = patients.find_one({'email': email})

    if request.method == 'POST':
        return jsonify({'message': 'Patient Appointments', 'appointments': pat['upcomingAppointments']}), 200
    else:
        pat['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "doctor": data['doctor'],
            "demail": data['demail'],
            "link": data['link'],
        })
        patients.update_one({'email': email}, {'$set': {'upcomingAppointments': pat['upcomingAppointments']}})
        return jsonify({'message': 'Patient status updated successfully'}), 200
    
@app.route('/completed_meets', methods=['POST'])
def completed_meets():
    data = request.get_json()

    if not data or 'useremail' not in data:
        return jsonify({"error": "Email parameter is required"}), 400

    useremail = data['useremail']

    # Check if user is a doctor
    doctor = doctors.find_one({'email': useremail}, {'completedMeets': 1, '_id': 0})
    if doctor:
        completed_meets = doctor.get('completedMeets', [])
        
        # Fetch patient usernames
        for meet in completed_meets:
            patient = patients.find_one({'email': meet.get('pemail')}, {'username': 1, '_id': 0})
            meet['patient'] = patient.get('username', 'Unknown') if patient else 'Unknown'
        
        return jsonify({"completedMeets": completed_meets}), 200

    # Check if user is a patient
    patient = patients.find_one({'email': useremail}, {'completedMeets': 1, '_id': 0})
    if patient:
        completed_meets = patient.get('completedMeets', [])
        
        # Fetch doctor usernames
        for meet in completed_meets:
            doctor = doctors.find_one({'email': meet.get('demail')}, {'username': 1, '_id': 0})
            meet['doctor'] = doctor.get('username', 'Unknown') if doctor else 'Unknown'
        
        return jsonify({"completedMeets": completed_meets}), 200

    return jsonify({"error": "User not found"}), 404

# ----------- meeting routes -----------------

@app.route('/make_meet', methods=['POST', 'PUT'])
def make_meet():
    data = request.get_json()
    demail = data.get('demail') or data.get('email')

    # Validate required fields for PUT request
    if request.method == 'PUT':
        doctors.update_one({'email': demail}, {'$set': {'link': {'link': data['link'], "name": data['patient']}}})

        required_fields = ['demail', 'pemail', 'date', 'time', 'link']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Add meet link to doctor's profile
        doctors.update_one(
            {'email': demail},
            {'$set': {'link': {'link': data['link'], 'name': data['patient']}}}
        )

        # Add to doctor's upcoming appointments
        doctors.update_one(
            {'email': demail},
            {'$push': {'upcomingAppointments': {
                'demail': data['demail'],
                'pemail': data['pemail'],
                'date': data['date'],
                'time': data['time'],
                'link': data['link']
            }}}
        )

        # Add to patient's upcoming appointments
        patients.update_one(
            {'email': data['pemail']},
            {'$push': {'upcomingAppointments': {
                'demail': data['demail'],
                'pemail': data['pemail'],
                'date': data['date'],
                'time': data['time'],
                'link': data['link']
            }}}
        )

        return jsonify({'message': 'Meet link created and appointments updated successfully'}), 200

    # Handle POST request: Retrieve doctor's meet link
    else:
        doc = doctors.find_one({'email': demail})
        return jsonify({'message': 'Meet link', 'link': doc.get('link', None)}), 200
    
# ✅ FIXED: Added data validation
@app.route('/meet_status', methods=['POST'])
def meet_status():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    user = data['email']
    details = doctors.find_one({'email': user})
    if details['meet'] == True:
        return jsonify({'message': 'Doctor is already in a meet', 'link': details.get('link', '')}), 208
    else:
        if data.get('link', '') == '':
            doctors.update_one({'email': user}, {'$set': {'meet': True}})
        else:
            doctors.update_one({'email': user}, {'$set': {'meet': True, 'link': data['link']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

# ✅ FIXED: Added data validation
@app.route('/delete_meet', methods=['PUT'])
def delete_meet():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    doctors.update_one({'email': email}, {'$unset': {'link': None, 'currentlyInMeet': None}})
    doctors.update_one({'email': email}, {'$set': {'meet': False}})

    return jsonify({'message': 'Meet link deleted successfully'}), 200

# ✅ FIXED: Added data validation
@app.route('/currently_in_meet', methods=['POST', 'PUT'])
def currently_in_meet():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    if request.method == 'PUT':
        doctors.update_one({'email': email}, {'$set': {'currentlyInMeet': True}})
        return jsonify({'message': 'Currently in meet'}), 200
    else:
        doc = doctors.find_one({'email': email})
        return jsonify({'message': 'Currently in meet', 'curmeet': doc.get('currentlyInMeet', False)}), 200
    
# @app.route('/delete_currently_in_meet', methods=['PUT'])
# def delete_currently_in_meet():
#     data = request.get_json()
#     email = data['email']
#     return jsonify({'message': 'Not Currently in meet'}), 200
    
# ✅ FIXED: Added data validation
@app.route("/doctor_avilability", methods=['PUT'])
def doctor_avilability():
    data = request.get_json()
    if not data or 'demail' not in data:
        return jsonify({'error': 'Doctor email is required'}), 400
    demail = data['demail']
    doctors.update_one({'email': demail}, {'$set': {'status': 'online'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

# ----------- orders routes -----------------
@app.route("/add_order", methods=['POST'])
def add_order():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        patients.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    else:
        var = doctors.find_one({"email":email})
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        doctors.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    
# ✅ FIXED: Added JWT auth to prevent IDOR vulnerability - verify user is requesting their own orders
@app.route("/get_orders", methods=['POST'])
@jwt_required()
def get_orders():
    from flask_jwt_extended import get_jwt_identity
    
    data = request.get_json()
    email = data['email']
    # Verify JWT identity matches requested email
    current_user_email = get_jwt_identity()
    if current_user_email != email:
        return jsonify({'error': 'Unauthorized - cannot access other users orders'}), 403
    
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200

@app.route('/update_details', methods=['PUT'])
def update_details():
    data = None
    email = None
    usertype = None
    cloudinary_url = None

    # Handle form-data request
    if 'email' in request.form and 'usertype' in request.form:
        data = request.form.to_dict()
        email = data.get('email')
        usertype = data.get('usertype')

    if not email or not usertype:
        return jsonify({'message': 'Email and usertype are required'}), 400

    # Check if an image file is sent
    if 'profile_picture' in request.files:
        image_file = request.files['profile_picture']
        cloudinary_url = upload_file(image_file)  

    update_data = {}

    # Fields to update (only if provided in request)
    if 'username' in data:
        update_data['username'] = data['username']
    if 'phone' in data:
        update_data['phone'] = data['phone']
    if 'gender' in data:
        update_data['gender'] = data['gender']
    if 'profile_picture' in request.files:
        update_data['profile_picture'] = cloudinary_url

    if usertype == 'doctor':
        if 'specialization' in data:
            update_data['specialization'] = data['specialization']
        if 'fee' in data:
            update_data['fee'] = data['fee']
        if 'doctorId' in data:
            update_data['doctorId'] = data['doctorId']
    else:  # usertype == 'patient'
        if 'age' in data:
            update_data['age'] = data['age']

    # Handle password update separately
    if 'passwd' in data and data['passwd']:
        hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
        update_data['passwd'] = hashed_password

    # Update in MongoDB
    collection = doctors if usertype == 'doctor' else patients
    result = collection.update_one({'email': email}, {'$set': update_data})

    # Check if a document was updated
    if result.matched_count == 0:
        return jsonify({'message': 'User Not Found'}), 404

    if result.modified_count > 0:
        updated_user = collection.find_one({'email': email}) 

        response = {'message': f'{usertype.capitalize()} details updated successfully'}

        # Add only existing fields to the response
        for field in ["username", "usertype", "gender", "phone", "email", "age", "profile_picture"]:
            if field in updated_user:
                response[field] = updated_user[field]

        return jsonify(response), 200
    else:
        return jsonify({'message': 'No changes made'}), 200 

# ----------- cart routes -----------------

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not data.get('cart'):
            return jsonify({'error': 'Cart is required'}), 400
            
        var = pats.find_one({'email': email})
        if var:
            cart = var.get('cart', [])
            for i in data["cart"]:
                for j in cart:
                    if j['id'] == i['id']:
                        j['quantity'] = i['quantity']
                        break
                else:
                    i['key'] = str(uuid.uuid4())
                    cart.append(i)
            pats.update_one({'email': email}, {'$set': {'cart': cart}})
            return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
        else:
            var = docs.find_one({"email":email})
            if var:
                cart = var.get('cart', [])
                for i in data["cart"]:
                    for j in cart:
                        if j['id'] == i['id']:
                            j['quantity'] = i['quantity']
                            break
                    else:
                        i['key'] = str(uuid.uuid4())
                        cart.append(i)
                docs.update_one({"email":email}, {'$set': {'cart': cart}})
                return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"[Error in add_to_cart]: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route("/get_cart", methods=['POST'])
def get_cart():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        var = pats.find_one({'email':email})
        if var:
            return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200
        else:
            var = docs.find_one({'email': email})
            if var:
                return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200
            else:
                return jsonify({'message': 'Cart', 'cart': []}), 200
    except Exception as e:
        print(f"[Error in get_cart]: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/increase_quantity', methods=['POST'])
def increase_quantity():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        item_id = data.get('id')
        
        if not email or not item_id:
            return jsonify({'error': 'Email and id are required'}), 400
            
        var = pats.find_one({'email': email})
        if var:
            for i in var.get('cart', []):
                if i['id'] == item_id:
                    i['quantity'] += 1
                    break
            pats.update_one({'email': email}, {'$set': {'cart': var['cart']}})
            return jsonify({'message': 'Quantity increased successfully'}), 200
        else:
            var = docs.find_one({'email': email})
            if var:
                for i in var.get('cart', []):
                    if i['id'] == item_id:
                        i['quantity'] += 1
                        break
                docs.update_one({'email': email}, {'$set': {'cart': var['cart']}})
                return jsonify({'message': 'Quantity increased successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"[Error in increase_quantity]: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/decrease_quantity', methods=['POST'])
def decrease_quantity():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        item_id = data.get('id')
        
        if not email or not item_id:
            return jsonify({'error': 'Email and id are required'}), 400
            
        var = pats.find_one({'email': email})
        if var:
            for i in var.get('cart', []):
                if i['id'] == item_id:
                    i['quantity'] -= 1
                    break
            pats.update_one({'email': email}, {'$set': {'cart': var['cart']}})
            return jsonify({'message': 'Quantity decreased successfully'}), 200
        else:
            var = docs.find_one({'email': email})
            if var:
                for i in var.get('cart', []):
                    if i['id'] == item_id:
                        i['quantity'] -= 1
                        break
                docs.update_one({'email': email}, {'$set': {'cart': var['cart']}})
                return jsonify({'message': 'Quantity decreased successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"[Error in decrease_quantity]: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route("/delete_cart", methods=['POST'])
def delete_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        patients.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        doctors.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    
@app.route("/delete_all_cart", methods=['POST'])
def delete_all_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({"email": email})
    if var:
        patients.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        doctors.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200


# ----------- wallet routes -----------------

@app.route('/wallet', methods=['POST'])
def wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        doctors.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200

@app.route('/get_wallet', methods=['POST'])
def get_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200

@app.route("/debit_wallet", methods=['POST'])
def debit_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if data.get('demail', False):
        demail = data['demail']
        doc = doctors.find_one({'email': demail})
        wallet = var.get('wallet', 0)-round(float(doc.get('fee', 0)))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully', "fee":float(doc.get('fee', 0)) }), 200
    else:
        if var:
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
        else:
            var = doctors.find_one({'email': email})
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            doctors.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
    
# ✅ FIXED: Added JWT authentication
@app.route('/add_wallet_history', methods=['POST'])
@jwt_required()
def add_wallet_history():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        var = pats.find_one({'email': email})
        if var:
            history = var.get('wallet_history', [])
            history.append(data.get('history'))
            pats.update_one({'email': email}, {'$set': {'wallet_history': history}})
            return jsonify({'message': 'Wallet history added successfully'}), 200
        else:
            var = docs.find_one({'email': email})
            if var:
                history = var.get('wallet_history', [])
                history.append(data.get('history'))
                docs.update_one({'email': email}, {'$set': {'wallet_history': history}})
                return jsonify({'message': 'Wallet history added successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"[Error in add_wallet_history]: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
# ✅ FIXED: Added JWT authentication
@app.route('/get_wallet_history', methods=['POST'])
@jwt_required()
def get_wallet_history():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        var = pats.find_one({'email': email})
        if var:
            return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200
        else:
            var = docs.find_one({'email': email})
            if var:
                return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200
            else:
                return jsonify({'message': 'Wallet history', 'wallet_history': []}), 200
    except Exception as e:
        print(f"[Error in get_wallet_history]: {str(e)}")
        return jsonify({'error': str(e)}), 500

#------------ feedback route ------------------------------
# ✅ FIXED: Added JWT authentication
@app.route('/website_feedback', methods=['POST'])
@jwt_required()
def save_website_feedback():
    try:
        docs, pats, feeds = get_db_collections()
        if pats is None or docs is None or feeds is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        data = request.get_json()
       
        # Extract required details
        user_email = data.get("email")
        rating = data.get("rating", 0)
        comments = data.get("comments", "")
        feedback_type = data.get("feedback_type", "")
        timestamp = data.get("timestamp", "")
        keep_it_anonymous = data.get("keep_it_anonymous", False)

        # Fetch patient details using email
        user = pats.find_one({"email": user_email}, {"_id": 0, "username": 1, "profile_picture": 1})
        if not user:
           user = docs.find_one({"email": user_email}, {"_id": 0, "username": 1, "profile_picture": 1})
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        feedback_entry = {
            "user_email": user_email,
            "rating": rating,
            "comments": comments,
            "username": user.get("username", ""),  
            "profile_picture": user.get("profile_picture", ""), 
            "keep_it_anonymous": keep_it_anonymous,
            "feedback_type": feedback_type,
            "timestamp" : timestamp
        }

        feeds.insert_one(feedback_entry)
        return jsonify({"message": "Feedback Saved Successfully"}), 200
    except Exception as e:
        print(f"[Error in save_website_feedback]: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/website_feedback',methods=['GET'])
def get_all_website_feedback():
    try:
        docs, pats, feeds = get_db_collections()
        if feeds is None:
            return jsonify({'error': 'Database not connected'}), 500
            
        feedbacks = list(feeds.find({}, {"_id": 0}))
        for feedback in feedbacks:
            if feedback.get("keep_it_anonymous"):
                feedback.pop("username", None)
                feedback.pop("user_email", None)
        return jsonify(feedbacks), 200
    except Exception as e:
        print(f"[Error in get_all_website_feedback]: {str(e)}")
        return jsonify({"error": str(e)}), 500       
        
@app.route('/website_feedback/<id>', methods=['GET'])
def get_website_feedback(id):
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(id)

        # Fetch feedback using the converted ObjectId
        result = website_feedback.find({'_id': object_id}, {"_id": 0})

        if result:
            if result.get("keep_it_anonymous"):
                result.pop("username", None)
                result.pop("user_email", None)
            return jsonify({"message": "Feedback found", "data": result}), 200
        else:
            return jsonify({"message": "Feedback Not Found"}), 404    

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ----------- email for contact us routes -----------------
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    try:
        # Send email notification
        msg = Message(
            subject=f"New Contact Form Submission: {data['subject']}",
            sender=data['email'],
            # ✅ FIXED: Use environment variable instead of hardcoded email
            recipients=[os.getenv('FEEDBACK_EMAIL', 'admin@ai-medlab.com')],
            body=f"""
            New contact form submission from:
            Name: {data['name']}
            Email: {data['email']}
            Subject: {data['subject']}
            Message: {data['message']}
            """
        )
        mail.send(msg)
        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ----------- Analyze Report -----------------

# @app.route('/analyze_pdf', methods=['POST'])
# def analyze_pdf():
#     if 'pdf' not in request.files:
#         return jsonify({"error": "No PDF file provided"}), 400

#     # Get user input if available
#     user_input = request.form.get("user_input", "")

#     pdf_file = request.files['pdf']
#     pdf_path = os.path.join(app.root_path, 'report.pdf')
#     pdf_file.save(pdf_path)

#     extracted_text = extract_text_from_pdf(pdf_path)

#     try:
#         os.remove(pdf_path)
#     except Exception as e:
#         print(f"Error deleting file: {e}")

#     if not extracted_text:
#         return jsonify({"error": "No text extracted from PDF"}), 400
    
#     prompt = f"""
#         You are a medical assistant. Analyze the following medical lab report and summarize only the abnormal or deficient parameters.

#         Additional user info to consider: {user_input}

#         ⚠️ Return your response strictly in markdown format using the structure below for each abnormal element. Wrap the entire response inside triple backticks (```markdown). Use bullet points where indicated.

#         Format (Markdown):
#         ```
#         ### **Element - Value (Status)**
# ---

# **Concern:**
# <brief explanation>

# **Treatment Suggestions:**
# - **Diet**

#   **Veg -** <veg options>
  
#   **Non-veg -** <non-veg options>
# - **Supplements:** <recommended supplements>
# - **Tips:** <lifestyle tips>
# ```

#         Only use this format. At the end, provide a short summary (2-3 lines) what action should be taken.
        
#         Here is the lab report:
#         {extracted_text}
#         """
    
#     response = model.generate_content(prompt)
#     return jsonify({"summary": response.text})

if __name__ == "__main__":
    print("Starting AI-MedLab Backend Server...")
    app.run(host="0.0.0.0", port=5000, debug=False)
