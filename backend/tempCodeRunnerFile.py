from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import keras 
keras.config.enable_unsafe_deserialization()
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load Alzheimer and Tumor models
alz_model = load_model('model/prev/ADD_BrainMNet_ensemble.keras', compile=False)
tumor_model = load_model('model/prev/BTD_BrainMNet_ensemble.keras', compile=False)
print("✅ Models loaded successfully!")

# Class names
alz_classes = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]
tumor_classes = ["Glioma", "Pituitary", "Meningioma", "NoTumor"]

# Disease info
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
        patient_name = request.form['patientName']
        age = request.form['age']
        file = request.files['image']
        image_bytes = file.read()
        processed_img = prepare_image(image_bytes)

        # Predict from both models
        alz_pred = alz_model.predict(processed_img)[0]
        tumor_pred = tumor_model.predict(processed_img)[0]

        alz_conf = np.max(alz_pred)
        tumor_conf = np.max(tumor_pred)

        if alz_conf > tumor_conf:
            class_index = np.argmax(alz_pred)
            subclass = alz_classes[class_index]
            disease = "Alzheimer"
            confidence = round(alz_conf * 100, 2)
        else:
            class_index = np.argmax(tumor_pred)
            subclass = tumor_classes[class_index]
            disease = "Tumor"
            confidence = round(tumor_conf * 100, 2)

        response = {
            "patientName": patient_name,
            "age": age,
            "disease": disease,
            "subclass": subclass,
            "confidence": float(np.max(confidence) * 100),
            "symptoms": disease_info[disease]["symptoms"],
            "precautions": disease_info[disease]["precautions"]
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
