from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import keras
keras.config.enable_unsafe_deserialization()
import numpy as np
from PIL import Image
import io

import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


app = Flask(__name__)
CORS(app)

# Load Alzheimer and Tumor models
# Load them once when the app starts
alz_model = load_model('model/prev/ADD_BrainMNet_ensemble.keras', compile=False)
tumor_model = load_model('model/prev/BTD_BrainMNet_ensemble.keras', compile=False)
print("✅ Models loaded successfully!")

# Class names
alz_classes = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]
tumor_classes = ["Glioma", "Pituitary", "Meningioma", "NoTumor"]

# Define the "no disease" class for each model (using the actual class name string)
ALZ_HEALTHY_CLASS = "NonDemented"
TUMOR_HEALTHY_CLASS = "NoTumor"

# Disease info (unchanged)
disease_info = {
    "Alzheimer": {
        "symptoms": "Memory loss, confusion, difficulty completing familiar tasks...",
        "precautions": "Regular mental exercise, healthy diet, social engagement..."
    },
    "Tumor": {
        "symptoms": "Headaches, seizures, nausea, balance problems...",
        "precautions": "Regular check-ups, avoid radiation exposure..."
    }
}

def prepare_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/')
def home():
    return {"status": "Backend is running."}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        patient_name = request.form.get('patientName')
        age = request.form.get('age')
        file = request.files.get('image')
        # Crucial: Get the diseaseType from the request
        disease_type_requested = request.form.get('diseaseType')

        if not all([patient_name, age, file, disease_type_requested]):
            return jsonify({"error": "Missing form data (patientName, age, image, or diseaseType)"}), 400

        if disease_type_requested not in ["Alzheimer", "Tumor"]:
            return jsonify({"error": "Invalid 'diseaseType'. Must be 'Alzheimer' or 'Tumor'."}), 400

        image_bytes = file.read()
        processed_img = prepare_image(image_bytes)

        # Initialize response variables
        final_disease = "N/A" # Will be overridden based on selection
        final_subclass = "N/A"
        final_confidence = 0.0
        final_symptoms = ""
        final_precautions = ""
        raw_model_preds = []

        # Define a minimum confidence threshold for a *positive* disease detection
        # This threshold is still important for determining if a positive diagnosis is confident enough.
        DISEASE_CONFIDENCE_THRESHOLD = 0.75 # You may need to tune this

        if disease_type_requested == "Alzheimer":
            alz_pred_probs = alz_model.predict(processed_img)[0]
            raw_model_preds = alz_pred_probs.tolist() # Store raw preds for response

            alz_predicted_idx = np.argmax(alz_pred_probs)
            alz_predicted_subclass = alz_classes[alz_predicted_idx]
            alz_confidence_for_subclass = float(alz_pred_probs[alz_predicted_idx])

            if alz_predicted_subclass != ALZ_HEALTHY_CLASS and \
               alz_confidence_for_subclass >= DISEASE_CONFIDENCE_THRESHOLD:
                final_disease = "Alzheimer"
                final_subclass = alz_predicted_subclass
                final_confidence = round(alz_confidence_for_subclass * 100, 2)
                final_symptoms = disease_info["Alzheimer"]["symptoms"]
                final_precautions = disease_info["Alzheimer"]["precautions"]
            else:
                # Detected as NonDemented or a dementia class below threshold
                final_disease = "No Alzheimer's Detected" # More specific phrasing
                final_subclass = ALZ_HEALTHY_CLASS # You can also specify alz_predicted_subclass here
                final_confidence = round(alz_confidence_for_subclass * 100, 2) # Confidence in the predicted subclass (likely NonDemented)

        elif disease_type_requested == "Tumor":
            tumor_pred_probs = tumor_model.predict(processed_img)[0]
            raw_model_preds = tumor_pred_probs.tolist() # Store raw preds for response

            tumor_predicted_idx = np.argmax(tumor_pred_probs)
            tumor_predicted_subclass = tumor_classes[tumor_predicted_idx]
            tumor_confidence_for_subclass = float(tumor_pred_probs[tumor_predicted_idx])

            if tumor_predicted_subclass != TUMOR_HEALTHY_CLASS and \
               tumor_confidence_for_subclass >= DISEASE_CONFIDENCE_THRESHOLD:
                final_disease = "Tumor"
                final_subclass = tumor_predicted_subclass
                final_confidence = round(tumor_confidence_for_subclass * 100, 2)
                final_symptoms = disease_info["Tumor"]["symptoms"]
                final_precautions = disease_info["Tumor"]["precautions"]
            else:
                # Detected as NoTumor or a tumor class below threshold
                final_disease = "No Tumor Detected" # More specific phrasing
                final_subclass = TUMOR_HEALTHY_CLASS # You can also specify tumor_predicted_subclass here
                final_confidence = round(tumor_confidence_for_subclass * 100, 2) # Confidence in the predicted subclass (likely NoTumor)


        response = {
            "patientName": patient_name,
            "age": age,
            "requestedDiseaseType": disease_type_requested, # Confirm what was requested
            "detectionResult": final_disease, # Use a more generic key as it depends on selection
            "subclass": final_subclass,
            "confidence": final_confidence,
            "symptoms": final_symptoms,
            "precautions": final_precautions,
            "raw_model_preds": raw_model_preds # Raw predictions from the specific model used
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)