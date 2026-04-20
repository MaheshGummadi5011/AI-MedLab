from flask import Flask, jsonify, request

import numpy as np
import pandas as pd
import pickle
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

model = pickle.load(open('ExtraTrees', 'rb'))

diseases = [ '(vertigo) Paroymsal Positional Vertigo', 'AIDS', 'Acne', 'Alcoholic hepatitis', 'Allergy', 'Arthritis', 'Bronchial Asthma', 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 'Common Cold', 'Dengue', 'Diabetes', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction', 'Fungal infection', 'GERD', 'Gastroenteritis', 'Heart attack', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hypertension', 'Hyperthyroidism', 'Hypoglycemia', 'Hypothyroidism', 'Impetigo', 'Jaundice', 'Malaria', 'Migraine', 'Osteoarthristis', 'Paralysis (brain hemorrhage)', 'Peptic ulcer diseae', 'Pneumonia', 'Psoriasis', 'Tuberculosis', 'Typhoid', 'Urinary tract infection', 'Varicose veins', 'hepatitis A' ]

symptoms =  ['Disease', 'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze', 'prognosis', 'skin_rash', 'mood_swings', 'weight_loss', 'fast_heart_rate', 'excessive_hunger', 'muscle_weakness', 'abnormal_menstruation', 'muscle_wasting', 'patches_in_throat', 'high_fever', 'extra_marital_contacts', 'yellowish_skin', 'loss_of_appetite', 'abdominal_pain', 'yellowing_of_eyes', 'chest_pain', 'loss_of_balance', 'lack_of_concentration', 'blurred_and_distorted_vision', 'drying_and_tingling_lips', 'slurred_speech', 'stiff_neck', 'swelling_joints', 'painful_walking', 'dark_urine', 'yellow_urine', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'visual_disturbances', 'burning_micturition', 'bladder_discomfort', 'foul_smell_of_urine', 'continuous_feel_of_urine', 'irregular_sugar_level', 'increased_appetite', 'joint_pain', 'skin_peeling', 'small_dents_in_nails', 'inflammatory_nails', 'swelling_of_stomach', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'acute_liver_failure', 'stomach_bleeding', 'back_pain', 'weakness_in_limbs', 'neck_pain', 'mucoid_sputum', 'mild_fever', 'muscle_pain', 'family_history', 'continuous_sneezing', 'watering_from_eyes', 'rusty_sputum', 'weight_gain', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'swollen_legs', 'prominent_veins_on_calf', 'stomach_pain', 'spinning_movements', 'sunken_eyes', 'silver_like_dusting', 'swelled_lymph_nodes', 'blood_in_sputum', 'swollen_blood_vessels', 'toxic_look_(typhos)', 'belly_pain', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'loss_of_smell', 'passage_of_gases', 'cold_hands_and_feets', 'weakness_of_one_body_side', 'altered_sensorium', 'nodal_skin_eruptions', 'red_sore_around_nose', 'yellow_crust_ooze', 'ulcers_on_tongue', 'spotting_urination', 'pain_behind_the_eyes', 'red_spots_over_body', 'internal_itching']

print(len(symptoms)) 
desc=pd.read_csv("symptom_Description.csv")
prec=pd.read_csv("symptom_precaution.csv") 

# Root endpoint for health check and CORS preflight handling
@app.route('/', methods=['GET', 'OPTIONS'])
def root():
    return jsonify({'status': 'Models API running', 'version': '1.0'}), 200

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json(force=True)
    print("Received Data:", data)
    
    if not data:
        return jsonify({'error': 'No symptoms provided'}), 400
    
    if len(data) < 2:
        return jsonify({'error': 'At least 2 symptoms are required for accurate prediction'}), 400

    # Count matched symptoms
    matched_symptoms = 0
    
    # Create feature vector
    features = [0] * len(symptoms)
    for symptom in data:
        if symptom in symptoms:
            index = symptoms.index(symptom)
            features[index] = 1
            matched_symptoms += 1
        else:
            print(f"Symptom not found: {symptom}")
    
    print("Feature Vector:", features)
    print(f"Matched {matched_symptoms} symptoms out of {len(data)} provided")
    
    # Check if we have enough matched symptoms
    if matched_symptoms < 2:
        return jsonify({'error': 'Not enough recognized symptoms. Please provide more symptoms.'}), 400

    # Model prediction
    try:
        proba = model.predict_proba([features])
        print("Prediction Probabilities:", proba)
        
        # Check if we have meaningful prediction values
        max_probability = max(proba[0])
        if max_probability < 0.1:  # If highest probability is less than 10%
            return jsonify({'error': 'The symptom combination does not match known disease patterns. Please provide more specific symptoms.'}), 400
            
    except Exception as e:
        print(f"Model Prediction Error: {str(e)}")
        return jsonify({'error': str(e), 'message': 'Prediction failed.'}), 500

    # Process results
    top5_idx = np.argsort(proba[0])[-5:][::-1]
    top5_proba = np.sort(proba[0])[-5:][::-1]
    top5_diseases = [diseases[i] for i in top5_idx]

    response = []
    for i in range(3):
        disease = top5_diseases[i]
        probability = top5_proba[i]
        disp = desc[desc['Disease'] == disease].values[0][1] if disease in desc["Disease"].unique() else "No description available"
        precautions = []
        if disease in prec["Disease"].unique():
            c = np.where(prec['Disease'] == disease)[0][0]
            for j in range(1, len(prec.iloc[c])):
                precautions.append(prec.iloc[c, j])
        response.append({
            'disease': disease,
            'probability': float(probability),
            'description': disp,
            'precautions': precautions
        })
    return jsonify(response)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))  # Default to 5002 for model service
    print(f"🚀 Starting Model Prediction Service on port {port}")
    print(f"📍 Accessible at http://0.0.0.0:{port}")
    try:
        app.run(host="0.0.0.0", port=port, debug=False, use_reloader=False)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {port} is already in use. Try:")
            print(f"   - Kill existing process: netstat -ano | findstr :{port}")
            print(f"   - Or change PORT environment variable: set PORT=5003")
        raise